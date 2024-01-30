import * as React from "react";

import "./Tender1.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Container, Form, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp/presets/all";
// import '@pnp/sp/webs';
// import '@pnp/sp/items';
// import "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/presets/all";
import Header from "../components1/Header/Header";
import Footer from "../components1/Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";

// import { FileUpload } from "primereact/fileupload";
import SupplierDashboard from "./SupplierDashboard";

// import PeoplePicker from './PeoplePicker';
// import { spfi } from "@pnp/sp";
// import { IAttachmentInfo } from "@pnp/sp/attachments";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface Item {
  name: string;
  fileContent: ArrayBuffer;
}

interface Tender1 {
  context: WebPartContext;
  updateDialog: (dialogVisible: boolean) => void;
  // supplierDetails?: any;
  refreshParent: (render: boolean) => void;
}
const Tender1: React.FC<Tender1> = ({
  context,
  updateDialog,
  refreshParent,
}) => {
  const [sow, setSow] = useState("");
  const [visibleSow, SetVisibleSow] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [visibleStartDate, setVisibleStartDate] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [attach, setAttach] = useState<Item[]>([] as any);
  const [tenderType, setTenderType] = useState("select");
  const [emailDashboard, setEmailDashboard] = useState();

  const handleChangeSow = (event: any) => {
    setSow(event.target.value);
    SetVisibleSow(false);
  };

  const handleChangeStartDate = (event: any) => {
    setStartDate(event.target.value);
    setVisibleStartDate(false);
  };

  const handleChangeEndDate = (event: any) => {
    setEndDate(event.target.value);
  };

  const handleOwnerName = (event: any) => {
    setOwnerName(event.target.value);
  };

  const handleEmail = (event: any) => {
    setEmail(event.target.value);
  };

  console.log(attach);
  const handleAttach = (event: any) => {
    console.log("attach", event.target.files);

    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      const files = fileInput.files;
      const newAttachments: Item[] = [];

      console.log("filesstttdd", files);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log("filessss", file);

        const fileReader = new FileReader();
        fileReader.onload = async (event: any) => {
          const fileContent = event.target.result;
          console.log("filecontent", fileContent);

          newAttachments.push({
            name: file["name"],
            fileContent: fileContent,
          });
        };

        fileReader.readAsArrayBuffer(file);
      }
      setAttach(newAttachments);
      console.log("new", newAttachments);
    }
  };
  console.log("attach", attach);

  const handleChangeSelect = (event: any) => {
    setTenderType(event.target.value);
    console.log(event.target.value);
  };

  const location = useLocation();

  // alert(JSON.stringify(location.state.tenderDetails))

  const tenderDetails = location.state?.tenderDetails || null;
  console.log("Tenderdetails", tenderDetails);

  useEffect(() => {
    if (tenderDetails) {
      // setAttach(tenderDetails.Attachments || "");
      setAttach(tenderDetails.Attachments || null);
      setEmail(tenderDetails.Email || "");
      setOwnerName(tenderDetails.OwnerName || "");
      setSow(tenderDetails.Sow || "");
      setStartDate(tenderDetails.StartDate || "");
      setEndDate(tenderDetails.EndDate || "");
      setTenderType(tenderDetails.TenderType || "");
    }
  }, [tenderDetails]);

  const previousDashboard = useNavigate();

  const cancel = () => {
    previousDashboard("/TenderDashboard");
  };

  const triggerEmail = (value: any) => {
    setEmailDashboard(value);
    console.log("Hi", value);
  };
  console.log(emailDashboard);

  const submit = async (event: any) => {
    event.preventDefault();

    if (sow === "") {
      SetVisibleSow(true);
      return;
    }

    let obj = {
      Sow: sow,
      Title: "",
      OwnerName: ownerName,
      Email: email,
      StartDate: startDate,
      EndDate: endDate,
      TenderType: tenderType,
      Supplier: `${
        Array.isArray(emailDashboard)
          ? (emailDashboard as string[]).join(";")
          : ""
      }`,
    };

    console.log(obj, "objj");

    sp.setup({
      sp: {
        baseUrl: "https://altrocks1.sharepoint.com/sites/SamplePoint",
      },
    });

    const List = sp.web.lists.getByTitle("TenderList");

    if (tenderDetails) {
      var result = await List.items.getById(tenderDetails.ID).update(obj);
      if (result) {
        console.log("updateeeeeeeeeeeeeeeeeeee", result);
        alert("Attachmet updated successful");
        previousDashboard("/TenderDashboard");
      }
    } else {
      const ListData = List.items
        .add(obj)
        .then((result: any) => {
          const ItemID = result.data.ID;
          const item: IItem = sp.web.lists
            .getByTitle("TenderList")
            .items.getById(ItemID);
          if (attach.length > 0) {
            (async () => {
              try {
                const promises = attach.map(async (attachment) => {
                  await item.attachmentFiles.add(
                    attachment.name,
                    attachment.fileContent
                  );
                });
                debugger;
                console.log(attach, "promisesattach");
                console.log("promise", promises);
                // alert("Attachmet added successful");
                // previousDashboard("/TenderDashboard");
                await Promise.all(promises).then(() => {
                  const attachmentsLibrary =
                    sp.web.lists.getByTitle("TenderListAttach");
                  const folderName = ItemID.toString();
                  debugger;
                  attachmentsLibrary.rootFolder.folders
                    .add(folderName)
                    .then((folderResult) => {
                      const folderUrl = folderResult.data.ServerRelativeUrl;
                      console.log(folderResult, "folderrrr");
                      const additionalPromises = attach.map(
                        async (attachment) => {
                          await attachmentsLibrary.rootFolder.files.add(
                            `${folderUrl}/${attachment.name}`,
                            attachment.fileContent
                          );
                          debugger;
                          await Promise.all(additionalPromises);
                        }
                      );
                    });
                });
                alert("Attachmet added successful");
                previousDashboard("/TenderDashboard");
              } catch (error) {
                console.log("Error adding attachments:", error);
              }
            })();
          }
        })
        .catch((error: any) => {
          console.log("Error adding item: " + error);
        });
      console.log(ListData);
    }

    // previousDashboard("/TenderDashboard");
  };

  return (
    <div className="body">
      <Header Title="Tender-Application" />

      <Card className="cardTender">
        <Form>
          <Container style={{ paddingTop: "10px" }}>
            <Container className="section1">
              <Row>
                <Col sm={5}>
                  <label>Create the tender with respect to SOW</label>
                </Col>
                <Col sm={7}>
                  <textarea
                    // type="text"
                    style={{ width: "100%" }}
                    onChange={handleChangeSow}
                    value={sow}
                  />
                  {visibleSow && <span style={{ color: "red" }}>Error* </span>}
                </Col>
              </Row>
            </Container>

            <Container className="section2">
              <Col className="section2-part1 sm={6}">
                <Row className="rowClass">
                  <Col sm={6}>
                    <label>Tender Start Date</label>
                  </Col>
                  <Col sm={6}>
                    <input
                      type="date"
                      onChange={handleChangeStartDate}
                      value={startDate}
                    />
                    {visibleStartDate && (
                      <span style={{ color: "red" }}>Error* </span>
                    )}
                  </Col>
                </Row>

                <Row className="rowClass">
                  <Col sm={6}>
                    <label>Tender Type</label>
                  </Col>
                  <Col sm={6}>
                    <select onChange={handleChangeSelect} value={tenderType}>
                      <option>--Select--</option>
                      <option>Contract for sand</option>
                      <option>Contract for Bricks</option>
                      <option>Contract for machinery</option>
                    </select>
                  </Col>
                </Row>

                <Row className="rowClass">
                  <Col sm={6}>
                    <label>Tender End Date</label>
                  </Col>
                  <Col sm={6}>
                    <input
                      type="date"
                      onChange={handleChangeEndDate}
                      value={endDate}
                    />
                  </Col>
                </Row>
                {/* 
                <Row className="rowClass">
                  <Col sm={3}>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider round"></span>
                    </label>
                  </Col>
                  <Col sm={9}>
                    <p>Notify all the suppliers about the tender </p>
                  </Col>
                </Row> */}
              </Col>

              <Col className="section2-part2 sm={6}" style={{ width: "100%" }}>
                <Row className="rowClass">
                  <Col sm={6}>
                    <label>Tender Owner Name</label>
                  </Col>
                  <Col sm={6}>
                    <input
                      type="text"
                      onChange={handleOwnerName}
                      value={ownerName}
                    />
                  </Col>
                </Row>

                <Row className="rowClass">
                  <Col sm={6}>
                    <label>Email ID</label>
                  </Col>
                  <Col sm={6}>
                    <input type="email" onChange={handleEmail} value={email} />
                  </Col>
                </Row>

                <Row className="rowClass">
                  <Col sm={6}>
                    <label>Attachments of the Tender</label>
                  </Col>

                  <Col sm={6}>
                    <input
                      style={{ backgroundColor: "white" }}
                      type="file"
                      onChange={handleAttach}
                      multiple={true}
                    />
                  </Col>

                  {/* <Col className="sample">
                    <FileUpload
                      multiple
                      maxFileSize={1000000}
                      chooseLabel="attachment"
                      emptyTemplate={
                        <p className="m-0">
                          Drag and drop files to here to upload.
                        </p>
                      }
                    />
                  </Col> */}
                </Row>
              </Col>
            </Container>
          </Container>
        </Form>
      </Card>
      <Container>
        <SupplierDashboard
          context={context}
          triggerEmail={triggerEmail}
          updateDialog={updateDialog}
          refreshParent={refreshParent}
        />
      </Container>

      <Container className="btnsgrp">
        <Row>
          <Col className="btnsgrp-1">
            <button onClick={cancel}>Cancel</button>
          </Col>
          <Col className="btnsgrp-2">
            <button onClick={submit}>Submit</button>
          </Col>
        </Row>
      </Container>

      <Footer Title="CopyRight @2023 AltrocksTech||All Rights Reserved" />
    </div>
  );
};

export default Tender1;
