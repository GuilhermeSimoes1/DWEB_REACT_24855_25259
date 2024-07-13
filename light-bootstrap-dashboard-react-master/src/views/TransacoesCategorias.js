import React, { useEffect, useState } from 'react';
import "../assets/css/modals.css";

const TransactionsCategories = () => {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        transacaoFK: '',
        categoriaFK: '',
        valor: '',
        descricao: '' 
    });

    useEffect(() => {
        fetch(`https://localhost:7082/api/V1/GetTransacoesCategorias`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setData(data);
                } else {
                    console.error('Fetch returned non-array data:', data);
                }
            })
            .catch(error => console.error('Fetch error:', error));
    }, []);

    const handleDetailClick = (item) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setFormValues({
            transacaoFK: item.transacao.id,
            categoriaFK: item.categoria.id,
            valor: item.valor.toString(),
            descricao: item.transacao.descricao 
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = () => {
        fetch(`https://localhost:7082/api/V1/DeleteTransCat/${selectedItem.transacao.id}/${selectedItem.categoria.id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                const updatedData = data.filter(d => !(d.transacao.id === selectedItem.transacao.id && d.categoria.id === selectedItem.categoria.id));
                setData(updatedData);
                setIsDeleteModalOpen(false);
            } else {
                throw new Error('Delete request failed');
            }
        })
        .catch(error => console.error('Delete error:', error));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        const requestBody = {
            transacaoFK: parseInt(formValues.transacaoFK),
            categoriaFK: parseInt(formValues.categoriaFK),
            valor: parseFloat(formValues.valor),
            descricao: formValues.descricao 
        };

        console.log('Edit submit requestBody:', requestBody);

        fetch(`https://localhost:7082/api/V1/EditTransCat/${selectedItem.transacao.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => {
            if (response.ok) {
                const updatedData = data.map(item => {
                    if (item.transacao.id === selectedItem.transacao.id && item.categoria.id === selectedItem.categoria.id) {
                        return {
                            ...item,
                            valor: formValues.valor,
                            transacao: {
                                ...item.transacao,
                                descricao: formValues.descricao // Atualize a descrição
                            }
                        };
                    }
                    return item;
                });

                setData(updatedData);
                setIsEditModalOpen(false);
            } else {
                throw new Error('Edit request failed');
            }
        })
        .catch(error => {
            console.error('Edit error:', error);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div>
            <h2>Lista de Transações e Categorias</h2>

            <table className="table">
                <thead>
                    <tr>
                        <th>Descrição da Transação</th>
                        <th>Nome da Categoria</th>
                        <th>Valor</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={`${item.transacao.id}-${item.categoria.id}`}>
                            <td>{item.transacao?.descricao}</td>
                            <td>{item.categoria?.nomeCategoria}</td>
                            <td>{item.valor}</td>
                            <td>
                                <button onClick={() => handleDetailClick(item)} className="btn btn-info">Detalhes</button>
                                <button onClick={() => handleEditClick(item)} className="btn btn-warning">Editar</button>
                                <button onClick={() => handleDeleteClick(item)} className="btn btn-danger">Apagar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isDetailModalOpen && selectedItem && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsDetailModalOpen(false)}>&times;</span>
                        <h2>Detalhes</h2>
                        <p><strong>Descrição: </strong>{selectedItem.transacao?.descricao}</p>
                        <p><strong>Categoria:</strong> {selectedItem.categoria?.nomeCategoria}</p>
                        <p><strong>Valor: </strong>{selectedItem.valor}</p>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedItem && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsEditModalOpen(false)}>&times;</span>
                        <h2>Editar</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label htmlFor="transacaoFK">ID da Transação:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="transacaoFK"
                                    name="transacaoFK"
                                    value={formValues.transacaoFK}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="categoriaFK">ID da Categoria:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="categoriaFK"
                                    name="categoriaFK"
                                    value={formValues.categoriaFK}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="descricao">Descrição:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="descricao"
                                    name="descricao"
                                    value={formValues.descricao}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="valor">Valor:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="valor"
                                    name="valor"
                                    value={formValues.valor}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Salvar</button>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && selectedItem && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsDeleteModalOpen(false)}>&times;</span>
                        <h2>Confirmar Exclusão</h2>
                        <p>Tem certeza que deseja apagar esta transação?</p>
                        <button onClick={handleDeleteConfirmed} className="btn btn-danger">Apagar</button>
                        <button onClick={() => setIsDeleteModalOpen(false)} className="btn btn-secondary">Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsCategories;
