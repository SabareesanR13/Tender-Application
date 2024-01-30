import * as React from "react";

import "./SupplierDashboard.css";
import { Card, Container } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { sp } from "@pnp/sp/presets/all";
import { Column } from "primereact/column";

import { useState, useEffect } from "react";
// import { InputText } from "primereact/inputtext";
// import { FilterMatchMode } from "primereact/api";
import { GrAdd } from "react-icons/gr";
// import { FiSearch } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
// import Header from "../components1/Header/Header";
// import Footer from "../components1/Footer/Footer";
import { Dialog } from "primereact/dialog";
import Supplier from "./Supplier";
// import { Button } from "primereact/button";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface SupplierDashboard {
  context: WebPartContext;
  updateDialog: (dialogVisible: boolean) => void;
  supplierDetails?: any;
  refreshParent: (render: boolean) => void;
  triggerEmail: (value: any) => void;
}

const SupplierDashboard: React.FC<SupplierDashboard> = ({
  context,
  triggerEmail,
}) => {
  const [dashBoard, setDashBoard] = useState([] as any);
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleNew = () => {
    setVisible(true);
  };

  const handleEdit = (rowData: any) => {
    // Add logic to handle edit action
    console.log("Edit row:", rowData.ID);
    console.log("Edit row:", rowData);
    setVisible(true);
    setSupplierDetails(rowData);
  };

  const updateDialog = (visible: boolean) => {
    setVisible(visible);
  };

  const handleDelete = (rowData: any) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      sp.setup({
        sp: {
          baseUrl: "https://altrocks1.sharepoint.com/sites/SamplePoint",
        },
      });

      const List = sp.web.lists.getByTitle("SupplierList");
      List.items
        .getById(rowData.ID)
        .delete()
        .then((result: any) => {
          setDashBoard((prevData: any[]) =>
            prevData.filter((item) => item.ID !== rowData.ID)
          );
          console.error("item deletd ", result);
        })
        .catch((error: any) => {
          console.error("Error deleting item:", error);
          alert("Error deleting item. Please try again.");
        });
    }
  };

  const columns = [
    { id: 1, field: "TitleName", header: "Title", sortable: true },
    {
      id: 2,
      field: "CompanyName",
      header: "Company/Org Name",
      sortable: true,
    },
    {
      id: 3,
      field: "SupplierName",
      header: "Name of the Supplier ",
      sortable: true,
    },
    {
      id: 4,
      field: "PhoneNumber",
      header: "Phone Number",
      sortable: false,
    },
    // {
    //   id: 5,
    //   field: "MobileNumber",
    //   header: "Supplier MobileNumber",
    //   sortable: false,
    // },
    // { id: 6, field: "OwnerName", header: "Name of the Owner", sortable: true },
    { id: 7, field: "EmailId1", header: "Email ID ", sortable: true },
  ];

  useEffect(() => {
    debugger;
    getSupplierList();
  }, [shouldRender]);
  console.log(dashBoard, "total Items");

  const getSupplierList = () => {
    sp.setup({
      sp: {
        baseUrl: "https://altrocks1.sharepoint.com/sites/SamplePoint",
        // Authentication settings, if needed (e.g., using OAuth)
      },
    });
    debugger;
    const getListItems = sp.web.lists.getByTitle("SupplierList").items.get();

    const fetchListItems = getListItems.then((items: any[]) => {
      // Process the list of items as needed
      console.log("List of items:", items);
      setDashBoard(items);
      console.log(items, "itemsLast");
    });

    // Handle errors if any
    fetchListItems.catch((error: any) => {
      console.error("Error fetching list items:", error);
    });
  };
  const actionTemplate = (rowData: any) => {
    return (
      <div>
        <div className="actions-icons">
          {/* Add your action icon here */}
          <i
            style={{ cursor: "pointer", marginRight: "0.5rem" }}
            onClick={() => handleEdit(rowData)}
          >
            <MdOutlineEdit />
          </i>
          <i
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(rowData)}
          >
            <MdDeleteOutline />
          </i>
        </div>
      </div>
    );
  };

  const onClickHandler = (e: any) => {
    setSelectedItems(e.value);

    const emails = e.value.map((element: any) => element.EmailId1);

    triggerEmail(emails);

    console.log("value", emails);
  };

  const refreshParent = () => {
    setShouldRender(!shouldRender);
  };

  return (
    <div className="body">
      <Container className="supplierBody">
        <div className="header">
          <h3>Supplier List</h3>
        </div>

        <div className="addButton">
          <button onClick={handleNew}>
            <i>
              <GrAdd />
            </i>
            Add Supplier
          </button>
        </div>

        <Dialog
          visible={visible}
          onHide={() => setVisible(false)}
          style={{
            width: "100vw",
            height: "100vw",
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            margin: 0,
          }}
        >
          <Supplier
            context={context}
            updateDialog={updateDialog}
            supplierDetails={supplierDetails}
            refreshParent={refreshParent}
          />
        </Dialog>
      </Container>

      <Container className="dashboardBody">
        <Card className="cardSupplierDashboard">
          <DataTable
            value={dashBoard}
            stripedRows
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "100rem" }}
            paginatorTemplate=" RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            scrollable
            scrollHeight="400px"
            selection={selectedItems}
            onSelectionChange={onClickHandler}
            removableSort
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            {columns.map((col, i) => (
              <Column
                key={col.id}
                field={col.field}
                header={col.header}
                sortable={col.sortable}
              />
            ))}
            <Column
              body={actionTemplate}
              style={{ textAlign: "center", width: "8em" }}
              header={<div className="actions-heading">Actions</div>}
            />
          </DataTable>
        </Card>
      </Container>
    </div>
  );
};

export default SupplierDashboard;
