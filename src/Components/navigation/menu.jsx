import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function menu() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="/">
                <img src="/src/assets/media/logo-nota-removebg.png" alt="IUT d'Amiens" width="30" height="30" className="d-inline-block align-text-top" />
                Nota
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/">Accueil</Nav.Link>
                <Nav.Link href="/etudiants/">Etudiants</Nav.Link>
                <Nav.Link href="/enseignants/">Enseignants</Nav.Link>
                <Nav.Link href="/note/">Notes</Nav.Link>
                <Nav.Link href="/matiere/">Matieres</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>

    );
}

export default menu;
