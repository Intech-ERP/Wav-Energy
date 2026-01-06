import React, { useState } from "react";
import { Badge, Box, Button, IconButton, Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "../Common/Table";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../Hooks/useFetchData";
import DeleteModal from "../Common/Modal";
import { showError, showSuccess } from "../../Services/alert";
import { deleteCustomer } from "../../Services/customer.service";

export const Header = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const permission = user?.menu?.find((item) => item.name === "Address Book");
  const hasFullAccess = permission?.access === "full";

  const handleNewCustomer = () => {
    navigate("/customer");
  };
  return (
    <>
      <Box
        sx={{
          // mb: 4,
          // mt: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            variant="h6"
            sx={{
              color: "#0072BC",
              fontSize: "18px",
            }}
          >
            Addressbook
          </Typography>
        </Breadcrumbs>

        {hasFullAccess && (
          <Box>
            <Button
              variant="contained"
              size="small"
              sx={{ borderRadius: 0, textTransform: "none" }}
              startIcon={<AddCircleOutlinedIcon />}
              onClick={handleNewCustomer}
            >
              New Customer
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

const Addressbook = () => {
  const { data, error, loading, refetch } = useFetchData("/customers");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const permission = user?.menu?.find((item) => item.name === "Address Book");
  const hasFullAccess = permission?.access === "full";

  const navigate = useNavigate();

  const handleEditData = (row) => {
    navigate("/customer", { state: { editData: row } });
  };

  const handleDelete = (row) => {
    setDeleteRow(row);
    setModalOpen(true);
  };

  const handleDeleteData = async () => {
    try {
      const response = await deleteCustomer(deleteRow?.company_id);
      if (response?.success) {
        showSuccess("Customer deleted successfully");
        refetch();
      }
    } catch (error) {
      showError("Failed to delete customer");
      console.error("Error deleting customer", error);
    }
  };
  const column = [
    { id: 1, accessorKey: "company_name", header: "Customer Name" },
    { id: 2, accessorKey: "alias_name", header: "Alias Name" },
    { id: 3, accessorKey: "pincode", header: "Pincode" },
    { id: 4, accessorKey: "created_date", header: "Created Date" },
    { id: 5, accessorKey: "updated_date", header: "Modified Date" },
    ...(hasFullAccess
      ? [
          {
            id: 6,
            accessorKey: "action",
            header: "Action",
            Cell: ({ row }) => (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleEditData(row.original)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(row.original)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Header />
      <Box sx={{ mt: 2 }}>
        <Table columns={column} data={data} />
        {modalOpen && (
          <DeleteModal
            title={"Customer"}
            modalOpen={modalOpen}
            setModalOpen={() => setModalOpen((prev) => !prev)}
            handleDeleteData={handleDeleteData}
          />
        )}
      </Box>
    </>
  );
};

export default Addressbook;
