// .env file configuration
const env = require("./config/env");
let express = require("express");
let app = express();
const environment = require("./config/environment");
let cors = require("cors");
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
  useNewUrlParser: true,
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

// Import routes
let apiRoutes = require("./api-routes");

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(
  expressJwt({
    secret: environment.secret,
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
    },
  }).unless({ path: ["/api/user/authenticate", "/api/users"] })
);

// Use Api routes in the App
app.use("/api", apiRoutes);

// start server
// Launch app to listen to specified port
const server = app.listen(process.env.EXPRESS_PORT || 3000, () => {
  const port = server.address().port;
  console.log("app running on port", port);
});
