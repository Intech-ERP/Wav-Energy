import React from "react";
import { MaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";

const Table = ({
  columns,
  data,
  enablePagination = true,
  enableSorting = true,
  enableColumnFilters = true,
  enableGlobalFilter = true,
}) => {
  return (
    <>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
        <Box gridColumn="span 12">
          <MaterialReactTable
            columns={columns}
            data={data}
            enablePagination={enablePagination}
            enableSorting={enableSorting}
            enableColumnFilters={enableColumnFilters}
            enableGlobalFilter={enableGlobalFilter}
            muiTableContainerProps={{
              sx: {
                width: "100%",
                border: "1px solid #e0e0e0",
                // borderRadius: "8px",
                // boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              },
            }}
            muiTableProps={{
              sx: {
                "& .MuiTableCell-root": {
                  fontSize: "0.95rem",
                  padding: "12px",
                },
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                // fontSize: "1rem",
                // borderBottom: "2px solid #d0d0d0",
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                // borderBottom: "1px solid #e0e0e0",
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Table;
