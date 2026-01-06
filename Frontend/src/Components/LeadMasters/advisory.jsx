import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Table from "../Common/Table";
import { useFetchData } from "../../Hooks/useFetchData";
import { formatDate } from "../Lead/Lead";
import { Button, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  removeMasterData,
  updateMasterSortOrder,
} from "../../Services/leadMaster.service";
import { showError, showSuccess } from "../../Services/alert";
import LeadMasterForm from "./leadMasterForm";
import DeleteModal from "../Common/Modal";

const Advisory = ({ tabValue, refreshKey, onEditData }) => {
  const [editDispValue, setEditDispValue] = useState({});
  const { data, setData, refetch } = useFetchData(`/${tabValue}`);
  const [tableData, setTableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const permission = user?.menu?.find((item) => item.name === "Lead Master");
  const hasFullAccess = permission?.access === "full";

  const updateDisplayOrder = async (dispValue, row) => {
    try {
      const newValue = parseInt(dispValue, 10);
      const updateId = row.original.advisory_id;
      const response = await updateMasterSortOrder(
        updateId,
        newValue,
        tabValue
      );

      if (response.success) {
        setData((prev) =>
          prev
            .map((item) =>
              item.advisory_id === updateId
                ? { ...item, disp_order: newValue }
                : item
            )
            .sort((a, b) => a.disp_order - b.disp_order)
        );
        refetch();
      } else {
        showError(response.message);
        setData((prev) =>
          prev.map((item) =>
            item.advisory_id === updateId
              ? { ...item, disp_order: response.resetOrder ?? item.disp_order }
              : item
          )
        );
      }
      setEditDispValue((prev) => {
        const copy = { ...prev };
        delete copy[row.index];
        return copy;
      });
    } catch (error) {
      console.error("Error Updating display order", error);
      setEditDispValue((prev) => {
        const copy = { ...prev };
        delete copy[row.index];
        return copy;
      });
    }
  };

  const handleEditData = (row) => {
    onEditData(row);
  };

  const handleDelete = (row) => {
    setModalOpen(true);
    setDeleteRow(row);
  };

  const handleDeleteData = async () => {
    try {
      const response = await removeMasterData(deleteRow?.advisory_id, tabValue);
      if (response?.success) {
        showSuccess("Data deleted successfully");
        refetch();
      }
    } catch (error) {
      showError("Failed to delete data");
      console.error("Error deleting Master data", error);
    }
  };

  const column = [
    { id: 1, accessorKey: "advisory", header: "Advisory" },
    {
      id: 2,
      accessorKey: "display_order",
      header: "Display Order",
      enableGlobalFilter: true,
      Cell: ({ row }) => {
        if (!hasFullAccess) {
          return row.original.disp_order ?? "";
        }

        const rowId = row.index;
        const tableValue = row.original.disp_order ?? 0;
        const displayValue = editDispValue[rowId] ?? tableValue;

        const handleChange = (e) => {
          const value = e.target.value;
          setEditDispValue((prev) => ({
            ...prev,
            [rowId]: value,
          }));
        };

        const handleBlur = () => {
          if (String(displayValue) !== String(tableValue)) {
            updateDisplayOrder(displayValue, row);
          }
        };

        return (
          <TextField
            sx={{ width: "70px" }}
            variant="outlined"
            type="number"
            size="small"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        );
      },
    },
    { id: 3, accessorKey: "created_date", header: "Created Date" },
    { id: 4, accessorKey: "updated_date", header: "Modified Date" },
    ...(hasFullAccess
      ? [
          {
            id: 5,
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

  useEffect(() => {
    setTableData(data.sort((a, b) => a.disp_order - b.disp_order));
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refreshKey]);

  return (
    <>
      <Box>
        <Table columns={column} data={tableData} />
        <DeleteModal
          title={"Advisory"}
          modalOpen={modalOpen}
          setModalOpen={() => setModalOpen((prev) => !prev)}
          handleDeleteData={handleDeleteData}
        />
      </Box>
    </>
  );
};

export default Advisory;
