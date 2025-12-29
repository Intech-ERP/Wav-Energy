import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  Grid,
  IconButton,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import React, { useEffect, useRef, useState } from "react";
import { data, useLocation, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import {
  Controller,
  useForm,
  useFieldArray,
  useFormState,
} from "react-hook-form";
import Contact from "./Contact";
import { addCustomer, updateCustomer } from "../../Services/customer.service";
import toast, { Toaster } from "react-hot-toast";
import { showError, showSuccess } from "../../Services/alert";
import { useFetchCompanyId } from "../../Hooks/useFetchCompanyId";

const formFields = [
  { lable: "Company ID", type: "number", name: "company_id", require: true },
  {
    lable: "Vendor code",
    type: "number",
    name: "vendor_code",
    require: true,
  },
  {
    lable: "Company Name",
    type: "text",
    name: "company_name",
    require: true,
  },
  {
    lable: "Group Name",
    type: "text",
    name: "group_name",
    require: false,
  },
  {
    lable: "Alias Name",
    type: "text",
    name: "alias_name",
    require: true,
  },
  {
    lable: "Add Group",
    type: "text",
    name: "add_group",
    require: false,
  },
  {
    lable: "Branch / Div",
    type: "text",
    name: "branch_div",
    require: false,
  },
  {
    lable: "GST Number",
    type: "text",
    name: "gst_number",
    require: false,
  },
  {
    lable: "Nature of Biz",
    type: "text",
    name: "nature_of_biz",
    require: false,
  },
  {
    lable: "Phone No",
    type: "number",
    name: "phone_no",
    require: false,
  },
  {
    lable: "Email ID",
    type: "email",
    name: "email",
    require: false,
  },
  {
    lable: " Website",
    type: "text",
    name: "website",
    require: false,
  },
  {
    lable: "Address Line 1",
    type: "text",
    name: "address_line_1",
    require: true,
  },
  {
    lable: "Address Line 2",
    type: "text",
    name: "address_line_2",
    require: true,
  },
  {
    lable: "Address Line 3",
    type: "text",
    name: "address_line_3",
    require: false,
  },
  {
    lable: "Address Line 4",
    type: "text",
    name: "address_line_4",
    require: false,
  },
  {
    lable: "Country",
    type: "text",
    name: "country",
    require: true,
  },
  {
    lable: "State",
    type: "text",
    name: "state",
    require: true,
  },
  {
    lable: "Pincode",
    type: "number",
    name: "pincode",
    require: true,
  },
  {
    lable: "Company details",
    type: "text",
    name: "company_details",
    require: true,
  },
];

const DEFAULT_VALUES = {
  vendor_code: "",
  company_name: "",
  group_name: "",
  alias_name: "",
  add_group: "",
  branch_div: "",
  gst_number: "",
  nature_of_biz: "",
  email: "",
  website: "",
  address_line_1: "",
  address_line_2: "",
  address_line_3: "",
  address_line_4: "",
  country: "",
  state: "",
  pincode: "",
  company_details: "",
  phone_no: [{ value: "" }],
};

export const Header = ({ isEditMode }) => {
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
            to="/address-book"
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
              Addressbook
            </Typography>
          </Link>
          <Typography
            variant="h6"
            sx={{
              color: "grey",
              fontSize: "18px",
            }}
          >
            {isEditMode ? "Edit Customer" : "New Customer"}
          </Typography>
        </Breadcrumbs>
      </Box>
    </>
  );
};

