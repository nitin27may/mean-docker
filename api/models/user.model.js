// user.model.js
var mongoose = require("mongoose");
require('mongoose-type-email');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const ROLE = require('./constants/role');

// Setup schema
const userSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: ROLE,
    default: ROLE.CANDIDAT,
    required: true
  },
  notifications: {
    email: { type: Boolean, default: true },
    notifyByEmailOnTransfer: { type: Boolean }
  },
  profils: [{
    type: ObjectId,
    ref: 'profil'
  }],
  active: {
    type: Boolean,
    default: true
  },
  token: String,
  mobile: String,
  birthdate: String,
  nationality: String,
  pays: String,
  city: String,
  adresse: String,

}, {
  timestamps: true
});

// Export User model
const User = (module.exports = mongoose.model("user", userSchema));

module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
};
