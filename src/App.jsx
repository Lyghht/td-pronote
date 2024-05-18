import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import Loading from "./Components/loading";
//import './App.css'
import AccueilIUT from './Components/accueil'
import Header from './Components/header'
import Etudiants from './Components/Etudiants'
import Enseignants from "./Components/Enseignants"
import Note from "./Components/Note"
import Matiere from "./Components/Matiere"

function App() {

  const [loading, setLoading] = useState(true);
  

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  // Page de chargement pendant 2 secondes à la première ouverture de l'application
  if (loading === true && window.location.pathname === '/') {
    return <Loading />;
  }
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
