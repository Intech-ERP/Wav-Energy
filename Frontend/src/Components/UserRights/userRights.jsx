import {
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import { Link } from "react-router-dom";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import Table from "../Common/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import UserForm from "./userForm";
import { useFetchData } from "../../Hooks/useFetchData";
import { removeUser } from "../../Services/user.service";
import DeleteModal from "../Common/Modal";

export const Header = ({ setUserRights }) => {
  const handleAddNewcustomer = () => {
    setUserRights();
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: "18px" }} />}
          aria-label="breadcrumb"
        >
          <Link
            component={RouterLink}
            // to="/generate-lead"
            sx={{
              color: "#0072BC",
              fontWeight: 400,
              textDecoration: "none",
              "&:hover": {
                textDecoration: "none",
              },
              "&:focus": {
                outline: "none",
              },
              "&:active": {
                textDecoration: "none",
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#0072BC",
                fontSize: "18px",
              }}
            >
              User rights
            </Typography>
          </Link>
        </Breadcrumbs>

        <Box>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 0, textTransform: "none" }}
            startIcon={<AddCircleOutlinedIcon />}
            onClick={handleAddNewcustomer}
          >
            Add user
          </Button>
        </Box>
      </Box>
    </>
  );
};

const UserRights = () => {
  const [userRights, setUserRights] = useState(false);
  const { data, error, refetch } = useFetchData("/user");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  const tableData = data.map((item) => ({
    ...item,
    rights: item?.rights?.map((rights) => rights.split(",").join(",")),
  }));

  const handleEditData = (row) => {
    setUserRights(true);
    setEditRow(row);
  };
  const handleDeleteData = (row) => {
    setModalOpen(true);
    setDeleteRow(row);
  };

  const handleRemoveData = async () => {
    const response = await removeUser(deleteRow?.user_id);
    if (response) {
      refetch();
    }
  };

  useEffect(() => {
    if (!userRights) {
      refetch();
    }
  }, [userRights]);

  const column = [
    { id: 1, accessorKey: "user", header: "User" },
    { id: 2, accessorKey: "emp_id", header: "Employee Id" },
    {
      id: 3,
      accessorKey: "rights",
      header: "Rights",
      Cell: ({ cell }) => {
        const value = cell.getValue();
        return Array.isArray(value) ? value?.map((r) => r).join(", ") : "";
      },
    },
    {
      id: 4,
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
            onClick={() => handleDeleteData(row.original)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <>
      <Header setUserRights={() => setUserRights((prev) => !prev)} />
      <Box sx={{ mt: 2 }}>
        <Table columns={column} data={data} />
      </Box>
      <UserForm
        openForm={userRights}
        onClose={() => {
          setUserRights(false);
          setEditRow(null);
        }}
        editRow={editRow}
      />
      <DeleteModal
        title={"User"}
        modalOpen={modalOpen}
        setModalOpen={() => setModalOpen((prev) => !prev)}
        handleDeleteData={handleRemoveData}
      />
    </>
  );
};

export default UserRights;
