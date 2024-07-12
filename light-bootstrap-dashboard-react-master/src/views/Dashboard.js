import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import "../doughnut/Doughnut.css";
import "../assets/css/Dashboard.css";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState();
  const [inputValue, setInputValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryValues, setCategoryValues] = useState({});
  const [descricao, setDescricao] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [categoriasPorTipo, setCategoriasPorTipo] = useState({});
  const [categoriaNomes, setCategoriaNomes] = useState({});

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData || !userData.userID) {
          console.error("userID não encontrado nos dados do usuário.");
          return;
        }

        const userId = userData.userID;

        const response = await fetch(
          `https://localhost:7082/api/V1/GetUserAccounts?userId=${userId}`
        );
        if (!response.ok) {
          throw new Error(`Erro ao obter contas: ${response.status}`);
        }

        const data = await response.json();
        setAccounts(data.accounts);
      } catch (error) {
        console.error("Erro ao buscar contas:", error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    fetch("https://localhost:7082/api/V1/GetCategorias")
      .then((response) => response.json())
      .then((data) => {
        setCategoriasPorTipo(data.categoriasPorTipo);
        setCategoriaNomes(data.categoriaNomes);
      })
      .catch((error) => console.error("Erro ao buscar categorias:", error));
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      const account = accounts.find(
        (acc) => Number(acc.contaID) === Number(selectedAccountId)
      );
      setSelectedAccount(account);
    } else {
      setSelectedAccount(null);
    }
  }, [selectedAccountId, accounts]);

  const handleInputChange = (event) => {
    setInputValue(Number(event.target.value));
  };

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
    setSelectedCategories([]);
    setCategoryValues({});
  };

  const handleDescricaoChange = (event) => {
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
    const totalCategoryValue = Object.values(categoryValues).reduce(
      (a, b) => a + Number(b),
      0
    );
  
    if (totalCategoryValue !== inputValue) {
      alert(
        "A soma dos valores das categorias deve ser igual ao valor da transação."
      );
      return;
    }
  
    if (!selectedAccountId || !transactionType || !descricao || selectedCategories.length === 0) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
  
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.userID) {
      console.error("userID não encontrado nos dados do usuário.");
      return;
    }
  
    const userId = userData.userID;
  
    const newTransaction = {
      ContaFK: selectedAccountId,
      ValorTransacao: inputValue,
      TipoTransacao: transactionType === "ganho" ? 0 : 1, 
      Descricao: descricao,
      UserFK: userId,
      categorias: selectedCategories.map(catId => ({
        Categoriafk: catId,
        valor: parseFloat(categoryValues[catId]) || 0
      }))
    };
    
    fetch(`https://localhost:7082/api/V1/CreateTransacao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao criar transação: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Transação criada com sucesso:", data.message);
        // Limpeza de estados após transação bem sucedida
        setInputValue(0);
        setSelectedCategories([]);
        setCategoryValues({});
        setDescricao("");
      })
      .catch((error) => {
        console.error("Erro ao criar transação:", error);
        alert("Erro ao criar transação. Por favor, tente novamente.");
      });
  };


  return (
    <Container fluid>
      <Row>
        <Col lg="3" sm="6">
          <Form.Group controlId="formAccountSelect">
            <Form.Label>Selecionar Conta</Form.Label>
            <Form.Control
              as="select"
              style={{ marginBottom: "40px" }}
              value={selectedAccountId || ""}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              <option value="" disabled>
                Selecione uma conta
              </option>
              {accounts.map((account) => (
                <option key={account.contaID} value={account.contaID}>
                  {account.nomeConta}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Card className="card-stats">
            <Card.Body>
              <Row>
                <Col xs="5">
                  <div className="icon-big text-center icon-warning">
                    <i className="nc-icon nc-money-coins text-success"></i>
                  </div>
                </Col>
                <Col xs="7">
                  <div className="numbers">
                    <p className="card-category">Valor da conta</p>
                    {selectedAccount ? (
                      <Card.Title as="h4">
                        {selectedAccount.saldo} EUR
                      </Card.Title>
                    ) : (
                      <Card.Title as="h4">Nenhuma conta selecionada</Card.Title>
                    )}
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
            <Button variant="success" onClick={() => setShowForm(!showForm)}>
              {showForm ? "-" : "+"}
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
                    {(transactionType === "ganho"
                      ? categoriasPorTipo.Ganho
                      : categoriasPorTipo.Gasto
                    ).map((catId) => (
                      <Form.Group controlId={`formCategory-${catId}`} key={catId}>
                        <Form.Check
                          type="checkbox"
                          id={`checkbox-${catId}`}
                          value={catId}
                          checked={selectedCategories.includes(catId.toString())}
                          onChange={handleCategoryChange}
                          label={categoriaNomes[catId.toString()]}
                          className="input mt-2"
                        />
                        {selectedCategories.includes(catId.toString()) && (
                          <Form.Control
                            type="number"
                            value={categoryValues[catId.toString()]}
                            onChange={(e) =>
                              handleCategoryValueChange(catId.toString(), e.target.value)
                            }
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
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
