// user.model.js
var mongoose = require("mongoose");
require('mongoose-type-email');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const ROLE = require('./constants/role');
const STATUS = require('./constants/status');

// Setup schema
const profilSchema = new Schema({

  label: {
    type: String,
    required: true
  },
  status: {
    type: STATUS,
    default: STATUS.ETUDIANT,
    required: true
  },
  role: {
    type: ROLE,
    default: ROLE.CANDIDAT,
    required: true
  },
  documents: [{
    type: {
      type: String
    },
    name: String,
    link: String
  }],
  candidat: {
    type: ObjectId,
    ref: 'candidat',
    unique: true
  },
  entreprise: {
    type: ObjectId,
    ref: 'entreprise',
    unique: true
  },
  // contact: {
  //   type: ObjectId,
  //   ref: 'contact'
  // },
  accessKey: {
    type: String,
    default: '123456',
    required: true
  },
  secteur: [String],
  groupe: [String],
  aspirations: [String],
  group: String,


}, {
  timestamps: true
});

// Export Profil model
const Profil = (module.exports = mongoose.model("profil", profilSchema));

module.exports.get = function (callback, limit) {
  Profil.find(callback).limit(limit);
};
