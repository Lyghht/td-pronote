import React, { useState } from 'react';

function Etudiants() {

    const initialData = [
        { id: 1, first: 'Mark', last: 'Otto', handle: '@mdo' },
        { id: 2, first: 'Jacob', last: 'Thornton', handle: '@fat' },
        { id: 3, first: 'Larry', last: 'Bird', handle: '@twitter' }
    ];


    const [data, setData] = useState(initialData);


    const handleEdit = (id, field, value) => {
        const updatedData = data.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setData(updatedData);
    };


    const handleDelete = (id) => {
        const updatedData = data.filter(item => item.id !== id);
        setData(updatedData);
    };

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(({ id, first, last, handle }) => (
                        <tr key={id}>
                            <th scope="row">{id}</th>
                            <td contentEditable onBlur={e => handleEdit(id, 'first', e.target.textContent)}>{first}</td>
                            <td contentEditable onBlur={e => handleEdit(id, 'last', e.target.textContent)}>{last}</td>
                            <td contentEditable onBlur={e => handleEdit(id, 'handle', e.target.textContent)}>{handle}</td>
                            <td>
                                <button onClick={() => handleEdit(id, 'first', document.getElementById(id + 'first').textContent)}>Modifier</button>
                                <button onClick={() => handleDelete(id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Etudiants;
