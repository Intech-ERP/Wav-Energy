import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Table from "../Common/Table";
import { contactForm } from "../Config/Contact";
import { Controller, useForm } from "react-hook-form";
import { showError, showSuccess } from "../../Services/alert";
import { addCustomer, updateCustomer } from "../../Services/customer.service";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addCustomerContact,
  deleteContact,
  getContactsById,
  updateContact,
} from "../../Services/contact.service";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../Common/Modal";

const Contact = ({ customerData, isEditMode }) => {
  const [addContact, setAddContact] = useState(false);
  const [contactsData, setContactsData] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(false);

  const [isContactEdit, setIsContactEdit] = useState(false);

  const addContactRef = useRef(null);

  // const { data } = getContactsById(customerData?.company_id);

  // console.log("Conatctdata", data);

  const navigate = useNavigate();

  console.log("isEditMode", isEditMode);
  console.log("customerData", customerData);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      contact_id: "",
      title: "",
      name: "",
      dept: "",
      mobile: "",
      email: "",
    },
  });
  const handleAddContact = () => {
    setAddContact(true);
  };

  const handleSaveData = async (data) => {
    const contacts = [
      {
        ...data,
        company_id: customerData.company_id,
      },
    ];
    console.log("contacts", contacts);
    console.log("customer data", customerData);
    try {
      const [contactRes, customerRes] = await Promise.all([
        addCustomerContact(contacts),
        addCustomer(customerData),
      ]);

      if (contactRes.success && customerRes.success) {
        reset();
        showSuccess("Customer data added successfully!");
        navigate("/address-book");
      } else {
        throw new Error("One of the requests failed");
      }
    } catch (error) {
      showError("Failed to save customer data. Please try again.");
      console.error(error);
    }
  };

  const handleUpdateData = async (data) => {
    try {
      const contactData = {
        ...data,
        company_id: customerData.company_id,
      };
      console.log("contactId", data.contact_id);

      console.log("conatct data", contactData);

      console.log("customerData", customerData);

      const customerResponse = await updateCustomer(
        customerData.company_id,
        customerData
      );
      if (!customerResponse.success) throw new Error("Error Update Customer");

      let contactResponse;

      if (isContactEdit && data.contact_id) {
        contactResponse = await updateContact(data.contact_id, contactData);
      } else {
        const contactArray = [contactData];
        contactResponse = await addCustomerContact(contactArray);
      }

      if (!contactResponse.success) {
        throw new Error("Failed to save contact");
      }

      reset();
      showSuccess("Customer data Updated Successfully!");
      navigate("/address-book");
    } catch (error) {
      showError("Error Updating Customer data");
      console.error("Error Updating customer data", error);
    }
  };

  const fetchContactById = async (id) => {
    try {
      const response = await getContactsById(id);
      if (response.success) {
        setContactsData(response.data);
      }
    } catch (error) {
      console.error("error Fetching Contact", error);
    }
  };

  const handleEditData = (row) => {
    console.log("row", row);
    setAddContact(true);
    setIsContactEdit(true);
    reset({
      title: row.title,
      name: row.contact_name,
      contact_id: row.contact_id,
      designation: row.designation,
      department: row.dept,
      mailer: row.mailer,
      mobile_no1: row.personal_mobile ? Number(row.personal_mobile) : "",
      mobile_no2: Number(row.mobile),
      official_mail: row.email,
      personal_mail: row.personal_email,
      personal_address: row.personal_address,
      birthday: row.birthday,
      anniversary: row.anniversary,
    });
  };

  const handleDelete = (row) => {
    setDeleteModalOpen(true);
    setDeleteRow(row);
  };

  const handleDeleteData = async () => {
    try {
      const response = await deleteContact(deleteRow?.contact_id);
      if (response.success) {
        showSuccess("contact removed successfully");
        fetchContactById(customerData?.company_id);
      }
    } catch (error) {
      console.error("error deleting contact", error);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchContactById(customerData.company_id);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (addContact && addContactRef.current) {
      addContactRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [addContact]);

  console.log("contactsData", contactsData);

  const column = [
    { id: 1, accessorKey: "contact_name", header: "Name" },
    { id: 2, accessorKey: "designation", header: "Designation" },
    { id: 3, accessorKey: "dept", header: "Department" },
    { id: 4, accessorKey: "mobile", header: "Mobile No" },
    { id: 5, accessorKey: "email", header: "Email" },
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
  // console.log("Running");
  return (
    <Box sx={{ mt: 3 }}>
      <Table columns={column} data={contactsData} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          mt: 2,
        }}
      >
        {!isContactEdit && (
          <Button
            size="small"
            variant="contained"
            sx={{ borderRadius: 0 }}
            onClick={handleAddContact}
          >
            Add Contact
          </Button>
        )}
        <DeleteModal
          title={"Contact"}
          modalOpen={deleteModalOpen}
          setModalOpen={() => setDeleteModalOpen((prev) => !prev)}
          handleDeleteData={handleDeleteData}
        />
      </Box>
      {addContact && (
        <Box ref={addContactRef} sx={{ mt: 2, background: "#fff", p: 3 }}>
          <Box
            component={"form"}
            onSubmit={handleSubmit(
              isEditMode ? handleUpdateData : handleSaveData
            )}
          >
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {contactForm.map((contact, index) => (
                <React.Fragment key={index}>
                  {contact.name === "name" && (
                    <>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "15px", mt: 1 }}
                        >
                          {contact.label}{" "}
                          {contact.required && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 3, md: 1 }}>
                        <FormControl fullWidth>
                          <Controller
                            name="title"
                            control={control}
                            rules={{
                              required: contact.required,
                            }}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                select
                                defaultValue=""
                                size="small"
                                fullWidth
                                error={!!fieldState.error}
                              >
                                <MenuItem value="" disabled>
                                  --Select--
                                </MenuItem>
                                <MenuItem value="Mr">Mr</MenuItem>
                                <MenuItem value="Mrs">Mrs</MenuItem>
                                <MenuItem value="Ms">Ms</MenuItem>
                                <MenuItem value="Dr">Dr</MenuItem>
                              </TextField>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 9, md: 3 }}>
                        <FormControl fullWidth>
                          <Controller
                            name={contact.name}
                            control={control}
                            rules={{
                              required: contact.required
                                ? `${contact.label} is required`
                                : false,
                            }}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                type={contact.type}
                                size="small"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {contact.name != "name" && (
                    <>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "15px", mt: 1 }}
                        >
                          {contact.label}{" "}
                          {contact.required && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                          <Controller
                            name={contact.name}
                            control={control}
                            rules={{
                              required: contact.required
                                ? `${contact.label} is required`
                                : false,
                              ...(contact.type === "number" && {
                                pattern: {
                                  value: /^[0-9]{10}$/,
                                  message: "Mobile number must be 10 digits",
                                },
                              }),
                            }}
                            render={({ field, fieldState }) => (
                              <TextField
                                {...field}
                                type={contact.type}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
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
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Contact;
