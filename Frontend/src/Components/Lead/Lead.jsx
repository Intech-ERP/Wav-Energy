import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Grid,
  TextField,
  FormControl,
} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import Table from "../Common/Table";
import CloseIcon from "@mui/icons-material/Close";
import { EnquiryForm } from "../Config/AddEnquiry";
import { Controller, set, useForm } from "react-hook-form";
import { showError, showSuccess } from "../../Services/alert";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addLeads,
  convertedLeads,
  removeConvertedLead,
  updateLead,
} from "../../Services/enquiry.service";
import { useFetchData } from "../../Hooks/useFetchData";
import { data, useNavigate } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel, tabClasses } from "@mui/joy";
import DeleteModal from "../Common/Modal";

export const formatDate = (date) => {
  if (!date) return "";
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const [dd, mm, yyyy] = date.split("/");
    return `${yyyy}-${mm}-${dd}`;
  }
  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  return d.toISOString().split("T")[0];
};

export const Header = ({ onAddEnquiry, pendingCount }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isPending = Boolean(pendingCount);
  const showRights = user.menu?.filter((item) => item.name === "Lead");
  console.log("showRights", showRights);
  return (
    <Box
      sx={{
        // mb: 4,
        // mt: 1,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
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

      {showRights[0].access === "full" && (
        <Box sx={{ display: "flex", gap: 1.5, mt: { xs: 1, md: 0 } }}>
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 0, textTransform: "none" }}
            startIcon={<AddCircleOutlinedIcon />}
            onClick={() => onAddEnquiry((prev) => !prev)}
          >
            Add Lead
          </Button>

          {/* {isPending && (
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: 0,
              textTransform: "none",
              width: 130,
              background: "#A8A6A6",
              color: "#fff",
              "&:hover": {
                background: "#9e9c9c",
              },
            }}
          >
            Pending
            <Badge
              badgeContent={pendingCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  right: -12,
                  top: -7,
                },
              }}
            />
          </Button>
        )} */}
        </Box>
      )}
    </Box>
  );
};

