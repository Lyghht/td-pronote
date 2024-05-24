import React, { useEffect, useState } from 'react';
import { getEtudiants, addEtudiant, updateEtudiant, removeEtudiant } from './../../services/operationsEtuds';
import 'bootstrap/dist/css/bootstrap.css'; 
import '/src/App.css';
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Etudiants() {
    const [etudiants, setEtudiants] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [duplicateIdAlertModal, setDuplicateIdAlertModal] = useState(false); // Variable pour gérer l'affichage de l'alerte
    const [duplicateIdAlert, setDuplicateIdAlert] = useState(false);
    const [newEtudiant, setNewEtudiant] = useState({
        NumEtudiant: '',
        Nom: '',
        Prenom: '',
        DatenET: ''
    });

    useEffect(() => {
        getEtudiants((res) => {
            // Trier les étudiants par numéro d'étudiant
            const sortedEtudiants = res.data.sort((a, b) => a.NumEtudiant - b.NumEtudiant);
            setEtudiants(sortedEtudiants);
        });
    }, []);

    // Fonctions pour formater la date
    function parseDate(dateString) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
          // Format dd/MM/yyyy
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JS
          const year = parseInt(parts[2], 10);
          return new Date(year, month, day);
        }
        return new Date(dateString); // Assume it's in yyyy-mm-dd format
      }
      
      function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

    // Calcul de l'index de début et de fin pour les étudiants à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEtudiants = etudiants.slice(indexOfFirstItem, indexOfLastItem);
    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fonction pour passer à la page suivante
    const nextPage = () => {
        if (currentPage < Math.ceil(etudiants.length / itemsPerPage)) {
            document.querySelector(`li[data-key="${currentPage+1}"]`).querySelector("a").className = "page-link bg-primary text-white"
            document.querySelector(`li[data-key="${currentPage}"]`).querySelector("a").className = "page-link"
            setCurrentPage(currentPage + 1);
          }
      };

    // Fonction pour passer à la page précédente
    const prevPage = () => {
        if (currentPage > 1) {
            document.querySelector(`li[data-key="${currentPage - 1}"]`).querySelector("a").className = "page-link bg-primary text-white"
            document.querySelector(`li[data-key="${currentPage}"]`).querySelector("a").className = "page-link"
            setCurrentPage(currentPage - 1);
        }

    };

    const handleAdd = () => {
        // Vérifier si le numéro étudiant est déjà utilisé
        if (etudiants.some(etudiant => etudiant.NumEtudiant === parseInt(newEtudiant.NumEtudiant))) {
            setDuplicateIdAlertModal(true); // Afficher l'alerte
        } else {
            addEtudiant(newEtudiant, (res) => {
                if (res.status === 201) {
                    const updatedEtudiants = [...etudiants, newEtudiant];
                    updatedEtudiants.sort((a, b) => a.NumEtudiant - b.NumEtudiant);
                    setEtudiants(updatedEtudiants);
                    setNewEtudiant({
                        NumEtudiant: '',
                        Nom: '',
                        Prenom: '',
                        DatenET: ''
                    });
                    setModalShow(false);
                    setDuplicateIdAlertModal(false); // Cacher l'alerte si elle est affichée
                    setDuplicateIdAlert(false);
                } else {
                    console.error("Erreur lors de l'ajout de l'étudiant :", DatenET);
                }
            });
        }
    };
    
    

    const [pendingEdits, setPendingEdits] = useState({});

    const handleEdit = (id, field, value) => {
        // Stocker les modifications en attente pour chaque ligne
        setPendingEdits({ ...pendingEdits, [id]: { ...pendingEdits[id], [field]: value } });
    };

    const handleConfirmEdit = (id) => {
        //Vérifier si l'id de l'étudiant est déjà utilisé
        if (etudiants.some(etudiant => etudiant.NumEtudiant === parseInt(pendingEdits[id].NumEtudiant))) {
            setDuplicateIdAlert(true); // Afficher l'alerte
            return;
        }
        const pendingEdit = pendingEdits[id];
        if (pendingEdit) {
            updateEtudiant({ _id: id, ...pendingEdit }, (res) => {
                if (res.status === 200) {
                    const updatedEtudiants = etudiants.map(etudiant => {
                        if (etudiant._id === id) {
                            return { ...etudiant, ...pendingEdit };
                        }
                        return etudiant;
                    });
                    setEtudiants(updatedEtudiants);
                    // Effacer les modifications en attente après la validation
                    setPendingEdits({ ...pendingEdits, [id]: {} });
                } else {
                    console.error("Erreur lors de la modification de l'étudiant :", res.data.error);
                }
            });
            setDuplicateIdAlert(false); // Cacher l'alerte si elle est affichée
        }
    };

    const handleCancelEdit = (id) => {
        // Annuler les modifications en attente pour cette ligne
        const updatedPendingEdits = { ...pendingEdits };
        delete updatedPendingEdits[id];
        setPendingEdits(updatedPendingEdits);
    };

    const handleDelete = (id) => {
        removeEtudiant(id, (res) => {
            if (res.status === 200) {
                const updatedEtudiants = etudiants.filter(etudiant => etudiant._id !== id);
                setEtudiants(updatedEtudiants);
            } else {
                console.error("Erreur lors de la suppression de l'étudiant :", res.data.error);
            }
        });
    };

    return (
        <div className='container'>
            <div className='text-center mb-5 mt-5'>
                <h1 style={{fontFamily: "Chalkduster",fontWeight: "bold"}}>Liste des étudiants</h1>
            </div>
            <div className='justify-content-between d-flex mb-4 mt-4'>
                <button className='btn btn-gradient-logo' onClick={() => setModalShow(true)}>Ajouter un étudiant</button>
                <Filter
                    etudiants={etudiants}
                    setEtudiants={setEtudiants}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                />
            </div>
            {duplicateIdAlert && (
                    <Alert variant="danger">
                        Cet identifiant étudiant est déjà utilisé.
                    </Alert>
                )}
            <table className="table table-sm">
                <thead>
                    <tr className='text-center'>
                        <th scope="col">Numéro étudiant</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Prénom</th>
                        <th scope="col">Date</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentEtudiants.map(({ _id, Nom, Prenom, NumEtudiant, DatenET }) => (
                        <tr key={_id}>
                            <td>
                            <input 
                                type="text"
                                className="form-control" 
                                value={pendingEdits[_id]?.NumEtudiant !== undefined ? pendingEdits[_id].NumEtudiant : NumEtudiant} 
                                onChange={(e) => handleEdit(_id, 'NumEtudiant', e.target.value)}
                            />
                        </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={pendingEdits[_id]?.Nom !== undefined ? pendingEdits[_id].Nom : Nom} 
                                    onChange={(e) => handleEdit(_id, 'Nom', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={pendingEdits[_id]?.Prenom !== undefined ? pendingEdits[_id].Prenom : Prenom} 
                                    onChange={(e) => handleEdit(_id, 'Prenom', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={pendingEdits[_id]?.DatenET !== undefined ? pendingEdits[_id].DatenET : formatDate(parseDate(DatenET))} 
                                    onChange={(e) => handleEdit(_id, 'DatenET', e.target.value)}
                                />
                            </td>
                            
                            <td>
                            <Dropdown> 
                                <Dropdown.Toggle variant="secondary" className="btn btn-dark"> 
                                Actions 
                                </Dropdown.Toggle> 
                                <Dropdown.Menu> 
                                <Dropdown.Item onClick={() => handleConfirmEdit(_id)} href="#"> 
                                    Modifier
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleCancelEdit(_id)} href="#"> 
                                    Annuler
                                </Dropdown.Item> 
                                <Dropdown.Item onClick={() => handleDelete(_id)} href="#"> 
                                    Supprimer
                                </Dropdown.Item>  
                                </Dropdown.Menu> 
                            </Dropdown> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <nav className='d-flex justify-content-center mt-4'>
                <ul className='pagination'>
                    {/* Bouton "Précédent" */}
                    <li className='page-item'>
                        <a onClick={prevPage} className='page-link'>
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>

                    {/* Numéros de page */}
                    {Array.from({ length: Math.ceil(etudiants.length / itemsPerPage) }, (_, i) => (
                        <li data-key={i+1} key={i} className='page-item'>
                            <a onClick={() => {
                                    // Remove #clicked from all links
                                    document.querySelectorAll(".page-link").forEach((link) => {
                                    link.className = "page-link";
                                    });
                                    // Add #clicked to the clicked link
                                    event.target.className = "page-link bg-primary text-white";
                                    paginate(i + 1);
                                }} className={`page-link ${i === 0 ? 'bg-primary text-white' : ''}`}>
                                {i + 1}
                            </a>
                        </li>
                    ))}

                    {/* Bouton "Suivant" */}
                    <li className='page-item'>
                        <a onClick={nextPage} className='page-link'>
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                handleAdd={handleAdd} // Passer la fonction handleAdd à la modal
                newEtudiant={newEtudiant} // Passer les valeurs du nouvel étudiant à la modal
                setNewEtudiant={setNewEtudiant} // Passer la fonction pour mettre à jour les valeurs du nouvel étudiant à la modal
                duplicateIdAlert={duplicateIdAlertModal}
            />
        </div>
    );
}

function MyVerticallyCenteredModal({ show, onHide, handleAdd, newEtudiant, setNewEtudiant, duplicateIdAlert }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Ajout d'un étudiant
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {duplicateIdAlert && (
                    <Alert variant="danger">
                        Cet identifiant étudiant est déjà utilisé.
                    </Alert>
                )}
                <Form>
                    <Form.Group className="mb-3" controlId="NumEtudiant">
                        <Form.Label>Numéro étudiant</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le numéro étudiant"
                            min={0}
                            autoFocus
                            value={newEtudiant.NumEtudiant}
                            onChange={(e) => setNewEtudiant({ ...newEtudiant, NumEtudiant: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Nom">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom"
                            value={newEtudiant.Nom}
                            onChange={(e) => setNewEtudiant({ ...newEtudiant, Nom: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Prenom">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le prénom"
                            value={newEtudiant.Prenom}
                            onChange={(e) => setNewEtudiant({ ...newEtudiant, Prenom: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="DatenET">
                        <Form.Label>Date de naissance</Form.Label>
                        <Form.Control
                            type="date"
                            value={newEtudiant.DatenET}
                            onChange={(e) => setNewEtudiant({ ...newEtudiant, DatenET: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Fermer
                </Button>
                <Button variant="primary" onClick={handleAdd}>
                    Ajouter
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function Filter({ etudiants, setEtudiants, itemsPerPage, setItemsPerPage }) {
    const [show, setShow] = useState(false);
    const [activeSort, setActiveSort] = useState({ key: 'NumEtudiant', order: 'asc' });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Fonction de trie par numéro étudiant
    const sortByNumEtudiant = (ordre) => {
        const sortedEtudiants = [...etudiants].sort((a, b) => ordre === 'asc' ? a.NumEtudiant - b.NumEtudiant : b.NumEtudiant - a.NumEtudiant);
        setEtudiants(sortedEtudiants);
        setActiveSort({ key: 'NumEtudiant', order: ordre });
    };

    // Fonction de trie par nom
    const sortByNom = (ordre) => {
        const sortedEtudiants = [...etudiants].sort((a, b) => ordre === 'asc' ? a.Nom.localeCompare(b.Nom) : b.Nom.localeCompare(a.Nom));
        setEtudiants(sortedEtudiants);
        setActiveSort({ key: 'Nom', order: ordre });
    };

    // Fonction de trie par prénom
    const sortByPrenom = (ordre) => {
        const sortedEtudiants = [...etudiants].sort((a, b) => ordre === 'asc' ? a.Prenom.localeCompare(b.Prenom) : b.Prenom.localeCompare(a.Prenom));
        setEtudiants(sortedEtudiants);
        setActiveSort({ key: 'Prenom', order: ordre });
    };

    // Fonction de trie par date de naissance
    const sortByDatenET = (ordre) => {
        const sortedEtudiants = [...etudiants].sort((a, b) => ordre === 'asc' ? a.DatenET.localeCompare(b.DatenET) : b.DatenET.localeCompare(a.DatenET));
        setEtudiants(sortedEtudiants);
        setActiveSort({ key: 'DatenET', order: ordre });
    };

    return (
        <>
            <button className='btn btn-gradient-logo' onClick={handleShow}>
                Filtre
            </button>

            <Offcanvas show={show} onHide={handleClose} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        <h2>Filtre de tri</h2>
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par numéro étudiant</h4>
                            <Button
                                variant={activeSort.key === 'NumEtudiant' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4 card-text"
                                onClick={() => sortByNumEtudiant('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'NumEtudiant' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter card-text"
                                onClick={() => sortByNumEtudiant('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par nom</h4>
                            <Button
                                variant={activeSort.key === 'Nom' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4 card-text"
                                onClick={() => sortByNom('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'Nom' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter card-text"
                                onClick={() => sortByNom('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par prénom</h4>
                            <Button
                                variant={activeSort.key === 'Prenom' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4"
                                onClick={() => sortByPrenom('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'Prenom' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter"
                                onClick={() => sortByPrenom('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par date de naissance</h4>
                            <Button
                                variant={activeSort.key === 'DatenET' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4"
                                onClick={() => sortByDatenET('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'DatenET' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter"
                                onClick={() => sortByDatenET('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Nombre d'éléments par page</h4>
                            <Form.Select
                                aria-label="Default select example"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(e.target.value)}
                            >
                                <option value="6">6</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                            </Form.Select>
                        </div>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            <script>
                $(`li[data-key=1]`).className = "page-link bg-primary text-white";
            </script>
        </>
    );
}
  

export default Etudiants;
