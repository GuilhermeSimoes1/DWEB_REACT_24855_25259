import React, { useState, useEffect } from "react";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";

function User() {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    userAutent: ""
  });

 
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const userFK = userData.userID;
    const useremail = userData.email;
    const userAutent = userData.userAutent;
    
    try {
      const response = await fetch(`https://localhost:7082/api/V1/Utilizadores?UserFK=${userFK}&oldEmail=${userData.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          UserName: user.userName,
          Email: user.email,
          FirstName: user.firstName,
          LastName: user.lastName,
          UserAutent: userAutent
        })
      });
  
      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
      } else {
        const errorData = await response.json(); // Captura detalhes do erro se disponíveis
        console.error("Erro ao atualizar perfil:", errorData);
        alert("Erro ao atualizar perfil. Verifique o console para mais detalhes.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Verifique o console para mais detalhes.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md="8">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Edit Profile</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col className="px-1" md="6">
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        name="userName"
                        value={user.userName}
                        placeholder="Username"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="px-1" md="6">
                    <Form.Group>
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        name="email"
                        value={user.email}
                        placeholder="Email"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="6">
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        name="firstName"
                        value={user.firstName}
                        placeholder="First Name"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="pl-1" md="6">
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        name="lastName"
                        value={user.lastName}
                        placeholder="Last Name"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button className="btn-fill pull-right" type="submit" variant="info">
                  Update Profile
                </Button>
                <div className="clearfix" />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default User;
