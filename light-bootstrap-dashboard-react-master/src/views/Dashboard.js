import React, { useState, useContext } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { AccountContext } from "../components/AccountContext/AccountContext.js";
import Doughnut from "../doughnut/Doughnut"; // Verifique se o caminho do seu componente Doughnut está correto
import "../doughnut/Doughnut.css";
import "../assets/css/Dashboard.css";
import Task from "../components/Task.js";

function Dashboard() {
  const { accountValue, setAccountValue, transactionHistory, setTransactionHistory } = useContext(AccountContext);
  const [inputValue, setInputValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryValues, setCategoryValues] = useState({});
  const [descricao, setDescricao] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const ganhoCategories = ["Salário", "Presentes", "Investimentos"];
  const gastoCategories = ["Saúde", "Lazer", "Casa", "Educação", "Presentes"];

  const [rendasDataGanho, setRendasDataGanho] = useState({
    labels: ganhoCategories,
    datasets: [
      {
        data: new Array(ganhoCategories.length).fill(0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
      },
    ],
  });

  const [rendasDataGasto, setRendasDataGasto] = useState({
    labels: gastoCategories,
    datasets: [
      {
        data: new Array(gastoCategories.length).fill(0),
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 255, 255, 0.2)",
          "rgba(0, 0, 0, 0.2)",
        ],
        hoverBackgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 255, 255, 0.2)",
          "rgba(0, 0, 0, 0.2)",
        ],
      },
    ],
  });

  const handleInputChange = (event) => {
    setInputValue(Number(event.target.value));
  };

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
    setSelectedCategories([]);
    setCategoryValues({});
  };

  const 
  handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(value)
        ? prevSelectedCategories.filter((category) => category !== value)
        : [...prevSelectedCategories, value]
    );
    setCategoryValues((prevValues) => ({
      ...prevValues,
      [value]: prevValues[value] || "",
    }));
  };

  const handleCategoryValueChange = (category, value) => {
    setCategoryValues((prevValues) => ({
      ...prevValues,
      [category]: value,
    }));
  };

  const handleConfirm = () => {
    const totalCategoryValue = Object.values(categoryValues).reduce((a, b) => a + Number(b), 0);

    if (totalCategoryValue !== inputValue) {
      alert("A soma dos valores das categorias deve ser igual ao valor da transação.");
      return;
    }

    if (transactionType === "ganho") {
      setAccountValue(accountValue + inputValue);
    } else if (transactionType === "gasto") {
      setAccountValue(accountValue - inputValue);
    }

    const updateData = (data, categories, values) => {
      categories.forEach((category) => {
        const index = data.labels.indexOf(category);
        if (index !== -1) {
          data.datasets[0].data[index] += Number(values[category]);
        }
      });
      return data;
    };

    if (transactionType === "ganho") {
      setRendasDataGanho((prevData) => updateData({ ...prevData }, selectedCategories, categoryValues));
    } else if (transactionType === "gasto") {
      setRendasDataGasto((prevData) => updateData({ ...prevData }, selectedCategories, categoryValues));
    }

    // Adicionar a transação ao histórico
    const newTransaction = {
      value: inputValue,
      type: transactionType,
      categories: selectedCategories,
      categoryValues: categoryValues,
      descricao: descricao,
      accountValue: transactionType === "ganho" ? accountValue + inputValue : accountValue - inputValue,
    };
    setTransactionHistory([...transactionHistory, newTransaction]);

    // Reset form
    setInputValue(0);
    setSelectedCategories([]);
    setCategoryValues({});
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
          <Form>
            <Form.Group controlId="formValor">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Digite o valor"
                className="input mt-2"
              />
              
            </Form.Group>
            <Button variant="success" onClick={() => setShowForm(prevShowForm => !prevShowForm)}>
              {showForm ? '-' : '+'}
            </Button>
            {showForm && (
              <div className="form show">
                <Form.Group controlId="formTransactionType">
                  <Form.Label>Tipo de Transação</Form.Label>
                  <Form.Control
                    as="select"
                    value={transactionType}
                    onChange={handleTransactionTypeChange}
                    className="input mt-2"
                  >
                    <option value="">Selecione o tipo de transação</option>
                    <option value="ganho">Ganho</option>
                    <option value="gasto">Gasto</option>
                  </Form.Control>
                </Form.Group>
                {transactionType && (
                  <div>
                    {(transactionType === "ganho" ? ganhoCategories : gastoCategories).map((cat) => (
                      <Form.Group controlId={`formCategory-${cat}`} key={cat}>
                        <Form.Check
                          type="checkbox"
                          id={`checkbox-${cat}`}
                          value={cat}
                          checked={selectedCategories.includes(cat)}
                          onChange={handleCategoryChange}
                          label={cat}
                          className="input mt-2"
                        />
                        {selectedCategories.includes(cat) && (
                          <Form.Control
                            type="number"
                            value={categoryValues[cat]}
                            onChange={(e) => handleCategoryValueChange(cat, e.target.value)}
                            placeholder="Digite o valor necessário"
                            className="input mt-2"
                          />
                        )}
                      </Form.Group>
                    ))}
                  </div>
                )}
                <Form.Group controlId="formDescricao">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    type="text"
                    value={descricao}
                    onChange={handleDescricaoChange}
                    className="input descricao-input"
                    placeholder="Descrição"
                  />
                </Form.Group>
                <Button variant="outline-success" onClick={handleConfirm}>
                  Confirmar
                </Button>
              </div>
            )}
            <Form style={{marginTop: "150px"}}>
              <Task />
            </Form>
          </Form>
        </Col>
        <Col lg="6" style={{ marginRight: "200px" }}>
          {/* Renderiza o gráfico de acordo com o tipo de transação selecionada */}
          {transactionType === "ganho" && <Doughnut data={rendasDataGanho} />}
          {transactionType === "gasto" && <Doughnut data={rendasDataGasto} />}
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
