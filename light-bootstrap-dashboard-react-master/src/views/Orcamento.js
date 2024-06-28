import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Modal,
} from "react-bootstrap";

function Orcamento() {
  // Estado para armazenar a lista de orçamentos
  const [orcamentos, setOrcamentos] = useState([]);

  // Estado para armazenar os valores do formulário de edição
  const [editandoIndex, setEditandoIndex] = useState(-1);
  const [valorAtualEdit, setValorAtualEdit] = useState("");

  // Estado para armazenar os valores do formulário de adição
  const [nome, setNome] = useState("");
  const [valorNecessario, setValorNecessario] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [valorAtual, setValorAtual] = useState("");

  // Estado para controlar o modal de confirmação de exclusão
  const [showModal, setShowModal] = useState(false);
  const [orcamentoParaExcluir, setOrcamentoParaExcluir] = useState(null);

  // Estado para controlar o modal de objetivo alcançado
  const [showObjetivoAlcancado, setShowObjetivoAlcancado] = useState(false);
  const [orcamentoAlcancado, setOrcamentoAlcancado] = useState(null);

  // Função para adicionar um novo orçamento
  const adicionarOrcamento = () => {
    const novoOrcamento = {
      nome,
      valorNecessario: parseFloat(valorNecessario),
      dataInicial: new Date().toLocaleDateString(),
      dataFinal,
      valorAtual: parseFloat(valorAtual),
    };
    setOrcamentos([...orcamentos, novoOrcamento]);

    // Resetar os campos do formulário
    setNome("");
    setValorNecessario("");
    setDataFinal("");
    setValorAtual("");
  };

  // Função para editar um orçamento existente
  const editarOrcamento = (index) => {
    // Calcular o novo valor atual
    const novoValorAtual =
      orcamentos[index].valorAtual + parseFloat(valorAtualEdit);

    // Atualizar o valor atual do orçamento selecionado
    const orcamentosAtualizados = [...orcamentos];
    orcamentosAtualizados[index].valorAtual = novoValorAtual;
    setOrcamentos(orcamentosAtualizados);

    // Verificar se o objetivo foi alcançado
    if (novoValorAtual >= orcamentosAtualizados[index].valorNecessario) {
      setOrcamentoAlcancado(orcamentosAtualizados[index]);
      setShowObjetivoAlcancado(true);
    }

    // Parar de editar
    cancelarEdicao();
  };

  // Função para iniciar a edição de um orçamento
  const iniciarEdicao = (index) => {
    setEditandoIndex(index);
    setValorAtualEdit("");
  };

  // Função para cancelar a edição de um orçamento
  const cancelarEdicao = () => {
    setEditandoIndex(-1);
    setValorAtualEdit("");
  };

  // Função para abrir o modal de confirmação de exclusão
  const handleShowModal = (index) => {
    setOrcamentoParaExcluir(index);
    setShowModal(true);
  };

  // Função para fechar o modal de confirmação de exclusão
  const handleCloseModal = () => {
    setOrcamentoParaExcluir(null);
    setShowModal(false);
  };

  // Função para confirmar a exclusão do orçamento
  const confirmarExclusao = () => {
    if (orcamentoParaExcluir !== null) {
      const orcamentosAtualizados = [...orcamentos];
      orcamentosAtualizados.splice(orcamentoParaExcluir, 1);
      setOrcamentos(orcamentosAtualizados);
      handleCloseModal();
    }
  };

  // Função para fechar o modal de objetivo alcançado
  const handleCloseObjetivoAlcancado = () => {
    setShowObjetivoAlcancado(false);
    setOrcamentoAlcancado(null);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Lista de Orçamentos</h1>

          <div>
            <h2>Adicionar Orçamento</h2>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                adicionarOrcamento();
              }}
            >
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
                Adicionar
              </Button>
            </Form>
          </div>

          <div>
            <h2>Orçamentos</h2>
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
                    <td>{orcamento.nome}</td>
                    <td>{orcamento.valorNecessario}</td>
                    <td>{orcamento.dataInicial}</td>
                    <td>{orcamento.dataFinal}</td>
                    <td>
                      {editandoIndex === index ? (
                        <>
                          <div>Digite a quantia a ser adicionada:</div>
                          <Form.Control
                            type="number"
                            value={valorAtualEdit}
                            onChange={(e) => setValorAtualEdit(e.target.value)}
                          />
                        </>
                      ) : (
                        orcamento.valorAtual
                      )}
                    </td>
                    <td>{orcamento.valorNecessario - orcamento.valorAtual}</td>
                    <td>
                      {editandoIndex === index ? (
                        <>
                          <Button
                            variant="success"
                            onClick={() => editarOrcamento(index)}
                          >
                            Salvar
                          </Button>{" "}
                          <Button variant="secondary" onClick={cancelarEdicao}>
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="warning"
                            onClick={() => iniciarEdicao(index)}
                          >
                            Editar
                          </Button>{" "}
                          <Button
                            variant="danger"
                            onClick={() => handleShowModal(index)}
                          >
                            Excluir
                          </Button>
                        </>
                      )}
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
