import React, { useContext } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { AccountContext } from "../components/AccountContext/AccountContext.js";

function Historico() {
    const { transactionHistory } = useContext(AccountContext);

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Histórico de Transações</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Valor</th>
                <th>Tipo de Transação</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor da Conta</th>
              </tr>
            </thead>
            <tbody>
              {transactionHistory.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.value}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.category}</td>
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