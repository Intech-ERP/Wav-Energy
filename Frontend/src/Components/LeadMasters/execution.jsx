import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Table from "../Common/Table";
import { useFetchData } from "../../Hooks/useFetchData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, TextField } from "@mui/material";
import {
  removeMasterData,
  updateMasterSortOrder,
} from "../../Services/leadMaster.service";
import { showError, showSuccess } from "../../Services/alert";
import DeleteModal from "../Common/Modal";
import { deleteCustomer } from "../../Services/customer.service";

const Execution = ({ tabValue, onEditData, refreshKey }) => {
  const { data, refetch, setData } = useFetchData(`${tabValue}`);
  const [editDispValue, setEditDispValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const permission = user?.menu?.find((item) => item.name === "Lead Master");
  const hasFullAccess = permission?.access === "full";

  const updateDisplayOrder = async (dispValue, row) => {
    try {
      const newValue = parseInt(dispValue, 10);
      const updateId = row.original.execution_id;
      const response = await updateMasterSortOrder(
        updateId,
        newValue,
        tabValue
      );

      if (response.success) {
        setData((prev) =>
          prev
            .map((item) =>
              item.execution_id === updateId
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
            item.execution_id === updateId
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
    setDeleteRow(row);
    setModalOpen(true);
  };

  const handleDeleteData = async () => {
    try {
      const response = await removeMasterData(
        deleteRow?.execution_id,
        tabValue
      );
      if (response?.success) {
        showSuccess("Data deleted successfully");
        refetch();
      }
    } catch (error) {
      showError("Failed to delete data");
      console.error("Error deleting Master data", error);
    }
  };

  useEffect(() => {
    setTableData(data.sort((a, b) => a.disp_order - b.disp_order));
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refreshKey]);

  const column = [
    { id: 1, accessorKey: "execution", header: "Execution" },
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

        console.table("rowId", rowId);

        console.table("displayValue");

        const handleChange = (e) => {
          const value = e.target.value;
          setEditDispValue((prev) => ({
            ...prev,
            [rowId]: value,
          }));
          console.log("dispValue", editDispValue);
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
  return (
    <Box>
      <Table columns={column} data={tableData} />
      <DeleteModal
        title={"Execution"}
        modalOpen={modalOpen}
        setModalOpen={() => setModalOpen((prev) => !prev)}
        handleDeleteData={handleDeleteData}
      />
    </Box>
  );
};

export default Execution;
