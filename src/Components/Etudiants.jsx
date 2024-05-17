import React, { useEffect, useState } from 'react';
import { getEtudiants, updateEtudiant, removeEtudiant } from './../../services/operationsEtuds';

function Etudiants() {
    const [etudiants, setEtudiants] = useState([]);

    useEffect(() => {
        getEtudiants((res) => {
            setEtudiants(res.data);
        });
    }, []);

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
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Numéro étudiant</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Prénom</th>
                        <th scope="col">Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {etudiants.map(({ _id, Nom, Prenom, NumEtudiant, DatenET }) => (
                        <tr key={_id}>
                            <td>
                                <input 
                                    type="text"
                                    className="form-control" 
                                    style={{width: "auto"}}
                                    value={NumEtudiant} 
                                    onChange={(e) => handleEdit(_id, 'NumEtudiant', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    style={{width: "auto"}}
                                    value={Nom} 
                                    onChange={(e) => handleEdit(_id, 'Nom', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    style={{width: "auto"}} 
                                    value={Prenom} 
                                    onChange={(e) => handleEdit(_id, 'Prenom', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    style={{width: "auto"}}
                                    value={DatenET} 
                                    onChange={(e) => handleEdit(_id, 'DatenET', e.target.value)}
                                />
                            </td>
                            <td className="d-flex justify-content-between pe-4">
                                <button onClick={() => handleEdit(_id, 'Nom', Nom)} className="btn btn-dark">Modifier</button>
                                <button onClick={() => handleDelete(_id)} className="btn btn-dark">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Etudiants;
