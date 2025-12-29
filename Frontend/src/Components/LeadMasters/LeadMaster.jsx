import { Box, Breadcrumbs, Button, Typography } from "@mui/material";
import { Tabs, TabList, Tab, TabPanel, tabClasses } from "@mui/joy";
import React, { useState } from "react";
import Table from "../Common/Table";
import Advisory from "./advisory";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import LeadMasterForm from "./leadMasterForm";
import Execution from "./execution";
import OperationAndMaintenance from "./operationAndMaintenance";

const tablist = [
  { label: "Adivisory", value: "advisory" },
  { label: "Execution", value: "execution" },
  { label: "Operation & Maintenance", value: "operation" },
];

export const Header = ({ tabValue, handleAddData }) => {
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
          //   separator={<NavigateNextIcon sx={{ fontSize: "18px" }} />}
          aria-label="breadcrumb"
        >
          <Typography
            variant="h6"
            sx={{
              color: "#0072BC",
              fontSize: "18px",
            }}
          >
            Lead Master
          </Typography>
        </Breadcrumbs>
        <Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddCircleOutlinedIcon />}
            sx={{ borderRadius: 0, textTransform: "none" }}
            onClick={handleAddData}
          >
            Add {tabValue}
          </Button>
        </Box>
      </Box>
    </>
  );
};

const LeadMaster = () => {
  const [tabValue, setTabValue] = useState("advisory");
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const column = [
    { id: 1, accessorKey: "company_name", header: "Customer Name" },
    { id: 2, accessorKey: "alias_name", header: "Alias Name" },
    { id: 3, accessorKey: "pincode", header: "Pincode" },
    { id: 4, accessorKey: "created_date", header: "Created Date" },
    { id: 5, accessorKey: "modified_date", header: "Modified Date" },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleAddData = () => {
    setOpenForm(true);
  };
  const handleEditData = (row) => {
    setEditData(row);
    setOpenForm(true);
  };
  return (
    <>
      <Header tabValue={tabValue} handleAddData={handleAddData} />
      <Box sx={{ mt: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <TabList
            disableUnderline
            sx={{
              overflow: "auto",
              scrollSnapType: "x mandatory",
              "&::-webkit-scrollbar": { display: "none" },
              [`& .${tabClasses.root}`]: {
                fontSize: "sm",
                fontWeight: "lg",
                [`&[aria-selected="true"]`]: {
                  color: "primary.500",
                  bgcolor: "background.surface",
                },
                [`&.${tabClasses.focusVisible}`]: {
                  outlineOffset: "-4px",
                },
              },
            }}
          >
            {tablist.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                disableIndicator
                variant="soft"
                sx={{
                  flex: "none",
                  scrollSnapAlign: "start",
                  flexGrow: 1,
                }}
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>
          <TabPanel value={"advisory"}>
            <Advisory
              refreshKey={refreshKey}
              tabValue={tabValue}
              onEditData={handleEditData}
            />
          </TabPanel>
          <TabPanel value={"execution"}>
            <Execution
              tabValue={tabValue}
              refreshKey={refreshKey}
              onEditData={handleEditData}
            />
          </TabPanel>
          <TabPanel value={"operation"}>
            <OperationAndMaintenance
              tabValue={tabValue}
              refreshKey={refreshKey}
              onEditData={handleEditData}
            />
          </TabPanel>
        </Tabs>
        <LeadMasterForm
          tabValue={tabValue}
          open={openForm}
          editData={editData}
          onClose={() => {
            setOpenForm(false);
            setEditData(null);
          }}
          setIsAdvisoryAdded={() => setRefreshKey((prev) => prev + 1)}
        />
      </Box>
    </>
  );
};

export default LeadMaster;
