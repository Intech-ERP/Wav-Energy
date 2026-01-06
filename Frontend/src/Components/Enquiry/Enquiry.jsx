import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  Grid,
  IconButton,
  Modal,
  // Table,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Table from "../Common/Table";
import { useNavigate } from "react-router-dom";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFetchData } from "../../Hooks/useFetchData";
import DeleteModal from "../Common/Modal";
import { showError, showSuccess } from "../../Services/alert";
import { removeEnquiry } from "../../Services/EnquiryGenerate.service";

export const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const permission = user?.menu?.find((item) => item.name === "Enquiry");
  const hasFullAccess = permission?.access === "full";

  const handleEnquiryGenerate = () => {
    navigate("/generate-enquiry");
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
            Enquiry
          </Typography>
        </Breadcrumbs>

        {hasFullAccess && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddCircleOutlinedIcon />}
            sx={{ borderRadius: 0, textTransform: "none" }}
            onClick={handleEnquiryGenerate}
          >
            Generate Enquiry
          </Button>
        )}
      </Box>
    </>
  );
};

const Enquiry = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const { data, error, refetch } = useFetchData("/enquiries");
  const user = JSON.parse(localStorage.getItem("user"));

  const permission = user?.menu?.find((item) => item.name === "Enquiry");
  const hasFullAccess = permission?.access === "full";

  const navigate = useNavigate();

  const handleEditData = (row) => {
    navigate("/generate-enquiry", { state: { editData: row } });
  };
  const handleDelete = (row) => {
    setDeleteRow(row);
    setModalOpen(true);
  };

  const handleDeleteData = async () => {
    try {
      const response = await removeEnquiry(deleteRow.enquiry_id);
      if (response.success) {
        showSuccess("Enquiry Remove Successfully!");
        refetch();
      }
    } catch (error) {
      showError("Error Removing Enquiry");
      console.log("Error Removing Enquiry");
    }
  };
  const column = [
    { id: 1, accessorKey: "company_name", header: "Company Name" },
    { id: 2, accessorKey: "contact_person", header: "Contact Person" },
    { id: 3, accessorKey: "last_followup_date", header: "Last Followup Date" },
    { id: 4, accessorKey: "next_followup_date", header: "Next Followup Date" },
    { id: 5, accessorKey: "company_details", header: "Remarks" },
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
      </Box>
      <DeleteModal
        title={"Enquiry"}
        modalOpen={modalOpen}
        setModalOpen={() => setModalOpen((prev) => !prev)}
        handleDeleteData={handleDeleteData}
      />
    </>
  );
};

export default Enquiry;
