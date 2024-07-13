import React, { useEffect, useState } from 'react';
import "../assets/css/modals.css"; // Importa estilos CSS para os modais
import "../assets/css/transacoescategorias.css"; // Importa estilos CSS específicos para transações e categorias

const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1"; 

const TransactionsCategories = () => {
    // Estados para armazenar os dados da API, item selecionado, estado dos modais e valores do formulário
    const [data, setData] = useState([]); // Estado para armazenar os dados das transações e categorias
    const [selectedItem, setSelectedItem] = useState(null); // Estado para o item selecionado
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Estado para controlar a abertura do modal de detalhes
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar a abertura do modal de edição
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controlar a abertura do modal de exclusão
    const [formValues, setFormValues] = useState({ // Estado para armazenar os valores do formulário de edição
        transacaoFK: '',
        categoriaFK: '',
        valor: '',
        descricao: '' 
    });

    // Efeito para buscar os dados das transações e categorias da API ao carregar o componente
    useEffect(() => {
        fetch(`${url}/GetTransacoesCategorias`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setData(data);
                } else {
                    console.error('Fetch retornou dados que não são de um array:', data);
                }
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }, []);

    // Função para lidar com o clique no botão de detalhes de um item
    const handleDetailClick = (item) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    // Função para lidar com o clique no botão de edição de um item
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

    // Função para lidar com o clique no botão de exclusão de um item
    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    // Função para confirmar a exclusão de um item após clicar no botão "Apagar" no modal
    const handleDeleteConfirmed = () => {
        fetch(`${url}/DeleteTransCat/${selectedItem.transacao.id}/${selectedItem.categoria.id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                const updatedData = data.filter(d => !(d.transacao.id === selectedItem.transacao.id && d.categoria.id === selectedItem.categoria.id));
                setData(updatedData);
                setIsDeleteModalOpen(false);
            } else {
                throw new Error('Falha na requisição de exclusão');
            }
        })
        .catch(error => console.error('Erro ao excluir:', error));
    };

    // Função para lidar com a submissão do formulário de edição
    const handleEditSubmit = (e) => {
        e.preventDefault();

        const requestBody = {
            transacaoFK: parseInt(formValues.transacaoFK),
            categoriaFK: parseInt(formValues.categoriaFK),
            valor: parseFloat(formValues.valor),
            descricao: formValues.descricao 
        };

        fetch(`${url}/EditTransCat/${selectedItem.transacao.id}`, {
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
                                descricao: formValues.descricao // Atualiza a descrição da transação
                            }
                        };
                    }
                    return item;
                });

                setData(updatedData);
                setIsEditModalOpen(false);
            } else {
                throw new Error('Falha na requisição de edição');
            }
        })
        .catch(error => {
            console.error('Erro na edição:', error);
        });
    };

    // Função para lidar com as mudanças nos inputs do formulário de edição
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Renderização do componente de transações e categorias
    return (
        <div>
            <h2>Lista de Transações e Categorias</h2>

            {/* Tabela para exibir os dados das transações e categorias */}
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
                    {/* Mapeamento dos itens para exibição na tabela */}
                    {data.map(item => (
                        <tr key={`${item.transacao.id}-${item.categoria.id}`}>
                            <td>{item.transacao?.descricao}</td>
                            <td>{item.categoria?.nomeCategoria}</td>
                            <td>{item.valor}</td>
                            <td>
                                {/* Botões de ação: detalhes, edição e exclusão */}
                                <button onClick={() => handleDetailClick(item)} className="btn btn-info">Detalhes</button>
                                <button onClick={() => handleEditClick(item)} className="btn btn-warning" style={{marginLeft:"10px"}}>Editar</button>
                                <button onClick={() => handleDeleteClick(item)} className="btn btn-danger" style={{marginLeft:"10px"}}>Apagar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para exibir os detalhes do item selecionado */}
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

            {/* Modal para editar o item selecionado */}
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

            {/* Modal para confirmar a exclusão do item */}
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
