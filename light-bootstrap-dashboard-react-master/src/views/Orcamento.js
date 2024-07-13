import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Modal,
} from "react-bootstrap";

import "../assets/css/Orcamento.css";
import User from "./UserProfile";

const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1";

function Orcamento() {
  // Estado para armazenar a lista de orçamentos
  const [orcamentos, setOrcamentos] = useState([]);

  // Estado para armazenar os valores do formulário de adição e edição
  const [nome, setNome] = useState("");
  const [valorNecessario, setValorNecessario] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [orcamentoEdit, setOrcamentoEdit] = useState(null);

  // Estado para controlar o modal de confirmação de exclusão
  const [showModal, setShowModal] = useState(false);
  const [orcamentoParaExcluir, setOrcamentoParaExcluir] = useState(null);

  // Estado para controlar o modal de objetivo alcançado
  const [showObjetivoAlcancado, setShowObjetivoAlcancado] = useState(false);
  const [orcamentoAlcancado, setOrcamentoAlcancado] = useState(null);

  // Estado para controlar o modal de edição
  const [showEdit, setShowEdit] = useState(false);

  // Função para carregar os orçamentos do servidor
  const carregarOrcamentos = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userFK = userData.userID;
    try {
      const response = await fetch(
        `${url}/Orcamentos/${userFK}`
      );
      if (!response.ok) {
        throw new Error("Erro ao carregar os orçamentos");
      }
      const data = await response.json();
      setOrcamentos(data);
    } catch (error) {
      console.error("Erro ao carregar os orçamentos:", error);
    }
  };

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const adicionarOrcamento = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userFK = userData.userID;

    const novoOrcamento = {
      NomeOrcamento: nome,
      ValorNecessario: parseFloat(valorNecessario),
      DataFinal: dataFinal,
      ValorAtual: parseFloat(valorAtual),
      DataInicial: dataInicial,
      UserFK: userFK,
    };

    try {
      const response = await fetch(`${url}/Orcamentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoOrcamento),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar orçamento");
      }

      const data = await response.json();
      console.log("Novo orçamento adicionado:", data);

      // Atualizar a lista de orçamentos exibida na tela
      setOrcamentos([...orcamentos, data]);

      // Limpar campos do formulário após adicionar
      setNome("");
      setValorNecessario("");
      setDataFinal("");
      setValorAtual("");
      setDataInicial("");
    } catch (error) {
      console.error("Erro ao adicionar orçamento:", error);
    }
  };

  // Função para abrir o modal de edição com os dados do orçamento selecionado
  const abrirModalEdicao = (orcamento) => {
    setOrcamentoEdit(orcamento);
    setNome(orcamento.nomeOrcamento);
    setValorNecessario(orcamento.valorNecessario);
    setDataInicial(orcamento.dataInicial);
    setDataFinal(orcamento.dataFinal);
    setValorAtual(orcamento.valorAtual);
    setShowEdit(true);
  };

  // Função para editar um orçamento existente
  const handleEditarOrcamento = async (e) => {
    e.preventDefault();

    const orcamentoEditado = {
      OrcamentoID: orcamentoEdit.orcamentoID,
      NomeOrcamento: nome,
      ValorNecessario: parseFloat(valorNecessario),
      DataInicial: dataInicial,
      DataFinal: dataFinal,
      ValorAtual: parseFloat(valorAtual),
    };

    try {
      const response = await fetch(
        `${url}/Orcamentos/${orcamentoEdit.orcamentoID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orcamentoEditado),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar orçamento");
      }

      const data = await response.json();
      console.log("Orçamento editado:", data);

      // Atualizar a lista de orçamentos exibida na tela
      const orcamentosAtualizados = orcamentos.map((orc) =>
        orc.orcamentoID === data.orcamentoID ? data : orc
      );
      setOrcamentos(orcamentosAtualizados);

      // Fechar o modal de edição
      setShowEdit(false);

      // Limpar campos do formulário após edição
      setNome("");
      setValorNecessario("");
      setDataFinal("");
      setValorAtual("");
      setDataInicial("");
    } catch (error) {
      console.error("Erro ao editar orçamento:", error);
    }
  };

  // Função para excluir o orçamento
  const confirmarExclusao = async () => {
    if (orcamentoParaExcluir !== null) {
      try {
        const orcamentoId = orcamentos[orcamentoParaExcluir].orcamentoID;

        const response = await fetch(
          `${url}/Orcamentos/${orcamentoId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao excluir orçamento");
        }

        const orcamentosAtualizados = orcamentos.filter(
          (_, index) => index !== orcamentoParaExcluir
        );
        setOrcamentos(orcamentosAtualizados);
        setShowModal(false); // Fechar modal após exclusão
      } catch (error) {
        console.error("Erro ao excluir orçamento:", error);
      }
    }
  };

  // Função para fechar o modal de confirmação de exclusão
  const handleCloseModal = () => {
    setShowModal(false);
    setOrcamentoParaExcluir(null); // Limpar o estado do orçamento a ser excluído
  };

  // Função para fechar o modal de objetivo alcançado
  const handleCloseObjetivoAlcancado = () => {
    setShowObjetivoAlcancado(false);
    setOrcamentoAlcancado(null);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10}>
          <h1 style={{ marginBottom: "100px" }} className="text-center">
            Lista de Orçamentos
          </h1>

          <div className="mb-4">
            <h2 style={{ marginBottom: "50px" }}>Adicionar Orçamento</h2>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                adicionarOrcamento();
              }}
            >
              <Form.Group controlId="formNome">
                <Form.Label>Nome do Orçamento</Form.Label>
                <Form.Control
                  style={{ marginBottom: "30px" }}
                  type="text"
                  placeholder="Digite o nome do orçamento"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formValor">
                <Form.Label>Valor Necessário</Form.Label>
                <Form.Control
                  style={{ marginBottom: "30px" }}
                  type="number"
                  placeholder="Digite o valor necessário"
                  value={valorNecessario}
                  onChange={(e) => setValorNecessario(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formDataInicial">
                <Form.Label>Data Inicial</Form.Label>
                <Form.Control
                  style={{ marginBottom: "30px" }}
                  type="date"
                  value={dataInicial}
                  onChange={(e) => setDataInicial(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formDataFinal">
                <Form.Label>Data Final</Form.Label>
                <Form.Control
                  style={{ marginBottom: "30px" }}
                  type="date"
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formValorAtual">
                <Form.Label>Valor Atual</Form.Label>
                <Form.Control
                  style={{ marginBottom: "30px" }}
                  type="number"
                  placeholder="Digite o valor atual"
                  value={valorAtual}
                  onChange={(e) => setValorAtual(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Adicionar
              </Button>
            </Form>
          </div>

          <div>
            <h2 className="text-center mb-4">Orçamentos</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Valor Necessário</th>
                  <th>Data Inicial</th>
                  <th>Data Final</th>
                  <th>Valor Atual</th>
                  <th>Falta</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {orcamentos.map((orcamento, index) => (
                  <tr key={index}>
                    <td>{orcamento.nomeOrcamento}</td>
                    <td>{orcamento.valorNecessario}</td>
                    <td>{orcamento.dataInicial}</td>
                    <td>{orcamento.dataFinal}</td>
                    <td>{orcamento.valorAtual}</td>
                    <td>{orcamento.valorNecessario - orcamento.valorAtual}</td>
                    <td>
                      <Button
                        variant="warning"
                        onClick={() => abrirModalEdicao(orcamento)}
                      >
                        Editar
                      </Button>{" "}
                      <Button
                        variant="danger"
                        onClick={() => {
                          setOrcamentoParaExcluir(index);
                          setShowModal(true);
                        }}
                      >
                        Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Modal de confirmação de exclusão */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Exclusão</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Tem certeza que deseja excluir este orçamento?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmarExclusao}>
                Excluir
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de edit */}
          <Modal show={showEdit} onHide={() => setShowEdit(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Editar Orçamento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditarOrcamento}>
                <Form.Group controlId="formNome">
                  <Form.Label>Nome do Orçamento</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite o nome do orçamento"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formValor">
                  <Form.Label>Valor Necessário</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Digite o valor necessário"
                    value={valorNecessario}
                    onChange={(e) => setValorNecessario(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formDataInicial">
                  <Form.Label>Data Inicial</Form.Label>
                  <Form.Control
                    type="date"
                    value={dataInicial}
                    onChange={(e) => setDataInicial(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formDataFinal">
                  <Form.Label>Data Final</Form.Label>
                  <Form.Control
                    type="date"
                    value={dataFinal}
                    onChange={(e) => setDataFinal(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formValorAtual">
                  <Form.Label>Valor Atual</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Digite o valor atual"
                    value={valorAtual}
                    onChange={(e) => setValorAtual(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Salvar Alterações
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Modal de objetivo alcançado */}
          <Modal
            show={showObjetivoAlcancado}
            onHide={handleCloseObjetivoAlcancado}
          >
            <Modal.Header closeButton>
              <Modal.Title>Parabéns!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              O orçamento "{orcamentoAlcancado && orcamentoAlcancado.nome}" foi
              concluído com sucesso!
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleCloseObjetivoAlcancado}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default Orcamento;
