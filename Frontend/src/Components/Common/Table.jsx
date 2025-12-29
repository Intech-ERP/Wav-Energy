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
            muiTableContainerProps={{ sx: { width: "100%" } }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Table;
