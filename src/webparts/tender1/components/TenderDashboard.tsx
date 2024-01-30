import * as React from "react";
// import { ITender1Props } from "./ITender1Props";
import "./TenderDashboard.css";
import { Card, Container } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import Header from "../components1/Header/Header";
import Footer from "../components1/Footer/Footer";
import { FiSearch } from "react-icons/fi";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { GrAdd } from "react-icons/gr";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp/presets/all";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { FilterMatchMode } from "primereact/api";
import { useNavigate } from "react-router-dom";

const TenderDashboard: React.FC = () => {
  const [dashBoard, setDashBoard] = useState([] as any);

  const [filter, setFilter] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const columns = [
    { id: 1, field: "Sow", header: "Scope of work", sortable: true },
    {
      id: 2,
      field: "OwnerName",
      header: "Name of the Owner",
      sortable: true,
    },
    {
      id: 3,
      field: "Email",
      header: "Email ",
      sortable: false,
    },
    {
      id: 4,
      field: "StartDate",
      header: "StartDate",
      sortable: false,
    },
    {
      id: 5,
      field: "EndDate",
      header: "EndDate ",
      sortable: false,
    },
    { id: 6, field: "TenderType", header: "Type of Tender", sortable: true },
    { id: 7, field: "FilesNames", header: "Attachments", sortable: false },
  ];

  const getAttachments = async (itemId: number) => {
    try {
      const response = await sp.web.lists
        .getByTitle("TenderList")
        .items.getById(itemId)
        .attachmentFiles.get();
      console.log("response", response);
      return response.map((attachment: any) => ({
        FileName: attachment.FileName,
        ServerRelativePath: attachment.ServerRelativePath,
      }));
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };
  console.log("attachments", getAttachments);

  useEffect(() => {
    getTenderDashboard();
  }, []);

  const getTenderDashboard = () => {
    sp.setup({
      sp: {
        baseUrl: "https://altrocks1.sharepoint.com/sites/SamplePoint",
        // Authentication settings, if needed (e.g., using OAuth)
      },
    });

    const getListItems = sp.web.lists.getByTitle("TenderList").items.get();

    console.log("List", getListItems);

    const fetchListItems = getListItems.then(async (items: any[]) => {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          const itemId = item.ID;
          const attachmentFiles = await getAttachments(itemId);
          var fileNames = "";
          attachmentFiles?.forEach((item) => {
            fileNames = fileNames + item.FileName + ",";
          });

          // Assuming you want to associate attachments with each item
          return {
            ...item,
            Attachments: attachmentFiles,
            FilesNames: fileNames,
          };
        })
      );

      setDashBoard(updatedItems);
      alert("welcome ");
    });

    fetchListItems.catch((error: any) => {
      console.error("Error fetching list items:", error);
    });
  };

  const navigate = useNavigate();

  const handleNewForm = () => {
    navigate("/Tender1");
  };

  const handleFilter = (event: any) => {
    setFilter({
      global: {
        value: event.target.value,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
  };

  const editNavigate = useNavigate();

  const handleEdit = (rowData: any) => {
    console.log("Edit row:", rowData.ID);
    console.log("Edit row:", rowData);

    editNavigate("/Tender1", {
      state: {
        tenderDetails: rowData || null,
      },
    });
  };

  const handleDelete = (rowData: any) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      sp.setup({
        sp: {
          baseUrl: "https://altrocks1.sharepoint.com/sites/SamplePoint",
        },
      });

      const List = sp.web.lists.getByTitle("TenderList");
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

  return (
    <div className="body">
      <Header Title="Tender Dashboard" />

      <Container className="searchBody">
        <div className="p-input-icon-left">
          <i>
            <FiSearch />
          </i>
          <InputText onInput={handleFilter} />
        </div>

        <div className="searchButton">
          <button onClick={handleNewForm}>
            <i>
              <GrAdd />
            </i>
            Add Tender
          </button>
        </div>
      </Container>

      <Container className="dashboardBody">
        <Card className="cardDashboard">
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
            // sortMode='multiple'
            removableSort
            filters={filter}
            selectionMode="single"
          >
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
            <Column />
          </DataTable>
        </Card>
      </Container>

      <Footer Title="CopyRight @2023 AltrocksTech||All Rights Reserved" />
    </div>
  );
};

export default TenderDashboard;
