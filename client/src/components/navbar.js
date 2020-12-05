import React from "react";
import { Navbar, Nav } from "emerald-ui/lib";

const navbar = ({ updateNav }) => {
  return (
    <Navbar breakAt="md" theme="dark">
      <Navbar.Brand>
        <a href="#foo">
          <img src="" alt="Finances Site" />
        </a>
      </Navbar.Brand>
      <Nav>
        <a onClick={(evt)=>updateNav(evt, 'prepayment')} href="#foo">Pagos Pre Procesados</a>
        <a onClick={(evt)=>updateNav(evt, 'graph')} href="#foo">Graphs</a>
      </Nav>
    </Navbar>
  );
};

export default navbar;
