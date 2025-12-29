import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Autocomplete } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { leadForm } from "../Config/LeadForm";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useFetchData } from "../../Hooks/useFetchData";
import { getContactsById } from "../../Services/contact.service";
import { showError } from "../../Services/alert";

export const Header = ({ isEditMode, isConvertToLead }) => {
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
            to="/lead"
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
              Lead
            </Typography>
          </Link>
          <Typography
            variant="h6"
            sx={{
              color: "grey",
              fontSize: "18px",
            }}
          >
            {isEditMode
              ? "Edit Generated Lead"
              : isConvertToLead
              ? "Convert To Lead"
              : " Generate Lead"}
          </Typography>
        </Breadcrumbs>
      </Box>
    </>
  );
};

const LeadGenerate = () => {
  const navigate = useNavigate();
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [contactPerson, setContactPerson] = useState([]);
  const [isNewContactPerson, setIsNewContactPerson] = useState(false);
  const { data = [] } = useFetchData("/customers");

  const { state } = useLocation();

  const editData = state?.editData;
  const convertLeadData = state?.convertLead;

  const isEditMode = Boolean(editData);
  const isConvertToLead = Boolean(convertLeadData);

  const convertToLeads = useMemo(() => {
    if (!Array.isArray(convertLeadData)) return;

    return convertLeadData.map((item) => ({
      ...item,
      contact_person: item.contact_person.split("/")[0].trim(),
      mobile_no: Number(item.contact_person.split("/")[1].trim()),
    }));
  }, [convertLeadData]);

  console.log("convertToLead", convertToLeads);

  const companyNames = useMemo(() => {
    if (!Array.isArray(data)) return [];

    // const phoneNumber = data.map((item, index) => {
    //   return item.phone_no;
    // });

    return data.map((item) => ({
      label: item.company_name,
      company_id: item.company_id,
      mobile_no: Number(item.phone_no[0]),
      group_name: item.group_name,
      branch_div: item.branch_div,
      gst_number: item.gst_number,
      email: item.email,
      website: item.website,
      address_line_1: item.address_line_1,
      address_line_2: item.address_line_2,
      country: item.country,
      state: item.state,
      pincode: item.pincode,
      company_details: item.company_details,
    }));
  }, [data]);

  const { control, handleSubmit, setValue, reset, clearErrors } = useForm({
    defaultValues: {
      company_id: "",
    },
  });

  const contactPersonValue = useWatch({
    control,
    name: "contact_person",
  });

  const fetchContactPersons = async (companyId) => {
    if (!companyId) return;
    try {
      const response = await getContactsById(companyId);
      if (response?.success) {
        setContactPerson(response?.data);
        setValue("contact_person", null, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        });
        setIsNewContactPerson(false);
      }
    } catch (error) {
      showError("Error Fetching contacts");
      console.error("Error Fetching Contacts", error);
    }
  };

  const clearCompanyDependentFields = () => {
    setValue("contact_person", null, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
    setContactPerson([]);
    setIsNewContactPerson(false);
    setValue("group_name", "");
    setValue("branch_div", "");
    setValue("gst_number", "");
    setValue("mobile_no", "");
    setValue("email", "");
    setValue("website", "");
    setValue("address_line_1", "");
    setValue("address_line_2", "");
    setValue("country", "");
    setValue("state", "");
    setValue("pincode", "");
    setValue("company_details", "");
  };

  useEffect(() => {
    if (isEditMode) {
      setValue("company_name", editData.company_name, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("contact_person", editData.contact_person, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    } else if (isConvertToLead) {
      const firstLead = convertToLeads[0];
      setValue("company_name", firstLead.company_name, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("contact_person", firstLead.contact_person, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("mobile_no", firstLead.mobile_no, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("email", firstLead.email, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("website", firstLead.website, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("address_line_1", firstLead.address, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("company_details", firstLead.company_details, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [isEditMode, isConvertToLead]);

  const handleSubmitData = (data) => {
    const navigationState = {
      customerData: data,
    };
    if (editData) {
      navigationState.editData = editData;
    }
    if (isConvertToLead && convertToLeads?.[0]) {
      navigationState.convertLead = convertToLeads[0];
    }
    console.log("data", navigationState);
    navigate("/enquiry-type", { state: navigationState });
  };
  return (
    <>
      <Header isEditMode={isEditMode} isConvertToLead={isConvertToLead} />
      <Box sx={{ mt: 2, background: "#fff", p: 2 }}>
        <Box component={"form"} onSubmit={handleSubmit(handleSubmitData)}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={12}
            maxWidth={"100%"}
            sx={{ mt: 2 }}
          >
            {leadForm.map((field, index) => (
              <React.Fragment key={field.name}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body1" sx={{ fontSize: "15px", mt: 1 }}>
                    {field.label}{" "}
                    {field.required && <span style={{ color: "red" }}>*</span>}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth>
                    {field.name === "company_name" ? (
                      <Controller
                        name={field.name}
                        control={control}
                        rules={{ required: "Company Name is required" }}
                        render={({ field: controllerField, fieldState }) => (
                          <Autocomplete
                            freeSolo
                            options={companyNames || []}
                            getOptionLabel={(option) =>
                              typeof option === "string" ? option : option.label
                            }
                            value={controllerField.value || null}
                            onChange={(_, newValue) => {
                              controllerField.onChange(
                                typeof newValue === "string"
                                  ? newValue
                                  : newValue?.label || null
                              );
                              clearCompanyDependentFields();
                              setIsNewCustomer(false);

                              if (!newValue) {
                                setIsNewCustomer(false);
                                setIsNewContactPerson(false);
                                return;
                              }

                              if (newValue.company_id) {
                                fetchContactPersons(newValue.company_id);
                                setValue("company_id", newValue.company_id);
                                setValue(
                                  "group_name",
                                  newValue.group_name || ""
                                );
                                setValue(
                                  "mobile_no",
                                  newValue.mobile_no || "",
                                  {
                                    shouldValidate: true,
                                    shouldDirty: false,
                                    shouldTouch: false,
                                  }
                                );
                                setValue(
                                  "branch_div",
                                  newValue.branch_div || ""
                                );
                                setValue(
                                  "gst_number",
                                  newValue.gst_number || ""
                                );
                                setValue("email", newValue.email || "");
                                setValue("website", newValue.website || "");
                                setValue(
                                  "address_line_1",
                                  newValue.address_line_1 || "",
                                  {
                                    shouldValidate: true,
                                    shouldDirty: false,
                                    shouldTouch: false,
                                  }
                                );
                                setValue(
                                  "address_line_2",
                                  newValue.address_line_2 || "",
                                  {
                                    shouldValidate: true,
                                    shouldDirty: false,
                                    shouldTouch: false,
                                  }
                                );
                                setValue("country", newValue.country || "", {
                                  shouldValidate: true,
                                  shouldDirty: false,
                                  shouldTouch: false,
                                });
                                setValue("state", newValue.state || "", {
                                  shouldValidate: true,
                                  shouldDirty: false,
                                  shouldTouch: false,
                                });
                                setValue("pincode", newValue.pincode || "", {
                                  shouldValidate: true,
                                  shouldDirty: false,
                                  shouldTouch: false,
                                });
                                setValue(
                                  "company_details",
                                  newValue.company_details || "",
                                  {
                                    shouldValidate: true,
                                    shouldDirty: false,
                                    shouldTouch: false,
                                  }
                                );
                              }
                              setIsNewCustomer(false);
                            }}
                            onInputChange={(_, inputValue, reason) => {
                              if (reason === "reset" || reason === "clear")
                                return;
                              const exists = companyNames?.some(
                                (opt) =>
                                  opt.label.toLowerCase() ===
                                  inputValue.toLowerCase()
                              );
                              controllerField.onChange(inputValue);
                              setIsNewCustomer(!exists && inputValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )}
                      />
                    ) : field.name === "contact_person" ? (
                      <Controller
                        name="contact_person"
                        control={control}
                        rules={{
                          required: field.required
                            ? `${field.label} is Required`
                            : false,
                        }}
                        render={({ field: controllerField, fieldState }) => (
                          <Autocomplete
                            freeSolo
                            options={contactPerson || []}
                            getOptionLabel={(option) =>
                              typeof option === "string"
                                ? option
                                : option.contact_name
                            }
                            value={controllerField.value || null}
                            inputValue={contactPersonValue || ""}
                            onChange={(_, newValue) => {
                              controllerField.onChange(
                                typeof newValue === "string"
                                  ? newValue
                                  : newValue?.contact_name || null
                              );
                              setIsNewContactPerson(false);
                            }}
                            onInputChange={(_, inputValue, reason) => {
                              if (reason === "reset" || reason === "clear")
                                return;

                              const exists = contactPerson?.some(
                                (opt) =>
                                  opt.contact_name.toLowerCase() ===
                                  inputValue.toLowerCase()
                              );

                              controllerField.onChange(inputValue);
                              console.log("is new contact", isNewContactPerson);

                              setIsNewContactPerson(!exists && inputValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        )}
                      />
                    ) : field.type === "select" ? (
                      <Controller
                        name={field.name}
                        control={control}
                        rules={{
                          required: field.required
                            ? `${field.label} is required`
                            : false,
                        }}
                        render={({ field: controllerField, fieldState }) => {
                          return (
                            <TextField
                              {...controllerField}
                              size="small"
                              fullWidth
                              select
                              value={controllerField.value ?? ""}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            >
                              <MenuItem value="" disabled>
                                -- Select --
                              </MenuItem>

                              {field.options?.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          );
                        }}
                      />
                    ) : (
                      <Controller
                        name={field.name}
                        control={control}
                        rules={{
                          required: field.required
                            ? `${field.label} is required`
                            : false,
                        }}
                        render={({ field: controllerField, fieldState }) => {
                          const isNumber = field.type === "number";
                          const isTextarea = field.type === "textarea";

                          return (
                            <TextField
                              {...controllerField}
                              size="small"
                              fullWidth
                              // select={isSelect}
                              multiline={isTextarea}
                              rows={isTextarea ? field.rows || 3 : 1}
                              type={isNumber ? "number" : "text"}
                              value={controllerField.value ?? ""}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              onChange={(e) => {
                                let value = e.target.value;

                                if (isNumber) {
                                  value = value === "" ? "" : Number(value);
                                }

                                console.log(field.name, "new value:", value);

                                controllerField.onChange(value);
                              }}
                            >
                              {/* {isSelect && (
                                <>
                                  <MenuItem value="" disabled>
                                    -- Select --
                                  </MenuItem>

                                  {field.options?.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </>
                              )} */}
                            </TextField>
                          );
                        }}
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
                  Proceed to Lead
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default LeadGenerate;
