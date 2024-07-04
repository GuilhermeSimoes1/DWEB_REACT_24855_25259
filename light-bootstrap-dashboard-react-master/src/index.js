import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "layouts/Admin.js";
import Hero from "views/Hero.js";
import Login from "views/Login.js";
import Signup from "views/Signup.js";
import { AccountProvider } from './components/AccountContext/AccountContext.js';
import Informacoes from "views/Informacoes.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AccountProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/hero" component={Hero} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/Informacoes" component={Informacoes} />
        <Route path="/user" render={(props) => <AdminLayout {...props} />} />
        <Redirect from="/" to="/hero" />
      </Switch>
    </BrowserRouter>
  </AccountProvider>
);
