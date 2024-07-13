import React, { useState, useEffect } from "react";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import "../assets/css/user.css";

const url = "https://dwebnet20240712221837.azurewebsites.net/api/v1";

function User() {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    firstName: "",
    lastName: "",
    userAutent: ""
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser({
        userName: userData.userName,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userAutent: userData.userAutent
      });
    }
  }, []);

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
    if (!userData) {
      alert("User data not found in local storage.");
      return;
    }

    const userFK = userData.userID;
    const oldEmail = userData.email;
    
    try {
      const response = await fetch(`${url}/Utilizadores?UserFK=${userFK}&oldEmail=${oldEmail}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          UserName: user.userName,
          Email: user.email,
          FirstName: user.firstName,
          LastName: user.lastName,
          UserAutent: user.userAutent
        })
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify({
          userName: user.userName,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userAutent: user.userAutent,
          userID: userFK
        }));
      } else {
        const errorData = await response.json();
        alert("Error updating profile. Check the console for more details.");
      }
    } catch (error) {
      alert("Error updating profile. Check the console for more details.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md="11">
          <Card>
            <Card.Header>
              <Card.Title as="h4">Editar Perfil</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col className="px-1" md="6">
                    <Form.Group>
                      <strong><label>Nome de Utilizador</label></strong>
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
                      <Form.Label>Email</Form.Label>
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
                      <Form.Label>Nome</Form.Label>
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
                      <Form.Label>Apelido</Form.Label>
                      <Form.Control
                        name="lastName"
                        value={user.lastName}
                        placeholder="Last Name"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button className="btn-fix" type="submit" variant="info">
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
