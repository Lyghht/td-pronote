import './accueil.css';

function AccueilIUT() {
  return (
    <>
        <div className="container mt-4 mb-4 text-center">
            <h1>Bienvenue sur IUT-note</h1>
        </div>
        <div className="container mt-4 mb-4 text-center">
            <h2>Informations de contact</h2>
            <p>Avenue des Facultés</p>
            <p>- Le Bailly -</p>
            <p> 80025 AMIENS Cedex 1</p>
            <p></p>
            <p>Tél. +33(0)3.22.53.40.40</p>
            <p>Fax. +33(0)3.22.89.66.33</p>
        </div>
        <img src="./src/assets/media/logo-IUT.png" alt="IUT" className="bottom-right-image" />
    </>
  );
}

export default AccueilIUT;