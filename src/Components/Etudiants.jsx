import React, { useEffect, useState } from 'react';
import { getEtudiants, addEtudiant, updateEtudiant, removeEtudiant } from './../../services/operationsEtuds';
import 'bootstrap/dist/css/bootstrap.css'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

function Etudiants() {
    const [etudiants, setEtudiants] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [duplicateIdAlert, setDuplicateIdAlert] = useState(false); // Variable pour gérer l'affichage de l'alerte
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

    // Calcul de l'index de début et de fin pour les étudiants à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEtudiants = etudiants.slice(indexOfFirstItem, indexOfLastItem);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fonction pour passer à la page suivante
    const nextPage = () => {
        if (currentPage < Math.ceil(etudiants.length / itemsPerPage)) {
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
        if (etudiants.some(etudiant => etudiant.NumEtudiant === parseInt(newEtudiant.NumEtudiant))) {
            setDuplicateIdAlert(true); // Afficher l'alerte
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
                    setDuplicateIdAlert(false); // Cacher l'alerte si elle est affichée
                } else {
                    console.error("Erreur lors de l'ajout de l'étudiant :", DatenET);
                }
            });
        }
    };
    
    

    const handleEdit = (id, field, value) => {
        updateEtudiant({ _id: id, [field]: value }, (res) => {
            if (res.status === 200) {
                const updatedEtudiants = etudiants.map(etudiant => {
                    if (etudiant._id === id) {
                        return { ...etudiant, [field]: value };
                    }
                    return etudiant;
                });
                setEtudiants(updatedEtudiants);
            } else {
                console.error("Erreur lors de la modification de l'étudiant :", res.data.error);
            }
        });
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
            <div className='justify-content-end d-flex mb-4 mt-4'>
                <button className='btn btn-primary' onClick={() => setModalShow(true)}>Ajouter un étudiant</button>
            </div>
            <table className="table">
                <thead>
                    <tr>
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
                                    value={NumEtudiant} 
                                    onChange={(e) => handleEdit(_id, 'NumEtudiant', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={Nom} 
                                    onChange={(e) => handleEdit(_id, 'Nom', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={Prenom} 
                                    onChange={(e) => handleEdit(_id, 'Prenom', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={DatenET} 
                                    onChange={(e) => handleEdit(_id, 'DatenET', e.target.value)}
                                />
                            </td>
                            
                            <td>
                           
                            <Dropdown> 
                                <Dropdown.Toggle variant="secondary" className="btn btn-dark"> 
                                Actions 
                                </Dropdown.Toggle> 
                                <Dropdown.Menu> 
                                <Dropdown.Item onClick={() => handleEdit(_id, 'Nom', Nom)} href="#"> 
                                    Modifier
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
                newEtudiant={newEtudiant} // Passer les valeurs du nouvel étudiant à la modal
                setNewEtudiant={setNewEtudiant} // Passer la fonction pour mettre à jour les valeurs du nouvel étudiant à la modal
                duplicateIdAlert={duplicateIdAlert}
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

export default Etudiants;
