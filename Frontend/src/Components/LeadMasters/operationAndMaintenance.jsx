import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Table from "../Common/Table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, TextField } from "@mui/material";
import { useFetchData } from "../../Hooks/useFetchData";
import { removeMasterData, updateMasterSortOrder } from "../../Services/leadMaster.service";
import { showError, showSuccess } from "../../Services/alert";
import DeleteModal from "../Common/Modal";

const OperationAndMaintenance = ({ tabValue, onEditData, refreshKey }) => {
  const { data, refetch, setData } = useFetchData(`${tabValue}`);
  const [editDispValue, setEditDispValue] = useState({});
  const [tableData, setTableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState([]);

  const updateDisplayOrder = async (dispValue, row) => {
    try {
      const newValue = parseInt(dispValue, 10);
      const updateId = row.original.operation_id;
      const response = await updateMasterSortOrder(
        updateId,
        newValue,
        tabValue
      );

      if (response.success) {
        setData((prev) =>
          prev
            .map((item) =>
              item.operation_id === updateId
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
            item.operation_id === updateId
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
      const response = await removeMasterData(deleteRow?.operation_id, tabValue);
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
    { id: 1, accessorKey: "operation", header: "Operation & Maintenance" },
    {
      id: 2,
      accessorKey: "display_order",
      header: "Display Order",
      enableGlobalFilter: true,
      Cell: ({ row }) => {
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
  ];
  useEffect(() => {
    setTableData(data.sort((a, b) => a.disp_order - b.disp_order));
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refreshKey]);
  return (
    <Box>
      <Table columns={column} data={tableData} />
      <DeleteModal
        title={"Advisory"}
        modalOpen={modalOpen}
        setModalOpen={() => setModalOpen((prev) => !prev)}
        handleDeleteData={handleDeleteData}
      />
    </Box>
  );
};

export default OperationAndMaintenance;
