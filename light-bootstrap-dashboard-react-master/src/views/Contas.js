import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Modal } from "react-bootstrap";
import { AccountContext } from "../components/AccountContext/AccountContext.js";
import axios from "axios";

function Contas() {
    const { accounts, setAccounts, selectedAccountId, setSelectedAccountId } = useContext(AccountContext);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState("");
    const [initialAccountValue, setInitialAccountValue] = useState("");
    const [editAccount, setEditAccount] = useState({ id: null, name: "", accountValue: 0 });
    const [accountToDelete, setAccountToDelete] = useState(null);

    useEffect(() => {
        axios.get("/api/V1/GetAccounts")
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the accounts!", error);
            });
    }, []);

    const handleSelectAccount = (accountId) => {
        setSelectedAccountId(accountId);
    };

    const handleRemoveAccount = (accountId) => {
        setShowDeleteModal(true);
        setAccountToDelete(accounts.find(account => account.id === accountId));
    };

    const handleAddAccount = () => {
        if (newAccountName.trim() === "") {
            alert("Por favor, insira um nome para a nova conta.");
            return;
        }

        if (isNaN(parseFloat(initialAccountValue))) {
            alert("Por favor, insira um valor válido para o valor inicial da conta.");
            return;
        }

        const newAccount = {
            name: newAccountName,
            accountValue: parseFloat(initialAccountValue),
        };

        axios.post("/api/V1/AddAccount", newAccount)
            .then(response => {
                setAccounts([...accounts, response.data]);
                setNewAccountName("");
                setInitialAccountValue("");
                setShowModal(false);
            })
            .catch(error => {
                console.error("There was an error adding the account!", error);
            });
    };

    const handleEditAccount = (account) => {
        setEditAccount({ ...account });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        axios.put(`/api/V1/UpdateAccount/${editAccount.id}`, editAccount)
            .then(response => {
                const updatedAccounts = accounts.map((account) =>
                    account.id === editAccount.id ? response.data : account
                );
                setAccounts(updatedAccounts);
                setShowEditModal(false);
            })
            .catch(error => {
                console.error("There was an error updating the account!", error);
            });
    };

    const handleDeleteAccount = () => {
        axios.delete(`/api/V1/DeleteAccount/${accountToDelete.id}`)
            .then(() => {
                const updatedAccounts = accounts.filter((account) => account.id !== accountToDelete.id);
                setAccounts(updatedAccounts);
                setSelectedAccountId(updatedAccounts.length > 0 ? updatedAccounts[0].id : null);
                setShowDeleteModal(false);
            })
            .catch(error => {
                console.error("There was an error deleting the account!", error);
            });
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Contas</h2>
                    <Button variant="primary" style={{ marginBottom: "35px" }} onClick={() => setShowModal(true)}>
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
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.name}</td>
                                    <td>{account.accountValue} EUR</td>
                                    <td>
                                        <Button variant="info" style={{ marginLeft: "10px" }} onClick={() => handleSelectAccount(account.id)}>
                                            Selecionar
                                        </Button>{" "}
                                        <Button variant="warning" style={{ marginLeft: "10px" }} onClick={() => handleEditAccount(account)}>
                                            Editar
                                        </Button>{" "}
                                        <Button variant="danger" style={{ marginLeft: "10px" }} onClick={() => handleRemoveAccount(account.id)}>
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
                    <Button variant="primary" onClick={handleAddAccount}>
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
                            value={editAccount.name}
                            onChange={(e) => setEditAccount({ ...editAccount, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="formEditInitialAccountValue">
                        <Form.Label>Valor Inicial da Conta (EUR)</Form.Label>
                        <Form.Control
                            type="number"
                            value={editAccount.accountValue}
                            onChange={(e) => setEditAccount({ ...editAccount, accountValue: parseFloat(e.target.value) })}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
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
                    Tem certeza de que deseja excluir a conta "{accountToDelete?.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Contas;
