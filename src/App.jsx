import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
//import './App.css'
import AccueilIUT from './Components/accueil'
import Header from './Components/header'
import Etudiants from './Components/Etudiants'

function App() {

  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<AccueilIUT />}/>
        <Route path="/etudiants" element={<Etudiants />}/>
  {/*       <Route path="/enseignants" element={<Enseignants />}/> */}
  {/*       <Route path="/notes" element={<Notes />}/>
        <Route path="/matieres" element={<Matieres />}/> */}      
      </Routes>
    </Router>

    </>
  )
}

export default App
