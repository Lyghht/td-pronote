import './accueil.css';

function AccueilIUT() {
  return (
    <>
        <div className="container mt-4 mb-4 text-center">
            <h1>Bienvenue sur Nota</h1>
        </div>
        <div className="container mt-4 mb-4 text-center">
          <img src="/src/assets/media/logo-nota.png" style={{width: "200px",height: "200px"}} alt="Nota" />
        </div>
        <div className="container mt-4 mb-4 text-center">
          <div className="card" style={{display: "inline-block"}}>
            <div className="card-body">
              <h2 className="card-title">Informations de contact</h2>
              <p className="card-text">Avenue des Facultés</p>
              <p className="card-text">- Le Bailly -</p>
              <p className="card-text mb-4"> 80025 AMIENS Cedex 1</p>
              <p className="card-text">Tél. +33(0)3.22.53.40.40</p>
              <p className="card-text">Fax. +33(0)3.22.89.66.33</p>
            </div>
          </div>
        </div>
        <img src="./src/assets/media/logo-IUT.png" alt="IUT" className="bottom-right-image" />
    </>
  );
}

export default AccueilIUT;