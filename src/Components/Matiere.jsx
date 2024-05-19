import React, { useEffect, useState } from 'react';
import { getMatieres, addMatiere, updateMatiere, removeMatiere } from './../../services/operationsMat';
import 'bootstrap/dist/css/bootstrap.css'; 
import '/src/App.css';
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { set } from 'mongoose';

function Matiere() {
    const [matieres, setMatieres] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [duplicateIdAlertModal, setDuplicateIdAlertModal] = useState(false); // Variable pour gérer l'affichage de l'alerte
    const [duplicateIdAlert, setDuplicateIdAlert] = useState(false);
    const [newMatiere, setNewMatiere] = useState({
        CodeMat: '',
        LibelleMat: '',
        CoefMat: ''
    });

    useEffect(() => {
        getMatieres((res) => {
            // Trier les étudiants par numéro d'étudiant
            const sortedMatieres = res.data.sort((a, b) => a.CodeMat - b.CodeMat);
            setMatieres(sortedMatieres);
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
    const currentMatieres = matieres.slice(indexOfFirstItem, indexOfLastItem);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fonction pour passer à la page suivante
    const nextPage = () => {
        if (currentPage < Math.ceil(matieres.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Fonction pour passer à la page précédente
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleAdd = () => {
        // Vérifier si le numéro étudiant est déjà utilisé
        if (matieres.some(matiere => matiere.CodeMat === parseInt(newMatiere.CodeMat))) {
            setDuplicateIdAlertModal(true); // Afficher l'alerte
        } else {
            addMatiere(newMatiere, (res) => {
                if (res.status === 201) {
                    const updatedMatieres = [...matieres, newMatiere];
                    updatedMatieres.sort((a, b) => a.CodeMat - b.CodeMat);
                    setMatieres(updatedMatieres);
                    setNewMatiere({
                        CodeMat: '',
                        LibelleMat: '',
                        CoefMat: ''
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
        if (matieres.some(matiere => matiere.CodeMat === parseInt(pendingEdits[id].CodeMat))) {
            setDuplicateIdAlert(true); // Afficher l'alerte
            return;
        }
        const pendingEdit = pendingEdits[id];
        if (pendingEdit) {
            updateMatiere({ _id: id, ...pendingEdit }, (res) => {
                if (res.status === 200) {
                    const updatedMatieres = matieres.map(matiere => {
                        if (matiere._id === id) {
                            return { ...matiere, ...pendingEdit };
                        }
                        return matiere;
                    });
                    setMatieres(updatedMatieres);
                    // Effacer les modifications en attente après la validation
                    setPendingEdits({ ...pendingEdits, [id]: {} });
                } else {
                    console.error("Erreur lors de la modification de l'étudiant :", res.data.error);
                }
            });
            setDuplicateIdAlert(false);
        }
    };

    const handleCancelEdit = (id) => {
        // Annuler les modifications en attente pour cette ligne
        const updatedPendingEdits = { ...pendingEdits };
        delete updatedPendingEdits[id];
        setPendingEdits(updatedPendingEdits);
    };

    const handleDelete = (id) => {
        removeMatiere(id, (res) => {
            if (res.status === 200) {
                const updatedMatieres = matieres.filter(matiere => matiere._id !== id);
                setMatieres(updatedMatieres);
            } else {
                console.error("Erreur lors de la suppression de l'étudiant :", res.data.error);
            }
        });
    };

    return (
        <div className='container'>
            <div className='text-center mb-5 mt-5'>
                <h1 style={{fontFamily: "Chalkduster",fontWeight: "bold"}}>Liste des matières</h1>
            </div>
            <div className='justify-content-between d-flex mb-4 mt-4'>
                <button className='btn btn-gradient-logo' onClick={() => setModalShow(true)}>Ajouter une matière</button>
                <Filter
                    matieres={matieres}
                    setMatieres={setMatieres}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                />
            </div>
            {duplicateIdAlertModal && (
                <Alert variant="danger">
                    Cet identifiant matière est déjà utilisé.
                </Alert>
            )}
            <table className="table table-sm">
                <thead>
                    <tr className='text-center'>
                        <th scope="col">Numéro matière</th>
                        <th scope="col">Libellé</th>
                        <th scope="col">Coefficient</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentMatieres.map(({ _id, CodeMat, LibelleMat, CoefMat }) => (
                        <tr key={_id}>
                        <td>
                            <input
                                type="number"
                                className="form-control"
                                min={0}
                                value={pendingEdits[_id]?.CodeMat !== undefined ? pendingEdits[_id].CodeMat : CodeMat}
                                onChange={(e) => handleEdit(_id, 'CodeMat', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                value={pendingEdits[_id]?.LibelleMat !== undefined ? pendingEdits[_id].LibelleMat : LibelleMat}
                                onChange={(e) => handleEdit(_id, 'LibelleMat', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                className="form-control"
                                min={1}
                                value={pendingEdits[_id]?.CoefMat !== undefined ? pendingEdits[_id].CoefMat : CoefMat}
                                onChange={(e) => handleEdit(_id, 'CoefMat', e.target.value)}
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
                    {Array.from({ length: Math.ceil(matieres.length / itemsPerPage) }, (_, i) => (
                        <li key={i} className='page-item'>
                            <a onClick={() => paginate(i + 1)} className='page-link'>
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
                newMatiere={newMatiere} // Passer les valeurs du nouvel étudiant à la modal
                setNewMatiere={setNewMatiere} // Passer la fonction pour mettre à jour les valeurs du nouvel étudiant à la modal
                duplicateIdAlert={duplicateIdAlertModal}
            />
        </div>
    );
}

function MyVerticallyCenteredModal({ show, onHide, handleAdd, newMatiere, setNewMatiere, duplicateIdAlert }) {
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
                    Ajout d'une matière
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {duplicateIdAlert && (
                    <Alert variant="danger">
                        Cet identifiant matière est déjà utilisé.
                    </Alert>
                )}
                <Form>
                    <Form.Group className="mb-3" controlId="CodeMat">
                        <Form.Label>Numéro matière</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le numéro étudiant"
                            min={0}
                            autoFocus
                            value={newMatiere.CodeMat}
                            onChange={(e) => setNewMatiere({ ...newMatiere, CodeMat: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Nom">
                        <Form.Label>Libellé</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom"
                            value={newMatiere.LibelleMat}
                            onChange={(e) => setNewMatiere({ ...newMatiere, LibelleMat: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Prenom">
                        <Form.Label>Coefficient</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le prénom"
                            value={newMatiere.CoefMat}
                            onChange={(e) => setNewMatiere({ ...newMatiere, CoefMat: e.target.value })}
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

function Filter({ matieres, setMatieres, itemsPerPage, setItemsPerPage }) {
    const [show, setShow] = useState(false);
    const [activeSort, setActiveSort] = useState({ key: 'CodeMat', order: 'asc' });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Fonction de trie par numéro étudiant
    const sortByCodeMat = (ordre) => {
        const sortedMatieres = [...matieres].sort((a, b) => ordre === 'asc' ? a.CodeMat - b.CodeMat : b.CodeMat - a.CodeMat);
        setMatieres(sortedMatieres);
        setActiveSort({ key: 'CodeMat', order: ordre });
    };

    // Fonction de trie par nom
    const sortByLibelleMat= (ordre) => {
        const sortedMatieres = [...matieres].sort((a, b) => ordre === 'asc' ? a.LibelleMat.localeCompare(b.LibelleMat) : b.LibelleMat.localeCompare(a.LibelleMat));
        setMatieres(sortedMatieres);
        setActiveSort({ key: 'LibelleMat', order: ordre });
    };

    // Fonction de trie par prénom
    const sortByCoefMat = (ordre) => {
        const sortedMatieres = [...matieres].sort((a, b) => ordre === 'asc' ? a.CoefMat - b.CoefMat : b.CoefMat - a.CoefMat);
        setMatieres(sortedMatieres);
        setActiveSort({ key: 'CoefMat', order: ordre });
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
                                variant={activeSort.key === 'CodeMat' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4 card-text"
                                onClick={() => sortByCodeMat('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'CodeMat' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter card-text"
                                onClick={() => sortByCodeMat('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par Libellé</h4>
                            <Button
                                variant={activeSort.key === 'LibelleMat' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4 card-text"
                                onClick={() => sortByLibelleMat('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'LibelleMat' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter card-text"
                                onClick={() => sortByLibelleMat('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par Coefficient</h4>
                            <Button
                                variant={activeSort.key === 'CoefMat' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4"
                                onClick={() => sortByCoefMat('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'CoefMat' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter"
                                onClick={() => sortByCoefMat('desc')}
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
        </>
    );
}

export default Matiere;