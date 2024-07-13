import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "../../assets/css/app.css"; // Se houver estilos personalizados adicionados

import routes from "routes.js"; // Certifique-se de que o arquivo de rotas esteja corretamente importado
import { Link } from "react-router-dom"; // Importe corretamente o Link

function Header() {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData ? userData.userName : "Guest";

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/user/dashboard">Home</Nav.Link>
          <Nav.Link as={Link} to="/user/moeda">Moedas</Nav.Link>
          <Nav.Link as={Link} to="/user/orcamento">Orçamentos</Nav.Link>
          <Nav.Link as={Link} to="/user/historico">Histórico</Nav.Link>
          <Nav.Link as={Link} to="/user/contas">Contas</Nav.Link>
          <Nav.Link as={Link} to="/user/profile">Utilizadores</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Item className="nav-link">
            Hello, {userName}
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
