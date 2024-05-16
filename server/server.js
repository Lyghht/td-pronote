const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Etudiant = require('./models/etudiant');
const Enseignant = require('./models/enseignant');
const Matiere = require('./models/matiere');
const Note = require('./models/note');

const app = express();
app.use(express.json());
const port = 4000;
app.use(cors());

app.listen(port, () => {
console.log(`Server is running on port ${port}`) })

const uriAtlas = "mongodb://localhost:27017/mon-universiteDB";
mongoose.connect(uriAtlas).then(()=> console.log("successful connexion DB"));


/*

Route pour Etudiants

*/
app.get("/Etudiants", async (req, res) => {
  try {
    const results = await Etudiant.find({});
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/Etudiants/add", async (req, res) => {
  let newEtudiant = new Etudiant(req.body);
  try {
    await newEtudiant.save();
    res.status(200).send({ message: `${newEtud.Nom} à bien été ajouté.` });
  } catch (err) {
    res.status(400).send({error: `Erreur lors de l'ajout de l'étudiant :  ${err}`});
  }
});

app.put("/Etudiants/update/:id", async (req, res) => {
  try {
    const changeEtudiant = await Etudiant.findByIdAndUpdate(req.params.id, req.body);
    await changeEtudiant.save();
    res.status(200).send({ message: `L'étudiant ${changeEtudiant.Nom} à bien été modifié.` });
  } catch (err) {
    res.status(400).send({error: `Erreur lors de la modification de l'étudiant :  ${err}`});
  }
});

app.delete("/Etudiants/delete/:id", async (req, res) => {
  try {
    const deleteEtudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!deleteEtudiant) {
      res.status(404).send({ error: "L'étudiant n'a pas été trouvé." });
    }
    res.status(200).send({ message: `L'étudiant ${deleteEtudiant.Nom} à bien été supprimé.` });
  } catch (err) {
    res.status(500).send(err);
  }
});

/*

Route pour Enseignants
  
*/

app.get("/Enseignants", async (req, res) => {
  try {
    const results = await Enseignant.find({});
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/Enseignants/add", async (req, res) => {
  let newEnseignant = new Enseignant(req.body);
  try {
    await newEnseignant.save();
    res.status(200).send({ message: `${newEnseignant.NomEns} à bien été ajouté.` });
  } catch (err) {
    res.status(400).send({error: `Erreur lors de l'ajout de l'enseignant :  ${err}`});
  }
});

app.put("/Enseignants/update/:id", async (req, res) => {
  try {
    const changeEnseignant = await Enseignant.findByIdAndUpdate(req.params.id, req.body);
    await changeEnseignant.save();
    res.status(200).send({ message: `L'enseignant ${changeEnseignant.NomEns} à bien été modifié.` });
  } catch (err) {
    res.status(400).send({error: `Erreur lors de la modification de l'enseignant :  ${err}`});
  }
});

app.delete("/Enseignants/delete/:id", async (req, res) => {
  try {
    const deleteEnseignant = await Enseignant.findByIdAndDelete(req.params.id);
    if (!deleteEnseignant) {
      res.status(404).send({ error: "L'enseignant n'a pas été trouvé." });
    }
    res.status(200).send({ message: `L'enseignant ${deleteEnseignant.NomEns} à bien été supprimé.` });
  } catch (err) {
    res.status(500).send(err);
  }
});

/*

Route pour Matieres

*/

app.get("/Matieres", async (req, res) => {
  try {
    const results = await Matiere.find({});
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/Matieres/add", async (req, res) => {
  let newMatiere = new Matiere(req.body);
  try {
    await newMatiere.save();
    res.status(200).send({ message: `${newMatiere.LibelleMat} à bien été ajouté.` });
  } catch (err) {
    res.status(400).send({error: `Erreur lors de l'ajout de la matière :  ${err}`});
  }
});

app.put("/Matieres/update/:id", async (req, res) => {
  try {
    const changeMatiere = await Matiere.findByIdAndUpdate(req.params.id, req.body);
    await changeMatiere.save();
    res.status(200).send({ message: `La matière ${changeMatiere.LibelleMat} à bien été modifié.` });
  } catch (err) {
    res.status(400).send({error: `Erreur lors de la modification de la matière :  ${err}`});
  }
});

app.delete("/Matieres/delete/:id", async (req, res) => {
  try {
    const deleteMatiere = await Matiere.findByIdAndDelete(req.params.id);
    if (!deleteMatiere) {
      res.status(404).send({ error: "La matière n'a pas été trouvée." });
    }
    res.status(200).send({ message: `La matière ${deleteMatiere.LibelleMat} à bien été supprimé.` });
  } catch (err) {
    res.status(500).send(err);
  }
});

/*

Route pour Notes

*/

app.get("/Notes", async (req, res) => {
  try {
    const results = await Note.find({});
    res.send(results);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/Notes/add", async (req, res) => {
  let newNote = new Note(req.body);
  try {
    await newNote.save();
    res.status(200).send({ message: `La note de ${newNote.NumEtudiant} à bien été ajouté.` });
  } catch (err) {
    res.status(400).send({error: `Erreur lors de l'ajout de la note :  ${err}`});
  }
});

app.put("/Notes/update/:id", async (req, res) => {
  try {
    const changeNote = await Note.findByIdAndUpdate(req.params.id, req.body);
    await changeNote.save();
    res.status(200).send({ message: `La note de ${changeNote.NumEtudiant} à bien été modifié.` });
  } catch (err) {
    res.status(400).send({error: `Erreur lors de la modification de la note :  ${err}`});
  }
});

app.delete("/Notes/delete/:id", async (req, res) => {
  try {
    const deleteNote = await Note.findByIdAndDelete(req.params.id);
    if (!deleteNote) {
      res.status(404).send({ error: "La note n'a pas été trouvée." });
    }
    res.status(200).send({ message: `La note de ${deleteNote.NumEtudiant} à bien été supprimé.` });
  } catch (err) {
    res.status(500).send(err);
  }
});
