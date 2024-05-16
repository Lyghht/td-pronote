const mongoose = require('mongoose');

const enseignantSchema = new mongoose.Schema({
  CodeEns: {
    type: Number,
    required: true,
    unique: true
  },
  NomEns: {
    type: String,
    required: true
  },
  PrenomEns: {
    type: String,
    required: true
  },
  GradeEns: {
    type: String,
    required: true
  },
  CodeMat: {
    type: Number,
    required: true
  }
});

const Enseignant = mongoose.model('Enseignant', enseignantSchema, 'Enseignants');

module.exports = Enseignant;