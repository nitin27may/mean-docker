// user.model.js
var mongoose = require("mongoose");
require('mongoose-type-email');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const STATUS = require('./constants/status');

// Setup schema
const demandeSchema = new Schema({

  numDemande: Number,
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
  candidat: {
    type: ObjectId,
    ref: 'candidat'
  },
  listeEntreprise: [{
    type: ObjectId,
    ref: 'profil'
  }],
  dateDisponibilte: String,
  secteur: [String],
  salaire: Double,
  publish: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Export Profil model
const Demande = (module.exports = mongoose.model("demande", demandeSchema));

module.exports.get = function (callback, limit) {
  Demande.find(callback).limit(limit);
};
