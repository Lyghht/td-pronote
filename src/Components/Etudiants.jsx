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
                        <th scope="col">#</th>
                        <th scope="col">Nom</th>
                        <th scope="col">Prénom</th>
                        <th scope="col">Numéro étudiant</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {etudiants.map(({ _id, Nom, Prenom, NumEtudiant }) => (
                        <tr key={_id}>
                            <th scope="row">{_id}</th>
                            <td>
                                <input 
                                    type="text" 
                                    value={Nom} 
                                    onChange={(e) => handleEdit(_id, 'Nom', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    value={Prenom} 
                                    onChange={(e) => handleEdit(_id, 'Prenom', e.target.value)}
                                />
                            </td>
                            <td>
                                <input 
                                    type="text" 
                                    value={NumEtudiant} 
                                    onChange={(e) => handleEdit(_id, 'NumEtudiant', e.target.value)}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleEdit(_id, 'Nom', Nom)}>Modifier</button>
                                <button onClick={() => handleDelete(_id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Etudiants;
