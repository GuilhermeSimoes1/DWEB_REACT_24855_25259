import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Modal } from 'react-bootstrap';

function Contas() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [initialAccountValue, setInitialAccountValue] = useState('');
    const [editAccount, setEditAccount] = useState({ contaID: null, nomeConta: '', saldo: 0 });
    const [accountToDelete, setAccountToDelete] = useState(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const userFK = userData.userID;
        fetch(`https://localhost:7082/api/V1/Contas?userFK=${userFK}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar contas');
                }
                return response.json();
            })
            .then(data => {
                setAccounts(data);
                if (data.length > 0) {
                    setSelectedAccountId(data[0].contaID);
                }
            })
            .catch(error => console.error('Houve um erro ao buscar as contas!', error));
    };

    const addAccount = () => {
        if (newAccountName.trim() === '' || isNaN(parseFloat(initialAccountValue))) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }
    
        const userData = JSON.parse(localStorage.getItem("user"));
        const userFK = userData.userID;
        const oldEmail = userData.email;
        
        const newAccount = {
            NomeConta: newAccountName,
            Saldo: parseFloat(initialAccountValue)
        };
    
        fetch(`https://localhost:7082/api/V1/Contas?UserFK=${userFK}&OldEmail=${oldEmail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAccount),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar a conta');
            }
            return response.json();
        })
        .then(addedAccount => {
            setAccounts([...accounts, addedAccount]);
            setShowModal(false);
            setNewAccountName('');
            setInitialAccountValue('');
        })
        .catch(error => {
            console.error('Houve um erro ao adicionar a conta!', error);
        });
    };
    

    const updateAccount = () => {
        fetch(`https://localhost:7082/api/V1/Contas/${editAccount.contaID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editAccount),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a conta');
                }
                return response.json();
            })
            .then(updatedAccount => {
                const updatedAccounts = accounts.map(account =>
                    account.contaID === editAccount.contaID ? updatedAccount : account
                );
                setAccounts(updatedAccounts);
                setShowEditModal(false);
            })
            .catch(error => {
                console.error('Houve um erro ao atualizar a conta!', error);
            });
    };

    const deleteAccount = () => {
        fetch(`https://localhost:7082/api/V1/Contas/${accountToDelete.contaID}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir a conta');
                }
                const updatedAccounts = accounts.filter(account => account.contaID !== accountToDelete.contaID);
                setAccounts(updatedAccounts);
                setSelectedAccountId(updatedAccounts.length > 0 ? updatedAccounts[0].contaID : null);
                setShowDeleteModal(false);
            })
            .catch(error => {
                console.error('Houve um erro ao excluir a conta!', error);
            });
    };

    const handleSelectAccount = (accountId) => {
        setSelectedAccountId(accountId);
    };

    const handleRemoveAccount = (accountId) => {
        setShowDeleteModal(true);
        setAccountToDelete(accounts.find(account => account.contaID === accountId));
    };

    const handleEditAccount = (account) => {
        setEditAccount({ ...account });
        setShowEditModal(true);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Contas</h2>
                    <Button variant="primary" style={{ marginBottom: '35px' }} onClick={() => setShowModal(true)}>
                        Adicionar Conta
                    </Button>
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
