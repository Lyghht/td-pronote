
function Header() {
    return (
        <header>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>


            <nav className="navbar navbar-expand navbar-dark bg-primary">
                <a className="navbar-brand ms-3" href="/">Pronote</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExample02">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Accueil</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/etudiants/">Etudiants</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/enseignants/">Enseignants</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/note/">Note</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/matiere/">Matiere</a>
                        </li>

                    </ul>
                </div>
            </nav>

        </header>

    );
}

export default Header;
