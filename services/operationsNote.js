import axios from 'axios';

export const getNotes =
(callback)=>{ axios.get('http://localhost:4000/Notes ') .then((res)=> 
    callback(res))
}

export const updateNote =
(Note,callback)=>{ axios.put(`http://localhost:4000/Notes/update/${Note._id}`,Note) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}

export const addNote =
(Note,callback)=>{ axios.post('http://localhost:4000/Notes/add',Note) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}

export const removeNote =
(id,callback)=>{ axios.delete(`http://localhost:4000/Notes/delete/${id}`) 
    .then((res) => callback(res))
    .catch((err)=> callback(err));
}