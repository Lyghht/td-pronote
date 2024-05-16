const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
  NumEtudiant: {
    type: Number,
    required: true,
    unique: true
  },
  Nom: {
    type: String,
    required: true
  },
  Prenom: {
    type: String,
    required: true
  },
  DatenET: {
    type: String,
    required: true
  }
});

const Etudiant = mongoose.model('Etudiant', etudiantSchema, 'Etudiants');

module.exports = Etudiant;