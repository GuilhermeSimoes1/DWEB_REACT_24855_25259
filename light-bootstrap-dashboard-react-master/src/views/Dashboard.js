import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import "../assets/css/Dashboard.css"; 

const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1"; // URL 

function Dashboard() {
  // Estados para armazenar dados relacionados às contas, transações
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState();
  const [inputValue, setInputValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryValues, setCategoryValues] = useState({});
  const [descricao, setDescricao] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Estados para categorias por tipo e nomes de categoria
  const [categoriasPorTipo, setCategoriasPorTipo] = useState({});
  const [categoriaNomes, setCategoriaNomes] = useState({});

  // Efeito para ir buscar contas do utilizador ao carregar a página
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
          `${url}/GetUserAccounts?userId=${userId}`
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

  // Efeito para ir buscar categorias ao carregar a página
  useEffect(() => {
    fetch(`${url}/GetCategorias`)
      .then((response) => response.json())
      .then((data) => {
        setCategoriasPorTipo(data.categoriasPorTipo);
        setCategoriaNomes(data.categoriaNomes);
      })
      .catch((error) => console.error("Erro ao buscar categorias:", error));
  }, []);

  // Efeito para atualizar a conta selecionada quando o ID da conta muda
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

  // Função para lidar com a mudança de valor de entrada
  const handleInputChange = (event) => {
    setInputValue(Number(event.target.value));
  };

  // Função para lidar com a mudança de tipo de transação
  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
    setSelectedCategories([]);
    setCategoryValues({});
  };

  // Função para lidar com a mudança na descrição da transação
  const handleDescricaoChange = (event) => {
    setDescricao(event.target.value);
  };

  // Função para lidar com a mudança na seleção de categorias
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

  // Função para lidar com a mudança no valor de uma categoria específica
  const handleCategoryValueChange = (category, value) => {
    setCategoryValues((prevValues) => ({
      ...prevValues,
      [category]: value,
    }));
  };

  // Função para confirmar e criar a transação
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
    
    fetch(`${url}/CreateTransacao`, {
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

  // Renderização do componente do dashboard do utilizador
  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col lg="3" sm="6">
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
          </Card>
        </Col>
        <Col lg="9" sm="6">
          <Form className="transaction-form" style={{marginTop:"250px"}}>
            <Form.Group controlId="formAccountSelect">
              <Form.Label>Selecionar Conta</Form.Label>
              <Form.Control
                as="select"
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
            <Form.Group controlId="formValor">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Digite o valor"
              />
            </Form.Group>
            <Button variant="success" onClick={() => setShowForm(!showForm)}>
              {showForm ? "-" : "+"}
            </Button>
            {showForm && (
              <div>
                <Form.Group controlId="formTransactionType">
                  <Form.Label>Tipo de Transação</Form.Label>
                  <Form.Control
                    as="select"
                    value={transactionType}
                    onChange={handleTransactionTypeChange}
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
                      <Form.Group key={catId}>
                        <Form.Check
                          type="checkbox"
                          id={`checkbox-${catId}`}
                          value={catId}
                          checked={selectedCategories.includes(catId.toString())}
                          onChange={handleCategoryChange}
                          label={categoriaNomes[catId.toString()]}
                        />
                        {selectedCategories.includes(catId.toString()) && (
                          <Form.Control
                            type="number"
                            value={categoryValues[catId.toString()]}
                            onChange={(e) =>
                              handleCategoryValueChange(catId.toString(), e.target.value)
                            }
                            placeholder="Digite o valor necessário"
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
                    placeholder="Descrição"
                  />
                </Form.Group>
                <button className="btn-fix" onClick={handleConfirm}>
                  Confirmar
                </button>
              </div>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
