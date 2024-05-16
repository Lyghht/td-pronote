import axios from 'axios';

export const getEnseignants =
(callback)=>{ axios.get('http://localhost:4000/Enseignants ') .then((res)=> 
    callback(res))
}

export const updateEnseignant =
(Enseignant,callback)=>{ axios.put(`http://localhost:4000/Enseignants/update/${Enseignant._id}`,Enseignant) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}

export const addEnseignant =
(Enseignant,callback)=>{ axios.post('http://localhost:4000/Enseignants/add',Enseignant) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}

export const removeEnseignant =
(id,callback)=>{ axios.delete(`http://localhost:4000/Enseignants/delete/${id}`) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}