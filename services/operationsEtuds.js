import axios from 'axios';

export const getEtudiants = 
(callback)=>{ axios.get('http://localhost:4000/Etudiants ') .then((res)=> 
    callback(res))
}

export const updateEtudiant =
(Etudiant,callback)=>{ axios.put(`http://localhost:4000/Etudiants/update/${Etudiant._id}`,Etudiant) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}

export const addEtudiant =
(Etudiant,callback)=>{ axios.post('http://localhost:4000/Etudiants/add',Etudiant) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}

export const removeEtudiant =
(id,callback)=>{ axios.delete(`http://localhost:4000/Etudiants/delete/${id}`) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}