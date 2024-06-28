import React, { useState, useContext } from "react";
import Doughnut from "../doughnut/Doughnut";
import "../doughnut/Doughnut.css";
import "../assets/css/Dashboard.css";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { AccountContext } from "../components/AccountContext/AccountContext.js";

function Dashboard() {
  const { accountValue, setAccountValue, transactionHistory, setTransactionHistory } = useContext(AccountContext);
  const [inputValue, setInputValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [descricao, setDescricao] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const ganhoCategories = ["Salário", "Presentes", "Investimentos"];
  const gastoCategories = ["Saúde", "Lazer", "Casa", "Educação", "Presentes"];

  const [rendasDataGanho, setRendasDataGanho] = useState({
    labels: ganhoCategories,
    datasets: [
      {
        data: new Array(ganhoCategories.length).fill(0),
        backgroundColor: new Array(ganhoCategories.length).fill("blue"),
        hoverBackgroundColor: new Array(ganhoCategories.length).fill("blue"),
      },
    ],
  });
  
  const [rendasDataGasto, setRendasDataGasto] = useState({
    labels: gastoCategories,
    datasets: [
      {
        data: new Array(gastoCategories.length).fill(0),
        backgroundColor: new Array(gastoCategories.length).fill("blue"),
        hoverBackgroundColor: new Array(gastoCategories.length).fill("blue"),
      },
    ],
  });

  const handleInputChange = (event) => {
    setInputValue(Number(event.target.value));
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
    setCategory("");
  };

  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  const handleConfirm = () => {
    if (transactionType === "ganho") {
      setAccountValue(accountValue + inputValue);
    } else if (transactionType === "gasto") {
      setAccountValue(accountValue - inputValue);
    }

    const initialColors = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 255, 255, 0.2)",
      "rgba(0, 0, 0, 0.2)",
      "rgba(255, 255, 255, 0.2)",
    ];

    if (transactionType === "ganho") {
      setRendasDataGanho((prevData) => {
        const newData = { ...prevData };
        const index = newData.labels.indexOf(category);
        if (index !== -1) {
          newData.datasets[0].data[index] += inputValue;
          newData.datasets[0].backgroundColor[index] = initialColors[index];
          newData.datasets[0].hoverBackgroundColor[index] = initialColors[index];
        }
        return newData;
      });
    } else if (transactionType === "gasto") {
      setRendasDataGasto((prevData) => {
        const newData = { ...prevData };
        const index = newData.labels.indexOf(category);
        if (index !== -1) {
          newData.datasets[0].data[index] += inputValue;
          newData.datasets[0].backgroundColor[index] = initialColors[index];
          newData.datasets[0].hoverBackgroundColor[index] = initialColors[index];
        }
        return newData;
      });
    }

    // Adicionar a transação ao histórico
    const newTransaction = {
      value: inputValue,
      type: transactionType,
      category: category,
      descricao: descricao,
      accountValue: transactionType === "ganho" ? accountValue + inputValue : accountValue - inputValue,
    };
    setTransactionHistory([...transactionHistory, newTransaction]);

   
    setInputValue(0);
    setCategory("");
    
    setDescricao("");
    setShowForm(false);
  };

  return (
    <Container fluid>
      <Row>
        <Col lg="3" sm="6">
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-light-3 text-success"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category">Valor da conta</p>
                    <Card.Title as="h4">{accountValue} EUR</Card.Title>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <hr />
              <div className="stats">
                <i className="far fa-calendar-alt mr-1"></i>
                Last day
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="input"
          />
          <div className="button" onClick={() => setShowForm(true)}>
            +
          </div>
          <div className={`form ${showForm ? "show" : ""}`}>
            <select
              className="dropdown"
              value={transactionType}
              onChange={handleTransactionTypeChange}
            >
              <option value="">Selecione o tipo de transação</option>
              <option value="ganho">Ganho</option>
              <option value="gasto">Gasto</option>
            </select>
            <select
              className="dropdown"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">Selecione uma categoria</option>
              {transactionType === "ganho" &&
                ganhoCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              {transactionType === "gasto" &&
                gastoCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            <input
              type="text"
              value={descricao}
              onChange={handleDescricaoChange}
              className="input descricao-input"
              placeholder="Descrição"
            />
            <button
              type="button-conf"
              className="btn btn-outline-success"
              onClick={handleConfirm}
            >
              Confirmar
            </button>
          </div>
        </Col>
        <Col lg="6" style={{ marginRight: "200px" }}>
          {transactionType === "ganho" && <Doughnut data={rendasDataGanho} />}
          {transactionType === "gasto" && <Doughnut data={rendasDataGasto} />}
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
