import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../assets/css/Informacoes.css"; 
import "../assets/css/hero.css";  

function Informacoes() {
  return (
    <div className="juro">
    <Container className="informacoes-container">
      <Row>
        <Col className="informacoes">
          <h2>Informações do Projeto</h2>
          <p><strong>Curso:</strong> Licenciatura em Engenharia Informática</p>
          <p><strong>Disciplina:</strong> Desenvolvimento Web</p>
          <p><strong>Ano Letivo:</strong> 2023/2024</p>
          <p><strong>Autores:</strong></p>
          <ul>
            <li>Afonso Costa - Nº 24855</li>
            <li>Guilherme Simões - Nº 25259</li>
          </ul>
          <p><strong>Bibliotecas e Frameworks:</strong></p>
          <ul>
            <li>
              React - <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">https://reactjs.org/</a>
            </li>
            <li>
              React Bootstrap - <a href="https://react-bootstrap.github.io/" target="_blank" rel="noopener noreferrer">https://react-bootstrap.github.io/</a>
            </li>
            <li>
              Light Bootstrap Dashboard React Template - <a href="https://www.creative-tim.com/product/light-bootstrap-dashboard-react" target="_blank" rel="noopener noreferrer">https://www.creative-tim.com/product/light-bootstrap-dashboard-react</a>
              <br />
              Licensed under MIT - <a href="https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md" target="_blank" rel="noopener noreferrer">License</a>
            </li>
          </ul>
          <p>Estes recursos foram obtidos das suas respectivas documentações e repositórios oficiais.</p>
          <button className="btna" onClick={() => window.location.href = "/login"}>Login</button>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default Informacoes;
