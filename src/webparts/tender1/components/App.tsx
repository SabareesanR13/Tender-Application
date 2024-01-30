import * as React from "react";
// import { ITender1Props } from "./ITender1Props";
import { Route, Routes, HashRouter } from "react-router-dom";
import SupplierDashboard from "./SupplierDashboard";
// import Supplier from "./Supplier";
import "./App.css";
import Tender1 from "./Tender1";

// import Header from '../components1/Header/Header';
// import Footer from '../components1/Footer/Footer'
import Navbar from "../components1/Navbar/Navbar";
import { Container, Row, Col, Card } from "react-bootstrap";
import Welcome from "./Welcome";
import TenderDashboard from "./TenderDashboard";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface AppProps {
  context: WebPartContext;
  updateDialog: (dialogVisible: boolean) => void;
  refreshParent: (render: boolean) => void;
  triggerEmail: (value: any) => void;
  // description: string;
  // webURL: string;
}
const App: React.FC<AppProps> = ({
  context,
  updateDialog,
  refreshParent,
  triggerEmail,
}) => {
  return (
    <div className="App">
      <HashRouter>
        <Container fluid className="app-components">
          <Row>
            <Col sm={2} md={2}>
              <Navbar />
            </Col>

            <Col
              sm={10}
              md={10}
              style={{ backgroundColor: "#f2f2f2", padding: "0" }}
            >
              <Card className="cardApp">
                {/* <Header Title="Welcome "/> */}
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route
                    path="/Tender1"
                    element={
                      <Tender1
                        context={context}
                        updateDialog={updateDialog}
                        refreshParent={refreshParent}
                      />
                    }
                  />
                  <Route
                    path="/TenderDashboard"
                    element={<TenderDashboard />}
                  />
                  {/* <Route path="/Supplier" element={<Supplier {...props} />} /> */}
                  <Route
                    path="/SupplierDashboard"
                    element={
                      <SupplierDashboard
                        context={context}
                        triggerEmail={triggerEmail}
                        updateDialog={updateDialog}
                        refreshParent={refreshParent}
                      />
                    }
                  />
                </Routes>
              </Card>
            </Col>
          </Row>
        </Container>
      </HashRouter>
    </div>
  );
};

export default App;
