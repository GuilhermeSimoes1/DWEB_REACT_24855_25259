import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";

function Historico() {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.userID;

  useEffect(() => {
    fetch(`https://localhost:7082/api/V1/GetHistoricoTransacoes?userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar histórico de transações");
        }
        return response.json();
      })
      .then((data) => setTransactionHistory(data))
      .catch((error) => console.error(error.message));
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Data inválida" : date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const mapTipoTransacao = (tipoTransacao) => {
    return tipoTransacao === 0 ? "Ganho" : "Gasto";
  };


  return (
    <Container fluid>
      <Row>
        <Col>
          <h2 style={{ textAlign: 'center', marginBottom: "50px" }}>Histórico de Transações</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo de Transação</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Conta</th>
                <th>Usuário</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((transaction, index) => (
                <tr key={index}>
                  <td>{formatDate(transaction.dataTime)}</td>
                  <td>{mapTipoTransacao(transaction.tipoTransacao)}</td>
                  <td>{transaction.descricao}</td>
                  <td>{transaction.valorTransacao}</td>
                  <td>{transaction.conta}</td>
                  <td>{transaction.email}</td> {/* Adicionando o e-mail do usuário */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Historico;
