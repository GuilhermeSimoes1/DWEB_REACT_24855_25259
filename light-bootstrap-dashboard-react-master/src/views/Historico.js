import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import "../assets/css/historico.css";


const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1";

function Historico() {
  // armazenar o histórico das transações
  const [transactionHistory, setTransactionHistory] = useState([]);
  // Obtém os dados do utilizador armazenados no localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData.userID;

  // useEffect para ir buscar o histórico de transações quando o componente é montado
  useEffect(() => {
    // Função para ir buscar o histórico de transações
    fetch(`${url}/GetHistoricoTransacoes?userId=${userId}`)
      .then((response) => {
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
          throw new Error("Erro ao buscar histórico de transações");
        }
        return response.json();
      })
      // Atualiza o estado com os dados recebidos
      .then((data) => setTransactionHistory(data))
      .catch((error) => console.error(error.message));
  }, [userId]);

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Data inválida" : date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Função para mapear o tipo de transação
  const mapTipoTransacao = (tipoTransacao) => {
    return tipoTransacao === 0 ? "Ganho" : "Gasto";
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="historico-header">
            <h2>Histórico de Transações</h2>
          </div>
          <Table striped bordered hover className="historico-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo de Transação</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Conta</th>
                <th>Utilizador</th>
              </tr>
            </thead>
            <tbody>
              {/* Itera histórico de transações e cria uma linha para cada transação */}
              {transactionHistory.map((transaction, index) => (
                <tr key={index}>
                  <td>{formatDate(transaction.dataTime)}</td>
                  <td>{mapTipoTransacao(transaction.tipoTransacao)}</td>
                  <td>{transaction.descricao}</td>
                  <td>{transaction.valorTransacao}</td>
                  <td>{transaction.conta}</td>
                  <td>{transaction.email}</td> 
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