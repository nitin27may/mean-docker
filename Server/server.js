let express = require("express");
let app = express();
let cors = require("cors");
let bodyParser = require("body-parser");
let expressJwt = require("express-jwt");
// Import Mongoose
let mongoose = require("mongoose");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
mongoose.connect("mongodb://database/mongodb", {
  useNewUrlParser: true
});
var db = mongoose.connection;

// Added check for DB connection
if (!db) console.log("Error connecting db");
else console.log("Db connected successfully");

// Import routes
let apiRoutes = require("./api-routes");

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(
  expressJwt({
    secret: "Thisismyscretkey",
    getToken: function(req) {
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
  }).unless({ path: ["/api/user/authenticate", "/api/users"] })
);

// Use Api routes in the App
app.use("/api", apiRoutes);

// start server
let port = process.env.NODE_ENV ? process.env.NODE_ENV : 3000;
app.listen(port, function() {
  console.log("Server listening on port " + port);
});
