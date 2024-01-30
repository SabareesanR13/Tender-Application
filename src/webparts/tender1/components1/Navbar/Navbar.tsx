import * as React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <div className="NavBody">
      <Container className="NavBody-image">
        <img src={require("../../assets/Kamoa logo.png")} alt="Kamoa img" />
      </Container>

      <Container className="NavBody-menus">
        <nav>
          <ol>
            <li>
              <Link to="/Supplier">Home</Link>
            </li>
            <li>
              <Link to="/TenderDashboard">Tender-Quotation</Link>
            </li>
            <li>
              <Link to="/SupplierDashboard">Supplier-Dashboard</Link>
            </li>
          </ol>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;
