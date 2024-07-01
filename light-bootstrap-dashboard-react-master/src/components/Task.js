import React, { useState } from 'react';
import { Accordion, Button, Form, Container, Row, Col } from 'react-bootstrap';
import "../assets/css/app.css";

const TaskAccordion = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      const newTask = {
        task: taskInput,
        descricao: descricao // Salva a descrição junto com a tarefa
      };
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setDescricao(''); // Limpa o campo de descrição após adicionar a tarefa
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={8}>
          <Form.Group className="mb-3">
            <Form.Label>Nova Tarefa</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite sua tarefa"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <br/>
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              placeholder="Descrição da tarefa"
              value={descricao} // Corrigido: Usar a variável de estado 'descricao'
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddTask}>
            Adicionar Tarefa
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col xs={12} md={8} >
          <Accordion className="accordion-flush">
            {tasks.map((task, index) => (
              <Accordion.Item eventKey={index.toString()} key={index} className="custom-accordion-item">
                <Accordion.Header className="custom-accordion-header">{task.task}</Accordion.Header>
                <Accordion.Body className="custom-accordion-body">
                  <strong>Descrição: </strong>{task.descricao}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskAccordion;
