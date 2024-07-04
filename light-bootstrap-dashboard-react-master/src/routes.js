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
import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import Moeda from "views/Moedas.js";
import Historico from "views/Historico.js"
import Orcamento from "views/Orcamento.js";
import Contas from "views/Contas.js";
import Informacoes from "views/Informacoes.js"


//os icons são do now ui icons

const dashboardRoutes = [
 
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/user" 
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/user"
  },
  {
    path: "/moeda",
    name: "Moeda",
    icon: "nc-icon nc-money-coins",
    component: Moeda,
    layout: "/user"
  },
  {
    path: "/historico",
    name: "Histórico",
    icon: "nc-icon nc-single-copy-04",
    component: Historico,
    layout: "/user"
  },
 
  {
    path: "/orcamento",
    name: "Orçamentos",
    icon: "nc-icon nc-bullet-list-67",
    component: Orcamento,
    layout: "/user"
  },

  {
    path: "/contas",
    name: "Contas",
    icon: "nc-icon nc-bank",
    component: Contas,
    layout: "/user"
  },



];

export default dashboardRoutes;
