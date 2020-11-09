// user.model.js
var mongoose = require("mongoose");
require('mongoose-type-email');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const STATUS = require('./constants/status');

const competence = new Schema({
  titre: { type: String, required: true },
  niveau: { type: Double, required: true },
  version: { type: String },
  _id: false
});

const formation = new Schema({
  titre: { type: String, required: true },
  filiere: [String],
  niveau: { type: String, required: true },
  etablissement: { type: String, required: true },
  debut: { type: String },
  fin: { type: String },
  _id: false
});

// Setup schema
const offreSchema = new Schema({

  numOffre: Number,
  description: String,
  titreOffre: {
    type: String,
    required: true
  },
  status: {
    type: STATUS,
    default: STATUS.SALARIE_CDI,
    required: true
  },
  entreprise: {
    type: ObjectId,
    ref: 'entreprise'
  },
  listeCandidats: [{
    type: ObjectId,
    ref: 'profil'
  }],
  dateLimit: String,
  competencesRequises: [competence],
  formationsRequises: [formation],
  avantages: [String],
  salaire: Double,
  publish: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Export Profil model
const Offre = (module.exports = mongoose.model("offre", offreSchema));

module.exports.get = function (callback, limit) {
  Offre.find(callback).limit(limit);
};
