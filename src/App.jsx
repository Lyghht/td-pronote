import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
//import './App.css'
import AccueilIUT from './Components/accueil'
import Header from './Components/header'

function App() {

  return (
    <>
    <Header />
    <Router>
      
    </Router>
      <Route path="/" element={<AccueilIUT />}/>
      <Route path="/etudiants" element={<Etudiants />}/>
{/*       <Route path="/enseignants" element={<Enseignants />}/> */}
{/*       <Route path="/notes" element={<Notes />}/>
      <Route path="/matieres" element={<Matieres />}/> */}
    </>
  )
}

export default App
