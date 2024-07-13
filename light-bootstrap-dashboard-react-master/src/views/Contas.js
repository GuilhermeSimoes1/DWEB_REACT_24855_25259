import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';
import "../assets/css/contas.css";

// URL base da API
const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1";

function Contas() {
    // Estados para gerir as contas, conta selecionada, visibilidade dos modais, etc.
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal para adicionar nova conta
    const [showEditModal, setShowEditModal] = useState(false); // Modal para editar conta existente
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal para confirmar exclusão de conta
    const [newAccountName, setNewAccountName] = useState(''); // Nome da nova conta a ser adicionada
    const [initialAccountValue, setInitialAccountValue] = useState(''); // Valor inicial da nova conta a ser adicionada
    const [editAccount, setEditAccount] = useState({ contaID: null, nomeConta: '', saldo: 0 }); // Dados da conta a ser editada
    const [accountToDelete, setAccountToDelete] = useState(null); // Conta a ser excluída

    // useEffect para carregar as contas quando o componente é montado
    useEffect(() => {
        fetchAccounts(); // Chama a função para buscar as contas
    }, []);

    // Função para buscar as contas do utilizador
    const fetchAccounts = () => {
        const userData = JSON.parse(localStorage.getItem('user')); // Obtém dados do utilizador do localStorage
        const userFK = userData.userID; // Obtém o ID do utilizador
        fetch(`${url}/Contas?userFK=${userFK}`) // Faz a requisição para buscar as contas do utilizador
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar contas'); // Lança erro se a requisição falhar
                }
                return response.json();
            })
            .then(data => {
                setAccounts(data); // Define as contas no estado
                if (data.length > 0) {
                    setSelectedAccountId(data[0].contaID); // Seleciona a primeira conta se houver contas disponíveis
                }
            })
            .catch(error => console.error('Houve um erro ao buscar as contas!', error)); // Lida com erros na requisição
    };

    // Função para adicionar uma nova conta
    const addAccount = () => {
        // Validações de campos
        if (newAccountName.trim() === '' || isNaN(parseFloat(initialAccountValue))) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const userData = JSON.parse(localStorage.getItem("user")); // Obtém dados do utilizador do localStorage
        const userFK = userData.userID; // Obtém o ID do utilizador
        const oldEmail = userData.email; // Obtém o email antigo do utilizador
        
        const newAccount = {
            NomeConta: newAccountName, // Nome da nova conta
            Saldo: parseFloat(initialAccountValue) // Valor inicial da nova conta
        };

        // Faz a requisição para adicionar a nova conta
        fetch(`${url}/Contas?UserFK=${userFK}&OldEmail=${oldEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAccount), // Corpo da requisição com os dados da nova conta
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar a conta'); // Lança erro se a requisição falhar
            }
            return response.json();
        })
        .then(addedAccount => {
            setAccounts([...accounts, addedAccount]); // Adiciona a nova conta ao estado
            setShowModal(false); // Fecha o modal de adicionar conta
            setNewAccountName(''); // Limpa o campo do nome da nova conta
            setInitialAccountValue(''); // Limpa o campo do valor inicial da nova conta
        })
        .catch(error => {
            console.error('Houve um erro ao adicionar a conta!', error); // Lida com erros na requisição
        });
    };

    // Função para atualizar uma conta existente
    const updateAccount = () => {
        // Faz a requisição para atualizar a conta
        fetch(`${url}/Contas/${editAccount.contaID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editAccount), // Corpo da requisição com os dados da conta editada
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar a conta'); // Lança erro se a requisição falhar
            }
            return response.json();
        })
        .then(updatedAccount => {
            // Atualiza a lista de contas no estado
            const updatedAccounts = accounts.map(account =>
                account.contaID === editAccount.contaID ? updatedAccount : account
            );
            setAccounts(updatedAccounts); // Define as contas atualizadas no estado
            setShowEditModal(false); // Fecha o modal de edição de conta
        })
        .catch(error => {
            console.error('Houve um erro ao atualizar a conta!', error); // Lida com erros na requisição
        });
    };

    // Função para excluir uma conta
    const deleteAccount = () => {
        // Faz a requisição para excluir a conta
        fetch(`${url}/Contas/${accountToDelete.contaID}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir a conta'); // Lança erro se a requisição falhar
            }
            // Remove a conta excluída do estado
            const updatedAccounts = accounts.filter(account => account.contaID !== accountToDelete.contaID);
            setAccounts(updatedAccounts); // Define as contas atualizadas no estado
            setSelectedAccountId(updatedAccounts.length > 0 ? updatedAccounts[0].contaID : null); // Define a conta selecionada
            setShowDeleteModal(false); // Fecha o modal de confirmação de exclusão
        })
        .catch(error => {
            console.error('Houve um erro ao excluir a conta!', error); // Lida com erros na requisição
        });
    };

    // Função para selecionar uma conta
    const handleSelectAccount = (accountId) => {
        setSelectedAccountId(accountId); // Define a conta selecionada
    };

    // Função para mostrar o modal de confirmação de exclusão
    const handleRemoveAccount = (accountId) => {
        setShowDeleteModal(true); // Abre o modal de confirmação de exclusão
        setAccountToDelete(accounts.find(account => account.contaID === accountId)); // Define a conta a ser excluída
    };

    // Função para mostrar o modal de edição de conta
    const handleEditAccount = (account) => {
        setEditAccount({ ...account }); // Define a conta a ser editada
        setShowEditModal(true); // Abre o modal de edição de conta
    };

    return (
        <Container>
            <Row style={{ marginBottom: "300px" }}>
                <Col>
                        <h2>Contas</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome da Conta</th>
                                    <th>Valor da Conta</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account) => (
                                    <tr key={account.contaID}>
                                        <td>{account.contaID}</td>
                                        <td>{account.nomeConta}</td>
                                        <td>{account.saldo} EUR</td>
                                        <td>
                                            <Button variant="warning" style={{ marginLeft: '10px' }} onClick={() => handleEditAccount(account)}>
                                                Editar
                                            </Button>{' '}
                                            <Button variant="danger" style={{ marginLeft: '10px' }} onClick={() => handleRemoveAccount(account.contaID)}>
                                                Remover
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <button className="btn-add" type="submit" onClick={() => setShowModal(true)}>
                                Adicionar Conta
                            </button>
                        </Table>
                </Col>
            </Row>

            {/* Modal para adicionar nova conta */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Nova Conta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formNewAccountName">
                        <Form.Label>Nome da Conta</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite o nome da nova conta"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formInitialAccountValue">
                        <Form.Label>Valor Inicial da Conta (EUR)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Digite o valor inicial da conta"
                            value={initialAccountValue}
                            onChange={(e) => setInitialAccountValue(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={addAccount}>
                        Adicionar Conta
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar conta */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Conta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formEditAccountName">
                        <Form.Label>Nome da Conta</Form.Label>
                        <Form.Control
                            type="text"
                            value={editAccount.nomeConta}
                            onChange={(e) => setEditAccount({ ...editAccount, nomeConta: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="formEditInitialAccountValue">
                        <Form.Label>Valor Inicial da Conta (EUR)</Form.Label>
                        <Form.Control
                            type="number"
                            value={editAccount.saldo}
                            onChange={(e) => setEditAccount({ ...editAccount, saldo: parseFloat(e.target.value) })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={updateAccount}>
                        Salvar Alterações
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para confirmação de exclusão */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza de que deseja excluir a conta "{accountToDelete ? accountToDelete.nomeConta : ''}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={deleteAccount}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Contas;
