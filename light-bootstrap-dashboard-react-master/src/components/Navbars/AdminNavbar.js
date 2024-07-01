/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import "../../assets/css/app.css";

import routes from "routes.js";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function Header() {
  const location = useLocation();
  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <Navbar bg="light" expand="lg" style={{display: "flex", justifyContent: "flex-end;", alignItems: "center", height: "70px"}}>
      <ul className= "navbar-nav ml-auto" >
        <li className="nav-item mt-2"><Link to="/user/dashboard">Home</Link></li>
        <li className="nav-item mt-2"><Link to="/">ola</Link></li>
        <li className="nav-item mt-2"><Link to="/ola">ola</Link></li>
        <li className="nav-item mt-2"><Link to="/ola">ola</Link></li>
        <li className="nav-item mt-2"><Link to="/ola">ola</Link></li>
      </ul>
    </Navbar>
  );
}

export default Header;
