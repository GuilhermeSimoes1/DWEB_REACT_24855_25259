import React, { useContext } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { AccountContext } from "../components/AccountContext/AccountContext.js";

function Historico() {
  const { transactionHistory, selectedAccountId } = useContext(AccountContext);

  const filteredTransactions = transactionHistory.filter(transaction => transaction.accountId === selectedAccountId);

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2 style={{textAlign: 'center', marginBottom:"50px" }}>Histórico de Transações</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Valor</th>
                <th>Tipo de Transação</th>
                <th>Categorias</th>
                <th>Descrição</th>
                <th>Valor da Conta</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.value}</td>
                  <td>{transaction.type}</td>
                  <td>
                    {transaction.categories
                      .map(category => `${category} (${transaction.categoryValues[category]})`)
                      .join(", ")}
                  </td>
                  <td>{transaction.descricao}</td>
                  <td>{transaction.accountValue}</td>
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
