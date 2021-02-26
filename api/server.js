require("dotenv").config();
let express = require("express");
let app = express();
const environment = require("./config/environment");
let cors = require("cors");
let path = require("path");
let bodyParser = require("body-parser");
let expressJwt = require("express-jwt");
// Import Mongoose
let mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
// MongoDB connection
console.log("connection string", environment.mongodb.uri);
console.log("secret", environment.secret);
mongoose.connect(environment.mongodb.uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;

// On connection error
mongoose.connection.on("error", (error) => {
  console.log("Database error: ", error);
});

// On successful connection
mongoose.connection.on("connected", () => {
  console.log("Connected to database");
});

// addtional configuration when serving Angular SPA (static reource and Anugalr routing)
const allowedExt = [
  ".js",
  ".ico",
  ".css",
  ".png",
  ".jpg",
  ".woff2",
  ".woff",
  ".ttf",
  ".svg",
  ".webmanifest",
  ".html",
  ".txt"
];


// Import routes
let apiRoutes = require("./api-routes");
app.get("*", (req, res) => {
  if (allowedExt.filter((ext) => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`public/${req.url}`));
  } else {
    res.sendFile(path.resolve("public/index.html"));
  }
});

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(
  expressJwt({
    secret: environment.secret,
    algorithms: ["HS256"],
    getToken: function (req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  }).unless({
    path: [
      "/api/user/authenticate",
      "/api/users",
      "/index.html",
      "/*.js",
      "/*.css"
    ]
  })
);

// Use Api routes in the App
app.use("/api", apiRoutes);






const HOST = "0.0.0.0";
// start server
// Launch app to listen to specified port
const server = app.listen(process.env.EXPRESS_PORT || 3000, HOST, () => {
  const PORT = server.address().port;
  console.log(`Running  on http://${HOST}:${PORT}`);
});
