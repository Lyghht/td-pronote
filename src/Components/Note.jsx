import React, { useEffect, useState } from 'react';
import { getNotes, addNote, updateNote, removeNote } from './../../services/operationsNote';
import 'bootstrap/dist/css/bootstrap.css'; 
import '/src/App.css';
import Dropdown from 'react-bootstrap/Dropdown'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Note() {
    const [notes, setNotes] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [duplicateIdAlertModal, setDuplicateIdAlertModal] = useState(false); // Variable pour gérer l'affichage de l'alerte
    const [duplicateIdAlert, setDuplicateIdAlert] = useState(false);
    const [newNote, setNewNote] = useState({
        NumEtudiant: '',
        CodeMat: '',
        Note: '',
        Date: ''
    });

    useEffect(() => {
        getNotes((res) => {
            // Trier les étudiants par numéro d'étudiant
            const sortedNotes = res.data.sort((a, b) => a.NumEtudiant - b.NumEtudiant);
            setNotes(sortedNotes);
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
    const currentNotes = notes.slice(indexOfFirstItem, indexOfLastItem);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Fonction pour passer à la page suivante
    const nextPage = () => {
        if (currentPage < Math.ceil(notes.length / itemsPerPage)) {
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
        if (notes.some(note => note.NumEtudiant === parseInt(newNote.NumEtudiant))) {
            setDuplicateIdAlertModal(true); // Afficher l'alerte
        } else {
            addNote(newNote, (res) => {
                if (res.status === 201) {
                    const updatedNotes = [...notes, newNote];
                    updatedNotes.sort((a, b) => a.NumEtudiant - b.NumEtudiant);
                    setNotes(updatedNotes);
                    setNewNote({
                        NumEtudiant: '',
                        CodeMat: '',
                        Note: '',
                        Date: ''
                    });
                    setModalShow(false);
                    setDuplicateIdAlertModal(false); // Cacher l'alerte si elle est affichée
                    setDuplicateIdAlert(false);
                } else {
                    console.error("Erreur lors de l'ajout de l'étudiant :", res.data.error);
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
        const pendingEdit = pendingEdits[id];
        if (pendingEdit) {
            updateNote({ _id: id, ...pendingEdit }, (res) => {
                if (res.status === 200) {
                    const updatedNotes = notes.map(note => {
                        if (note._id === id) {
                            return { ...note, ...pendingEdit };
                        }
                        return note;
                    });
                    setNotes(updatedNotes);
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
        removeNote(id, (res) => {
            if (res.status === 200) {
                const updatedNotes = notes.filter(note => note._id !== id);
                setNotes(updatedNotes);
            } else {
                console.error("Erreur lors de la suppression de l'étudiant :", res.data.error);
            }
        });
    };

    return (
        <div className='container'>
            <div className='text-center mb-5 mt-5'>
                <h1 style={{fontFamily: "Chalkduster",fontWeight: "bold"}}>Notes</h1>
            </div>
            <div className='justify-content-between d-flex mb-4 mt-4'>
                <button className='btn btn-gradient-logo' onClick={() => setModalShow(true)}>Ajouter une note</button>
                <Filter
                    notes={notes}
                    setNotes={setNotes}
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
                        <th scope="col">Etudiant</th>
                        <th scope="col">Matière</th>
                        <th scope="col">Note</th>
                        <th scope="col">Date</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentNotes.map(({ _id, NumEtudiant, CodeMat, Note, Date }) => (
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
                                    value={pendingEdits[_id]?.CodeMat !== undefined ? pendingEdits[_id].CodeMat : CodeMat} 
                                    onChange={(e) => handleEdit(_id, 'CodeMat', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="number" 
                                    className="form-control"
                                    min={0}
                                    max={20}
                                    value={pendingEdits[_id]?.Note !== undefined ? pendingEdits[_id].Note : Note} 
                                    onChange={(e) => handleEdit(_id, 'Note', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={pendingEdits[_id]?.Date !== undefined ? pendingEdits[_id].Date : formatDate(parseDate(Date))} 
                                    onChange={(e) => handleEdit(_id, 'Date', e.target.value)}
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
                    {Array.from({ length: Math.ceil(notes.length / itemsPerPage) }, (_, i) => (
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
                newNote={newNote} // Passer les valeurs du nouvel étudiant à la modal
                setNewNote={setNewNote} // Passer la fonction pour mettre à jour les valeurs du nouvel étudiant à la modal
                duplicateIdAlert={duplicateIdAlertModal}
            />
        </div>
    );
}

function MyVerticallyCenteredModal({ show, onHide, handleAdd, newNote, setNewNote, duplicateIdAlert }) {
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
                    Ajout d'une note
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="NumEtudiant">
                        <Form.Label>Numéro étudiant</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le numéro étudiant"
                            min={0}
                            autoFocus
                            value={newNote.NumEtudiant}
                            onChange={(e) => setNewNote({ ...newNote, NumEtudiant: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="CodeMat">
                        <Form.Label>Nuuméro Matière</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez le numéro matière"
                            min={0}
                            value={newNote.CodeMat}
                            onChange={(e) => setNewNote({ ...newNote, CodeMat: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Note">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Entrez la note"
                            min={0}
                            max={20}
                            value={newNote.Note}
                            onChange={(e) => setNewNote({ ...newNote, Note: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="Date">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={newNote.Date}
                            onChange={(e) => setNewNote({ ...newNote, Date: e.target.value })}
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

function Filter({ notes, setNotes, itemsPerPage, setItemsPerPage }) {
    const [show, setShow] = useState(false);
    const [activeSort, setActiveSort] = useState({ key: 'NumEtudiant', order: 'asc' });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Fonction de trie par numéro étudiant
    const sortByNumEtudiant = (ordre) => {
        const sortedNotes = [...notes].sort((a, b) => ordre === 'asc' ? a.NumEtudiant - b.NumEtudiant : b.NumEtudiant - a.NumEtudiant);
        setNotes(sortedNotes);
        setActiveSort({ key: 'NumEtudiant', order: ordre });
    };

    // Fonction de trie par code matière
    const sortByCodeMat = (ordre) => {
        const sortedNotes = [...notes].sort((a, b) => ordre === 'asc' ? a.CodeMat - b.CodeMat : b.CodeMat - a.CodeMat);
        setNotes(sortedNotes);
        setActiveSort({ key: 'CodeMat', order: ordre });
    };

    // Fonction de trie par note
    const sortByNote = (ordre) => {
        const sortedNotes = [...notes].sort((a, b) => ordre === 'asc' ? a.Note - b.Note : b.Note - a.Note);
        setNotes(sortedNotes);
        setActiveSort({ key: 'Note', order: ordre });
    };

    // Fonction de trie par date
    const sortByDate = (ordre) => {
        const sortedNotes = [...notes].sort((a, b) => ordre === 'asc' ? a.Date.localeCompare(b.Date) : b.Date.localeCompare(a.Date));
        setNotes(sortedNotes);
        setActiveSort({ key: 'Date', order: ordre });
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
                            <h4 className='card-title mb-3'>Trier par numéro matière</h4>
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
                            <h4 className='card-title mb-3'>Trier par note</h4>
                            <Button
                                variant={activeSort.key === 'Note' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4"
                                onClick={() => sortByNote('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'Note' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter"
                                onClick={() => sortByNote('desc')}
                            >
                                Décroissant
                            </Button>
                        </div>
                    </div>
                    <div className='card mb-3'>
                        <div className='card-body'>
                            <h4 className='card-title mb-3'>Trier par date</h4>
                            <Button
                                variant={activeSort.key === 'Date' && activeSort.order === 'asc' ? 'primary' : 'secondary'}
                                className="buttonFilter me-4"
                                onClick={() => sortByDate('asc')}
                            >
                                Croissant
                            </Button>
                            <Button
                                variant={activeSort.key === 'Date' && activeSort.order === 'desc' ? 'primary' : 'secondary'}
                                className="buttonFilter"
                                onClick={() => sortByDate('desc')}
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
  

export default Note;
