const mongoose = require('mongoose');

const matiereSchema = new mongoose.Schema({
  CodeMat: {
    type: Number,
    required: true,
    unique: true
  },
  LibelleMat: {
    type: String,
    required: true
  },
  CoeffMat: {
    type: Number,
    required: true
  }
});

const Matiere = mongoose.model('Matiere', matiereSchema, 'Matieres');

module.exports = Matiere;
