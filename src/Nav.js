import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

const Navigation = (props) => {

  return (
    <div>
      <Navbar color="light" expand="sm">
        <NavbarBrand href="/">Сашенька</NavbarBrand>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink href="/students/">Студенты</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/schedule/">Расписание</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
}

export default Navigation;
