import axios from 'axios';

export const getMatieres =
(callback)=>{ axios.get('http://localhost:4000/Matieres ') .then((res)=> 
    callback(res))
}

export const updateMatiere =
(Matiere,callback)=>{ axios.put(`http://localhost:4000/Matieres/update/${Matiere._id}`,Matiere) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}

export const addMatiere =
(Matiere,callback)=>{ axios.post('http://localhost:4000/Matieres/add',Matiere) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}

export const removeMatiere =
(id,callback)=>{ axios.delete(`http://localhost:4000/Matieres/delete/${id}`) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}