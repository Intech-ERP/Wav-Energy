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
import { removeLeads } from "../../Services/LeadGenerate.service";

export const Header = () => {
  const navigate = useNavigate();
  const handleLeadGenerate = () => {
    navigate("/generate-lead");
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
            Lead
          </Typography>
        </Breadcrumbs>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddCircleOutlinedIcon />}
          sx={{ borderRadius: 0, textTransform: "none" }}
          onClick={handleLeadGenerate}
        >
          Generate Lead
        </Button>
      </Box>
    </>
  );
};

const LeadForm = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const { data, error, refetch } = useFetchData("/leads");
  console.log("leads data", data);

  const navigate = useNavigate();

  const handleEditData = (row) => {
    navigate("/generate-lead", { state: { editData: row } });
  };
  const handleDelete = (row) => {
    setDeleteRow(row);
    setModalOpen(true);
  };

  const handleDeleteData = async () => {
    try {
      const response = await removeLeads(deleteRow.lead_id);
      if (response.success) {
        showSuccess("Lead Remove Successfully!");
        refetch();
      }
    } catch (error) {
      showError("Error Removing Lead");
      console.log("Error Removing Leads");
    }
  };
  const column = [
    { id: 1, accessorKey: "company_name", header: "Company Name" },
    { id: 2, accessorKey: "contact_person", header: "Contact Person" },
    { id: 3, accessorKey: "last_followup_date", header: "Last Followup Date" },
    { id: 4, accessorKey: "next_followup_date", header: "Next Followup Date" },
    { id: 5, accessorKey: "company_details", header: "Remarks" },
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
  ];
  return (
    <>
      <Header />
      <Box sx={{ mt: 2 }}>
        <Table columns={column} data={data} />
      </Box>
      <DeleteModal
        title={"Lead"}
        modalOpen={modalOpen}
        setModalOpen={() => setModalOpen((prev) => !prev)}
        handleDeleteData={handleDeleteData}
      />
    </>
  );
};

export default LeadForm;