export const AddLead = ({ open, onClose, refetch, editRow }) => {
  const { control, handleSubmit, reset } = useForm();

  const isEdit = Boolean(editRow);

  const [contactPerson, mobile] = editRow?.contact_person?.split("/") ?? [
    "",
    "",
  ];

  const handleSubmitLead = async (data) => {
    console.log("Lead Data:", data);
    try {
      const response = await addLeads(data);
      if (response.success) {
        showSuccess("Lead added successfully");
        reset();
        onClose();
        refetch();
      }
    } catch (error) {
      showError("Error submitting enquiry");
      console.error("Error submitting enquiry:", error);
    }
  };

  const handleUpdateLead = async (data) => {
    console.log("Update Enquiry Data:", data);
    try {
      const response = await updateLead(editRow?.lead_id, { data: data });
      if (response.success) {
        showSuccess(response.message || "Lead updated successfully1");
        reset({
          company_name: "",
          contact_person: "",
          mobile_no: "",
          email_id: "",
          address: "",
          website: "",
          next_followup_date: "",
          company_details: "",
        });
        onClose();
        refetch();
      }
    } catch (error) {
      showError("Error updating enquiry");
      console.error("Error updating enquiry:", error);
    }
  };
  useEffect(() => {
    if (!isEdit || !editRow) return;
    reset({
      company_name: editRow?.company_name,
      contact_person: contactPerson,
      mobile_no: Number(mobile),
      email_id: editRow?.email || "",
      address: editRow?.address,
      website: editRow?.website,
      next_followup_date: formatDate(editRow?.next_followup_date),
      company_details: editRow?.company_details,
    });
  }, [isEdit, editRow, reset]);

  const handleClose = () => {
    reset({
      company_name: "",
      contact_person: "",
      mobile_no: "",
      email_id: "",
      address: "",
      website: "",
      next_followup_date: "",
      company_details: "",
    });
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        // onClose={onClose}
        PaperProps={{
          sx: {
            width: 1000,
            maxWidth: "100vw",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
          }}
        >
          <Typography sx={{ color: "#0072BC", fontSize: 17 }}>
            {isEdit ? "Edit Lead" : "Add Lead"}
          </Typography>
          <IconButton onClick={handleClose} sx={{ ml: 2 }}>
            <CloseIcon sx={{ color: "#0072BC" }} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1, padding: "20px 30px" }}>
          <Box
            component={"form"}
            noValidate
            onSubmit={handleSubmit(
              isEdit ? handleUpdateLead : handleSubmitLead
            )}
          >
            <Grid container spacing={2} columns={12}>
              {EnquiryForm.map((field, index) => (
                <React.Fragment key={field.name}>
                  <Grid size={{ xs: 12, md: 3 }} sx={{ mb: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "15px", mt: 1 }}
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span style={{ color: "red" }}>*</span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }} sx={{ mb: 1 }}>
                    <FormControl fullWidth>
                      {field.type === "multiline" && (
                        <Controller
                          name={field.name}
                          control={control}
                          rules={{
                            required: field.required
                              ? `${field.label} is required`
                              : false,
                          }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              type="text"
                              multiline
                              rows={3}
                              size="small"
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                      {field.type === "date" && (
                        <Controller
                          name={field.name}
                          control={control}
                          rules={{
                            required: field.required
                              ? `${field.label} is required`
                              : false,
                          }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              type="date"
                              size="small"
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                      {field.type === "number" && (
                        <Controller
                          name={field.name}
                          control={control}
                          type={field.type}
                          rules={{
                            required: field.required
                              ? `${field.label} is required`
                              : false,
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Phone number must be 10 digits",
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                      {field.type !== "multiline" &&
                        field.type !== "date" &&
                        field.type !== "number" && (
                          <Controller
                            name={field.name}
                            control={control}
                            type={field.type}
                            rules={{
                              required: field.required
                                ? `${field.label} is required`
                                : false,
                            }}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                size="small"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )}
                    </FormControl>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ borderRadius: 0 }}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Lead = () => {
  const [addLead, setAddLead] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [tabValue, setTabValue] = useState("pending");
  const [convertedData, setConvertedData] = useState([]);
  const { data, error, refetch } = useFetchData("/leads");
  const [deleteRow, setDeleteRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const leadPermission = user?.menu?.find((item) => item.name === "Lead");
  const hasFullAccess = leadPermission?.access === "full";

  const navigate = useNavigate();

  const formatData = data.map((item, index) => ({
    ...item,
    contact_person: `${item.contact_person} / ${item.mobile}`,
  }));

  const handleAddLead = () => {
    setAddLead((prev) => !prev);
    setEditRow(null);
  };
  const handleEditEnquiry = (enquiry) => {
    setAddLead(true);
    setEditRow(enquiry);
  };

  const getConvertedData = async () => {
    try {
      const res = await convertedLeads();
      if (res.success) {
        setConvertedData(res?.data);
        console.log("convert data", res?.data);
      }
    } catch (error) {
      console.error("Error Getting converted data", error);
    }
  };

  const handleDelete = (row) => {
    setModalOpen(true);
    setDeleteRow(row);
  };

  const handleDeleteData = async () => {
    const response = await removeConvertedLead(deleteRow?.lead_id);

    if (response) {
      showSuccess("Converted data Removed Successfully!");
    }
  };

  useEffect(() => {
    if (tabValue === "converted") {
      getConvertedData();
    }
  }, [tabValue]);

  const handleConvertEnquiry = (row) => {
    navigate("/generate-enquiry", { state: { convertEnquiry: [row] } });
  };
  const column = [
    // base columns
    {
      id: 1,
      accessorKey: "company_name",
      header: "Company Name",
      Cell: ({ row }) =>
        hasFullAccess ? (
          <Box
            sx={{
              cursor: "pointer",
              // color: "primary.main",
            }}
            onClick={() => handleEditEnquiry(row.original)}
          >
            {row.original.company_name}
          </Box>
        ) : (
          <Box>{row.original.company_name}</Box>
        ),
    },
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
                <Button
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: 0 }}
                  onClick={() => handleConvertEnquiry(row.original)}
                >
                  Convert to Enquiry
                </Button>
              </Box>
            ),
          },
        ]
      : []),
  ];

  const column2 = [
    {
      id: 1,
      accessorKey: "company_name",
      header: "Company Name",
      Cell: ({ row }) => (
        <Box
          sx={{
            cursor: "pointer",
            //  color: "primary.main",
            textDecoration: "none",
          }}
        >
          {row.original.company_name}
        </Box>
      ),
    },
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
            color="error"
            onClick={() => handleDelete(row.original)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box>
        <Header onAddEnquiry={setAddLead} pendingCount={data.length} />
        <AddLead
          open={addLead}
          onClose={handleAddLead}
          refetch={refetch}
          editRow={editRow}
        />
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
              <Tab
                value={"pending"}
                disableIndicator
                variant="soft"
                sx={{
                  flex: "none",
                  scrollSnapAlign: "start",
                  flexGrow: 1,
                }}
              >
                Pending
                <Badge
                  badgeContent={formatData.length}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      right: -12,
                      top: -7,
                    },
                  }}
                />
              </Tab>
              <Tab
                value={"converted"}
                disableIndicator
                variant="soft"
                sx={{
                  flex: "none",
                  scrollSnapAlign: "start",
                  flexGrow: 1,
                }}
              >
                Converted
              </Tab>
            </TabList>
            <TabPanel value={"pending"}>
              <Table columns={column} data={formatData} />
            </TabPanel>
            <TabPanel value={"converted"}>
              <Table columns={column2} data={convertedData} />
            </TabPanel>
          </Tabs>
          <DeleteModal
            title={"converted Data"}
            modalOpen={modalOpen}
            setModalOpen={() => setModalOpen((prev) => !prev)}
            handleDeleteData={handleDeleteData}
          />
        </Box>
      </Box>
    </>
  );
};

export default Lead;
