import React, { useState } from "react";
import Doughnut from "../doughnut/Doughnut";
import "../doughnut/Doughnut.css";
import {
  Button,
  Card,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";


function Dashboard() {
  const [accountValue, setAccountValue] = useState(0);
  const [inputValue, setInputValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [transactionType, setTransactionType] = useState('');

  const ganhoCategories = ['Salário', 'Presentes', 'Investimentos'];
  const gastoCategories = ['Saúde', 'Lazer', 'Casa', 'Educação', 'Presentes'];

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
    setCategory('');
  };

  const handleConfirm = () => {
    if (transactionType === 'ganho') {
      setAccountValue(accountValue + inputValue);
    } else if (transactionType === 'gasto') {
      setAccountValue(accountValue - inputValue);
    }

    const initialColors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 255, 255, 0.2)',
      'rgba(0, 0, 0, 0.2)',
      'rgba(255, 255, 255, 0.2)'
    ];

    if (transactionType === 'ganho') {
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
    } else if (transactionType === 'gasto') {
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

    setShowForm(false);
  };

  return (
    <Container fluid>
      <Row>
      <Col lg="6">
          <h2 style={{ color: "white", marginBottom: "20px" }}>
            <span style={{ fontSize: "2em" }}>{accountValue}</span>
            <span style={{ fontSize: "0.5em" }}> EUR</span>
          </h2>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="input"
          />
          <div className="button" onClick={() => setShowForm(true)}>+</div>
          <div className={`form ${showForm ? 'show' : ''}`}>
            <select className='dropdown' value={transactionType} onChange={handleTransactionTypeChange}>
              <option value="">Selecione o tipo de transação</option>
              <option value="ganho">Ganho</option>
              <option value="gasto">Gasto</option>
            </select>
            <select className='dropdown' value={category} onChange={handleCategoryChange}>
              <option value="">Selecione uma categoria</option>
              {transactionType === 'ganho' && ganhoCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {transactionType === 'gasto' && gastoCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button type="button" className="btn btn-outline-success" onClick={handleConfirm}>Confirmar</button>
          </div>
        </Col>
        <Col lg="6">
          {transactionType === 'ganho' && <Doughnut data={rendasDataGanho} />}
          {transactionType === 'gasto' && <Doughnut data={rendasDataGasto} />}
        </Col>
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
                    <p className="card-category">Revenue</p>
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
        <Col md="6">
          <Card className="card-tasks">
            <Card.Header>
              <Card.Title as="h4">Tasks</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="table-full-width">
                <Table>
                  <tbody>
                    <tr>
                      <td>
                        <Form.Check className="mb-1 pl-0">
                          <Form.Check.Label>
                            <Form.Check.Input
                              defaultValue=""
                              type="checkbox"
                            />
                            <span className="form-check-sign"></span>
                          </Form.Check.Label>
                        </Form.Check>
                      </td>
                      <td>
                        Sign contract for "What are conference organizers
                        afraid of?"
                      </td>
                      <td className="td-actions text-right">
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-488980961">
                              Edit Task
                            </Tooltip>
                          }
                        >
                          <Button
                            className="btn-simple btn-link p-1"
                            type="button"
                            variant="info"
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-506045838">Remove</Tooltip>
                          }
                        >
                          <Button
                            className="btn-simple btn-link p-1"
                            type="button"
                            variant="danger"
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                    
                  </tbody>
                </Table>
              </div>
            </Card.Body>
            <Card.Footer>
              <hr />
            </Card.Footer>
          </Card>
        </Col>
      </Row>

    </Container>
  );
}

export default Dashboard;
