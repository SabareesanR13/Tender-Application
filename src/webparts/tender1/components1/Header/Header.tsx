import * as React from "react";

import { Container } from "react-bootstrap";
import "./Header.css";

interface HeaderProps {
  Title: string;
}

const Header: React.FC<HeaderProps> = ({ Title }) => {
  return (
    <Container className="headerBody">
      <div className="header-heading">
        <h3>{Title}</h3>
      </div>
    </Container>
  );
};

export default Header;
