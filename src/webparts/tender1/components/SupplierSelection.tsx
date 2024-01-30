import * as React from "react";
import "./welcome.css";
import { Row, Col, Container, Card } from "react-bootstrap";
// import SupplierDashboard from "./SupplierDashboard";

const SupplierSelection: React.FC = () => {
  return (
    <div className="body">
      <Container>
        <Card>
          <Row>
            <Col sm={12}></Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default SupplierSelection;
