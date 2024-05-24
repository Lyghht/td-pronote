import React, { useEffect, useState } from 'react';
import { getEnseignants, addEnseignant, updateEnseignant, removeEnseignant } from './../../services/operationsEns';
import 'bootstrap/dist/css/bootstrap.css'; 
import '/src/App.css';
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { set } from 'mongoose';

function Enseignants() {
    const [enseignants, setEnseignants] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [duplicateIdAlertModal, setDuplicateIdAlertModal] = useState(false); // Variable pour gérer l'affichage de l'alerte
    const [duplicateIdAlert, setDuplicateIdAlert] = useState(false);
    const [newEnseignant, setnewEnseignant] = useState({
        CodeEns: '',
        NomEns: '',
        PrenomEns: '',
        GradeEns: '',
        CodeMat: ''
    });

    useEffect(() => {
        getEnseignants((res) => {
            // Trier les étudiants par numéro d'étudiant
            const sortedEnseignants = res.data.sort((a, b) => a.CodeEns - b.CodeEns);
            setEnseignants(sortedEnseignants);
        });
    }, []);

    // Calcul de l'index de début et de fin pour les étudiants à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEnseignants = enseignants.slice(indexOfFirstItem, indexOfLastItem);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fonction pour passer à la page suivante
    const nextPage = () => {
        if (currentPage < Math.ceil(enseignants.length / itemsPerPage)) {
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
        if (enseignants.some(enseignant => enseignant.CodeEns === parseInt(newEnseignant.CodeEns))) {
            setDuplicateIdAlertModal(true); // Afficher l'alerte
        } else {
            addEnseignant(newEnseignant, (res) => {
                if (res.status === 201) {
                    const updatedEnseignants = [...enseignants, newEnseignant];
                    updatedEnseignants.sort((a, b) => a.CodeEns - b.CodeEns);
                    setEnseignants(updatedEnseignants);
                    setnewEnseignant({
                        CodeEns: '',
                        NomEns: '',
                        PrenomEns: '',
                        GradeEns: '',
                        CodeMat: ''
                    });
                    setModalShow(false);
                    setDuplicateIdAlertModal(false); // Cacher l'alerte si elle est affichée
                    setDuplicateIdAlert(false);
                } else {
                    console.error("Erreur lors de l'ajout de l'enseignant :", CodeEns)
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
        if (enseignants.some(enseignant => enseignant.CodeEns === parseInt(pendingEdits[id].CodeEns) && enseignant._id !== id)) {
            setDuplicateIdAlert(true);
            return;
        }
        const pendingEdit = pendingEdits[id];
        if (pendingEdit) {
            updateEnseignant({ _id: id, ...pendingEdit }, (res) => {
                if (res.status === 200) {
                    const updatedEnseignants = enseignants.map(enseignant => {
                        if (enseignant._id === id) {
                            return { ...enseignant, ...pendingEdit };
                        }
                        return enseignant;
                    });
                    setEnseignants(updatedEnseignants);
                    // Effacer les modifications en attente après la validation
                    setPendingEdits({ ...pendingEdits, [id]: {} });
                } else {
                    console.error("Erreur lors de la modification de l'enseignant :", res.data.error);
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
        removeEnseignant(id, (res) => {
            if (res.status === 200) {
                const updatedEnseignants = enseignants.filter(enseignant => enseignant._id !== id);
                setEnseignants(updatedEnseignants);
            } else {
                console.error("Erreur lors de la suppression de l'étudiant :", res.data.error);
            }
        });
    };

    return (
        <div className='container'>
            <div className='text-center mb-5 mt-5'>
                <h1 style={{fontFamily: "Chalkduster",fontWeight: "bold"}}>Liste des enseignants</h1>
            </div>
            <div className='justify-content-between d-flex mb-4 mt-4'>
                <button className='btn btn-gradient-logo' onClick={() => setModalShow(true)}>Ajouter un enseignant</button>
                <Filter
                    enseignants={enseignants}
                    setEnseignants={setEnseignants}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                />
            </div>
            {duplicateIdAlert && (
                <Alert variant="danger">
                    Cet identifiant enseignant est déjà utilisé.
                </Alert>
            )}
            <table className="table table-sm">
                <thead>
                    <tr className='text-center'>
                        <th scope="col">Numéro Enseignant</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Prénom</th>
                        <th scope="col">Grade</th>
                        <th scope="col">Code matricule</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                {currentEnseignants.map(({ _id, NomEns, PrenomEns, CodeEns, GradeEns, CodeMat }) => (
                    <tr key={_id}>
                        <td>
                            <input 
                                type="text"
                                className="form-control" 
                                value={pendingEdits[_id]?.CodeEns !== undefined ? pendingEdits[_id].CodeEns : CodeEns} 
                                onChange={(e) => handleEdit(_id, 'CodeEns', e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={pendingEdits[_id]?.NomEns !== undefined ? pendingEdits[_id].NomEns : NomEns} 
                                onChange={(e) => handleEdit(_id, 'NomEns', e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="text" 
                                className="form-control"
                                value={pendingEdits[_id]?.PrenomEns !== undefined ? pendingEdits[_id].PrenomEns : PrenomEns} 
                                onChange={(e) => handleEdit(_id, 'PrenomEns', e.target.value)}
                            />
                        </td>
                        <td>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={pendingEdits[_id]?.GradeEns !== undefined ? pendingEdits[_id].GradeEns : GradeEns} 
                                onChange={(e) => handleEdit(_id, 'GradeEns', e.target.value)}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                value={pendingEdits[_id]?.CodeMat !== undefined ? pendingEdits[_id].CodeMat : CodeMat}
                                onChange={(e) => handleEdit(_id, 'CodeMat', e.target.value)}
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
                    {Array.from({ length: Math.ceil(enseignants.length / itemsPerPage) }, (_, i) => (
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
                newEnseignant={newEnseignant} // Passer les valeurs du nouvel étudiant à la modal
                setnewEnseignant={setnewEnseignant} // Passer la fonction pour mettre à jour les valeurs du nouvel étudiant à la modal
                duplicateIdAlert={duplicateIdAlertModal}
            />
        </div>
    );
}

function MyVerticallyCenteredModal({ show, onHide, handleAdd, newEnseignant, setnewEnseignant, duplicateIdAlert }) {
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
                    Ajout d'un enseignant
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {duplicateIdAlert && (
                    <Alert variant="danger">
                        Ce code enseignant est déjà utilisé.
                    </Alert>
                )}
                <Form>
                    <Form.Group className="mb-3" controlId="CodeEns">
                        <Form.Label>Numéro enseignant</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le numéro enseignant"
                            min={0}
                            autoFocus
                            value={newEnseignant.CodeEns}
                            onChange={(e) => setnewEnseignant({ ...newEnseignant, CodeEns: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="NomEns">
                        <Form.Label>Nom</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le nom"
                            value={newEnseignant.NomEns}
                            onChange={(e) => setnewEnseignant({ ...newEnseignant, NomEns: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="PrenomEns">
                        <Form.Label>Prénom</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le prénom"
                            value={newEnseignant.PrenomEns}
                            onChange={(e) => setnewEnseignant({ ...newEnseignant, PrenomEns: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="GradeEns">
                        <Form.Label>Grade</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le grade"
                            value={newEnseignant.GradeEns}
                            onChange={(e) => setnewEnseignant({ ...newEnseignant, GradeEns: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="CodeMat">
                        <Form.Label>Code matricule</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le code matricule"
                            min={0}
                            value={newEnseignant.CodeMat}
                            onChange={(e) => setnewEnseignant({ ...newEnseignant, CodeMat: e.target.value })}
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

function Filter({ enseignants, setEnseignants, itemsPerPage, setItemsPerPage }) {
    const [show, setShow] = useState(false);
    const [activeSort, setActiveSort] = useState({ key: 'CodeEns', order: 'asc' });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Fonction de trie par numéro étudiant
    const sortByCodeEns = (ordre) => {
        const sortedEnseignants = [...enseignants].sort((a, b) => ordre === 'asc' ? a.CodeEns - b.CodeEns : b.CodeEns - a.CodeEns);
        setEnseignants(sortedEnseignants);
        setActiveSort({ key: 'CodeEns', order: ordre });
    };

    // Fonction de trie par nom
    const sortByNomEns = (ordre) => {
        const sortedEnseignants = [...enseignants].sort((a, b) => ordre === 'asc' ? a.NomEns.localeCompare(b.NomEns) : b.NomEns.localeCompare(a.NomEns));
        setEnseignants(sortedEnseignants);
        setActiveSort({ key: 'NomEns', order: ordre });
    };

    // Fonction de trie par prénom
    const sortByPrenomEns = (ordre) => {
        const sortedEnseignants = [...enseignants].sort((a, b) => ordre === 'asc' ? a.PrenomEns.localeCompare(b.PrenomEns) : b.PrenomEns.localeCompare(a.PrenomEns));
        setEnseignants(sortedEnseignants);
        setActiveSort({ key: 'PrenomEns', order: ordre });
    };

    // Fonction de trie par date de naissance
    const sortByGradeEns = (ordre) => {
        const sortedEnseignants = [...enseignants].sort((a, b) => ordre === 'asc' ? a.GradeEns.localeCompare(b.GradeEns) : b.GradeEns.localeCompare(a.GradeEns));
        setEnseignants(sortedEnseignants);
        setActiveSort({ key: 'GradeEns', order: ordre });
    };

    // Fonction de trie par code matricule
    const sortByCodeMat = (ordre) => {
        const sortedEnseignants = [...enseignants].sort((a, b) => ordre === 'asc' ? a.CodeMat - b.CodeMat : b.CodeMat - a.CodeMat);
        setEnseignants(sortedEnseignants);
        setActiveSort({ key: 'CodeMat', order: ordre });
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
                            <h4 className='card-title mb-3'>Trier par code enseignant</h4>
                            <Button
                                variant={activeSort.key === 'CodeEns' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4 card-text"
                                onClick={() => sortByCodeEns('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'CodeEns' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter card-text"
                                onClick={() => sortByCodeEns('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par nom</h4>
                            <Button
                                variant={activeSort.key === 'NomEns' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4 card-text"
                                onClick={() => sortByNomEns('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'NomEns' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter card-text"
                                onClick={() => sortByNomEns('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par prénom</h4>
                            <Button
                                variant={activeSort.key === 'PrenomEns' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4"
                                onClick={() => sortByPrenomEns('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'PrenomEns' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter"
                                onClick={() => sortByPrenomEns('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par grade</h4>
                            <Button
                                variant={activeSort.key === 'GradeEns' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4"
                                onClick={() => sortByGradeEns('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'GradeEns' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter"
                                onClick={() => sortByGradeEns('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par code matricule</h4>
                            <Button
                                variant={activeSort.key === 'CodeMat' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4"
                                onClick={() => sortByCodeMat('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'CodeMat' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter"
                                onClick={() => sortByCodeMat('desc')}
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
export default Enseignants;