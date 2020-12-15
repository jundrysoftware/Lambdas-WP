import React from "react";
import { Navbar, Nav } from "emerald-ui/lib";

const navbar = ({ updateNav }) => {
  return (
    <Navbar breakAt="md" theme="dark">
      <Navbar.Brand>
        <a>
          <img src="" onClick={(evt) => updateNav(evt, 'home')} alt="Finances Site" />
        </a>
      </Navbar.Brand>
      <Nav>
        <a onClick={(evt) => updateNav(evt, 'datacredit')} href="#">Data Credito</a>
        <a onClick={(evt) => updateNav(evt, 'prepayment')} href="#">Pagos Pre Procesados</a>
        <a onClick={(evt) => updateNav(evt, 'graph')} href="#">Graphs</a>
      </Nav>
    </Navbar>
  );
};

export default navbar;
