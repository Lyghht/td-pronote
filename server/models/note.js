const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  NumEtudiant: {
    type: Number,
    required: true
  },
  CodeMat: {
    type: Number,
    required: true
  },
  Note: {
    type: Number,
    required: true
  },
  Date: {
    type: String,
    required: true
  }
});

const Note = mongoose.model('Note', noteSchema, 'Note');

module.exports = Note;
