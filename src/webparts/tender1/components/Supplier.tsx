import * as React from "react";
// import { ITender1Props } from "./ITender1Props";
import "./Supplier.css";
import { Row, Col, Container, Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp/presets/all";
// import '@pnp/sp/webs';
// import '@pnp/sp/items';
// import "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/presets/all";
// import {
//   PeoplePicker,
//   PrincipalType,
// } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import { useLocation } from "react-router-dom";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface CallBackDialog {
  context: WebPartContext;
  updateDialog: (dialogVisible: boolean) => void;
  supplierDetails?: any;
  refreshParent: (render: boolean) => void;
}
// interface Item {
//   id: string; // adjust the type based on your actual data
//   // other properties if necessary
// }

const Supplier: React.FC<CallBackDialog> = ({
  context,
  updateDialog,
  supplierDetails,
  refreshParent,
}) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  // const [mobile, setMobile] = useState("");
  const [phone, setPhone] = useState("");
  // const [owner, setOwner] = useState("");
  // const [attach, setAttach] = useState(null);
  const [supplier, setSupplier] = useState("");
  const [email1, setEmail1] = useState("");

  console.log("Supplierdetails111", supplierDetails);

  useEffect(() => {
    // alert(JSON.stringify(supplierDetails));
    if (supplierDetails) {
      setTitle(supplierDetails?.TitleName || "");
      setCompany(supplierDetails.CompanyName || "");
      // setMobile(supplierDetails.MobileNumber || "");
      setPhone(supplierDetails.PhoneNumber || "");
      // setOwner(supplierDetails.OwnerName || "");
      setSupplier(supplierDetails.SupplierName || "");
      setEmail1(supplierDetails.EmailId1 || "");
    }
  }, [supplierDetails]);

  function resetForm() {
    setCompany("");
    setEmail1("");
    // setMobile("");
    // setOwner("");
    setPhone("");
    // setSelectedPeople({ User: [] as any });
    setSupplier("");
    setTitle("");
    // setAttach(null);
  }

  const handleTitle = (event: any) => {
    setTitle(event.target.value);
  };

  const handleCompany = (event: any) => {
    setCompany(event.target.value);
  };

  // const handleMobile = (event: any) => {
  //   setMobile(event.target.value);
  // };
  const handlePhone = (event: any) => {
    setPhone(event.target.value);
  };
  // const handleOwner = (event: any) => {
  //   setOwner(event.target.value);
  // };
  const handleSupplier = (event: any) => {
    setSupplier(event.target.value);
  };

  const handleEmail1 = (event: any) => {
    setEmail1(event.target.value);
  };

  const Cancel = () => {
    updateDialog(false);
  };

  const submit = async (event: any) => {
    event.preventDefault();

    let SupplierData = {
      TitleName: title,
      CompanyName: company,
      // MobileNumber: mobile,
      PhoneNumber: phone,
      // OwnerName: owner,
      SupplierName: supplier,
      EmailId1: email1,

      // PeoplePickerId: selectedPeople.User,
    };
    // alert("rrrrrrrrrrrrrrtttttttttttt");
    console.log("supplier", SupplierData);
    sp.setup({
      sp: {
        baseUrl: "https://altrocks1.sharepoint.com/sites/SamplePoint",
        // Authentication settings, if needed (e.g., using OAuth)
      },
    });

    const List = sp.web.lists.getByTitle("SupplierList");

    //     sp.web.lists.getByTitle('SupplierListAttach').items.add(SupplierData).then((result: any) => {
    //       console.log('Item added to SharePoint list:', result);

    //       const item: IItem = sp.web.lists.getByTitle('SupplierList').items.getById(result.data.ID);

    // // const buffer =  item.attachmentFiles.getByName("file.mp4").getBuffer();
    //       item.attachmentFiles.add(attach, "Image")

    //     }).catch((error: any) => {
    //       console.log('Error adding item to SharePoint list:', error);
    //     });

    // sp.web.lists.getByTitle('SupplierList').items.add(SupplierData).then((result: any) => {

    //   const ItemID = result.data.ID;
    //   const item: IItem = sp.web.lists.getByTitle("SupplierList").items.getById(ItemID);

    //   if (attach) {
    //     const fileReader = new FileReader();
    //     fileReader.onload = (event: any) => {
    //       const fileContent = event.target.result;
    //       item.attachmentFiles.add(attach['name'], fileContent).then(() => {

    //       }).catch((attachmentError: any) => {
    //         console.log("Error adding attachment: " + attachmentError);
    //       });
    //     };

    //     fileReader.readAsArrayBuffer(attach);
    //     alert("attached to db")
    //   }
    // }).catch((error: any) => {
    //   console.log("Error adding item: " + error);
    // });

    if (supplierDetails) {
      await List.items.getById(supplierDetails.ID).update(SupplierData);
      debugger;

      console.log("dataedited", SupplierData);
      // resetForm();
    } else {
      const ListData = List.items.add(SupplierData);

      const addListData = await ListData.then((result: any) => {
        const ItemID = result.data.ID;
        const item: IItem = sp.web.lists
          .getByTitle("SupplierList")
          .items.getById(ItemID);
        console.log(ItemID);
        debugger;
        console.log(item);

        alert("attached to db");

        resetForm();
      }).catch((error: any) => {
        console.log("Error adding item to SupplierList:", error);
      });

      console.log(addListData);
    }
    // resetForm();
    refreshParent(true);
    updateDialog(false);
  };

  return (
    <div
      className="body"
      style={{
        width: "50vw",
        display: "flex",
        margin: "auto",
      }}
    >
      <Card className="cardSupplier">
        <Form>
          <Container fluid style={{ paddingTop: "10px" }}>
            <Container className="section2">
              <Col className="section2-part1 sm={6}">
                <Row className="rowclass">
                  <Col sm={12}>
                    <label> Title</label>
                  </Col>
                  <Col sm={12}>
                    <input
                      value={title}
                      onChange={handleTitle}
                      autoComplete="On"
                      type="text"
                    />
                  </Col>
                </Row>

                <Row className="rowclass">
                  <Col sm={12}>
                    <label> Company/Org Name</label>
                  </Col>
                  <Col sm={12}>
                    <input
                      value={company}
                      onChange={handleCompany}
                      type="text"
                    />
                  </Col>
                </Row>

                {/* <Row className="rowclass">
                  <Col sm={12}>
                    <label>Mobile Number </label>
                  </Col>
                  <Col sm={12}>
                    <input
                      value={mobile}
                      onChange={handleMobile}
                      type="number"
                    />
                  </Col>
                </Row> */}

                <Row className="rowclass">
                  <Col sm={12}>
                    <label>Phone Number</label>
                  </Col>
                  <Col sm={12}>
                    <input value={phone} onChange={handlePhone} type="number" />
                  </Col>
                </Row>

                <Row className="rowclass-checkbox">
                  <Col sm={2}>
                    <input type="checkbox" />
                  </Col>
                  <Col sm={10}>
                    <p>I hereby declare above all items are true</p>
                  </Col>
                </Row>
              </Col>

              <Col className="section2-part2 sm={6}">
                {/* <Row className="rowclass">
                  <Col sm={12}>
                    <label>Tender Owner Name</label>
                  </Col>
                  <Col sm={12}>
                    <input value={owner} onChange={handleOwner} type="text" />
                  </Col>
                </Row> */}

                <Row className="rowclass">
                  <Col sm={12}>
                    <label>Name of the Supplier</label>
                  </Col>
                  <Col sm={12}>
                    <input
                      value={supplier}
                      onChange={handleSupplier}
                      type="text"
                    />
                  </Col>
                </Row>

                <Row className="rowclass">
                  <Col sm={12}>
                    <label>Email ID </label>
                  </Col>
                  <Col sm={12}>
                    <input
                      value={email1}
                      onChange={handleEmail1}
                      type="email"
                    />
                  </Col>
                </Row>

                {/* <Row className="rowclassPeople">
                  <Col sm={12}>
                    <label>People Picker</label>
                  </Col>
                  <Col sm={12}>
                    <PeoplePicker
                      context={context as any}
                      placeholder="Enter the name"
                      onChange={handlePicker}
                      personSelectionLimit={3}
                      styles={peoplePickerStyles}
                      ensureUser={true}
                      principalTypes={[PrincipalType.User]}
                      showtooltip={true}
                      disabled={false}
                    />
                  </Col>
                </Row> */}
                {/* <Row
                  className="rowclass"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Col sm={12}>
                    <label>Attachments of the Tender </label>{" "}
                  </Col>
                  <Col sm={12}>
                    <input
                      style={{ backgroundColor: "white" }}
                      type="file"
                      onChange={handleAttach}
                      multiple={true}
                    />
                  </Col>
                </Row> */}
              </Col>
            </Container>
          </Container>

          <Container className="btnsgrp">
            <Row>
              <Col className="btnsgrp-1">
                <button onClick={submit}>Submit</button>
              </Col>
              <Col className="btnsgrp-2" onClick={Cancel}>
                <button>Cancel</button>{" "}
              </Col>
            </Row>
          </Container>
        </Form>
      </Card>

      {/* <Footer Title="CopyRight @2023 AltrocksTech||All Rights Reserved" /> */}
    </div>
  );
};

export default Supplier;
