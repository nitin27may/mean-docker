// user.model.js
var mongoose = require("mongoose");
require('mongoose-type-email');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const STATUS = require('./constants/status');
// const niveau = require('./constants/niveau');

// Setup schema
const entrepriseSchema = new Schema({

  immatricularion: String,
  presentation: String,
  nomPublic: {
    type: String,
    required: true
  },
  status: {
    type: STATUS,
    default: STATUS.STARTUP,
    required: true
  },
  user: {
    type: ObjectId,
    ref: 'user'
  },
  nbSalaries: Number,
  mission: String,
  aspirations: [String],
  dateFondation: String,
  demandes: [{
    type: ObjectId,
    ref: 'demande'
  }],
  offres: [{
    type: ObjectId,
    ref: 'offre'
  }]
}, {
  timestamps: true
});

// Export Profil model
const Entreprise = (module.exports = mongoose.model("entreprise", entrepriseSchema));

module.exports.get = function (callback, limit) {
  Entreprise.find(callback).limit(limit);
};