const Customer = () => {
  const [contact, setContact] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const contactRef = useRef(null);
  const navigate = useNavigate();

  const { state } = useLocation();
  const editData = state?.editData;

  const isEditMode = Boolean(editData);

  const { data: companyId } = useFetchCompanyId();

  const methods = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const { control, handleSubmit, getValues, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phone_no",
  });

  const handleOpenContact = () => {
    const data = getValues();
    setCustomerData(data);
    setContact((prev) => !prev);
  };

  useEffect(() => {
    if (contact && contactRef.current) {
      setTimeout(() => {
        contactRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  }, [contact]);

  useEffect(() => {
    if (!isEditMode && companyId?.count) {
      //default set company id
      methods.setValue("company_id", companyId.count, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [companyId, methods]);

  useEffect(() => {
    if (isEditMode && editData) {
      reset({
        ...editData,
        company_id: editData.company_id,
        phone_no: editData.phone_no.length
          ? editData.phone_no.map((num) => ({ value: num }))
          : [{ value: "" }],
      });
    }
  }, [isEditMode, editData, reset]);

  const handleSubmitData = async (data) => {
    try {
      const response = await addCustomer(data);
      if (response.success) {
        reset();
        showSuccess("Customer added successfully!");
        navigate("/address-book");
      }
    } catch (error) {
      showError("Failed to add customer. Please try again.");
      console.error("Error adding customer:", error);
    }
  };

  const handleUpdateData = async (data) => {
    try {
      const response = await updateCustomer(editData.company_id, data);
      if (response.success) {
        reset();
        showSuccess("Customer updated successfully!");
        navigate("/address-book");
      }
    } catch (error) {
      showError("Failed to update customer. Please try again.");
      console.error("Error updating customer:", error);
    }
  };

  const onSubmit = isEditMode ? handleUpdateData : handleSubmitData;

  return (
    <>
      <Header isEditMode={isEditMode} />
      <Box sx={{ mt: 2, background: "#fff", p: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={12}
            sx={{ mt: 2 }}
          >
            {formFields.map((field, index) => (
              <React.Fragment key={field.name}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body1" sx={{ fontSize: "15px", mt: 1 }}>
                    {field.lable}
                    {field.require && <span style={{ color: "red" }}>*</span>}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  {field.name === "phone_no" ? (
                    fields.map((phoneNo, index) => (
                      <Box
                        key={phoneNo.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 1,
                        }}
                      >
                        <Controller
                          name={`phone_no.${index}.value`}
                          control={control}
                          rules={{
                            required: field.require
                              ? `${field.lable} is required`
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

                        {index === 0 ? (
                          <IconButton onClick={() => append({ value: "" })}>
                            <AddCircleOutlineIcon sx={{ color: "#0072BC" }} />
                          </IconButton>
                        ) : (
                          <IconButton onClick={() => remove(index)}>
                            <RemoveCircleOutlineIcon color="error" />
                          </IconButton>
                        )}
                      </Box>
                    ))
                  ) : (
                    <FormControl fullWidth>
                      {field.name === "company_id" && (
                        <Controller
                          name="company_id"
                          control={control}
                          rules={{ required: "Company ID is required" }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              size="small"
                              type="text"
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          )}
                        />
                      )}

                      {field.name === "country" && (
                        <Controller
                          name="country"
                          control={control}
                          rules={{ required: "Country is required" }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              select
                              size="small"
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            >
                              <MenuItem value="">-- Select --</MenuItem>
                              <MenuItem value="India">India</MenuItem>
                              <MenuItem value="USA">USA</MenuItem>
                            </TextField>
                          )}
                        />
                      )}

                      {field.name === "state" && (
                        <Controller
                          name="state"
                          control={control}
                          rules={{ required: "State is required" }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              select
                              size="small"
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            >
                              <MenuItem value="">-- Select --</MenuItem>
                              <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                              <MenuItem value="Karnataka">Karnataka</MenuItem>
                              <MenuItem value="Kerala">Kerala</MenuItem>
                            </TextField>
                          )}
                        />
                      )}

                      {field.name !== "country" &&
                        field.name !== "state" &&
                        field.name !== "company_id" && (
                          <Controller
                            name={field.name}
                            control={control}
                            rules={{
                              required: field.require
                                ? `${field.lable} is required`
                                : false,
                            }}
                            render={({ field: rhfField, fieldState }) => (
                              <TextField
                                {...rhfField}
                                type={field.type}
                                size="small"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )}
                    </FormControl>
                  )}
                </Grid>
              </React.Fragment>
            ))}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: 0 }}
                  onClick={handleSubmit(handleOpenContact)}
                >
                  Contact
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: 0 }}
                  type="submit"
                  disabled={contact}
                >
                  {isEditMode ? "Update" : "Save"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>

      {contact && (
        <Box ref={contactRef} sx={{ mt: 2 }}>
          <Contact customerData={customerData} isEditMode={isEditMode} />
        </Box>
      )}
    </>
  );
};

export default Customer;
