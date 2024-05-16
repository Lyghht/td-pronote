import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
//import './App.css'
import AccueilIUT from './Components/accueil'
import Header from './Components/header'
import Etudiants from './Components/Etudiants'
import Enseignants from "./Components/Enseignants"
import Note from "./Components/Note"
import Matiere from "./Components/Matiere"

function App() {

  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<AccueilIUT />}/>
        <Route path="/etudiants" element={<Etudiants />}/>
        <Route path="/enseignants" element={<Enseignants />}/>
        <Route path="/note" element={<Note />}/>
        <Route path="/matiere" element={<Matiere />}/>     
      </Routes>
    </Router>
    </>
  )
}

export default App
