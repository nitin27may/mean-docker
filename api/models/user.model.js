// user.model.js
var mongoose = require("mongoose");
// Setup schema
var userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: String,
  email: String,
  mobile: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});
// Export User model
var User = (module.exports = mongoose.model("user", userSchema));
module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
};
