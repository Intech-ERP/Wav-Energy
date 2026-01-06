import React, { useEffect, useState } from "react";
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
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { enquiryTypeForm } from "../../Config/EnquiryType";
import { Controller, useForm, useWatch } from "react-hook-form";
import { showError, showSuccess } from "../../../Services/alert";
import {
  addCustomer,
  updateCustomer,
} from "../../../Services/customer.service";
import {
  generateEnquiry,
  updateEnquiry,
} from "../../../Services/EnquiryGenerate.service";
import { convertToEnquiry } from "../../../Services/enquiry.service";
import { useFetchData } from "../../../Hooks/useFetchData";

const formatDate = (date) => {
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

const PRODUCT_SUBTYPES = ["Water Heater", "Water Pump", "Street Light"];

const SERVICE_SUBTYPES = ["Advisory", "Execution", "Operation & Maintenance"];
const Action_OPTIONS = [
  "No Action Taken Yet",
  "Introduction",
  "Call For Brief",
  "Follow up for additional info",
  "Preliminary Site Visit",
  "Meeting Done",
  "Feasibility study completed",
  "Proposal-1",
  "Proposal-2",
  "Proposal-3",
  "Proposal-4",
];

export const Header = () => {
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
            to="/enquiry"
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
              Enquiry
            </Typography>
          </Link>
          <Link
            component={RouterLink}
            to="/generate-enquiry"
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
              Generate Enquiry
            </Typography>
          </Link>
          <Typography
            variant="h6"
            sx={{
              color: "grey",
              fontSize: "18px",
            }}
          >
            Enquiry Type
          </Typography>
        </Breadcrumbs>
      </Box>
    </>
  );
};

const EnquiryType = () => {
  const { handleSubmit, control, reset, setValue } = useForm();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [url, setUrl] = useState("/advisory");

  const { data, refetch } = useFetchData(url);

  const sortedData = data.sort((a, b) => a.disp_order - b.disp_order);


  const customerData = state.customerData;
  const editData = state?.editData;
  const convertLead = state?.convertLead;

  const isEditMode = Boolean(editData);
  const isConvertToLead = Boolean(convertLead);

  console.log("convertLead", convertLead);

  const enquiryType = useWatch({
    control,
    name: "enquiry_type",
  });
  const subType = useWatch({
    control,
    name: "sub_type",
  });

  console.log("sub type", typeof subType);

  const shouldShowSubtype = ["advisory", "execution"].includes(subType);

  useEffect(() => {
    if (subType === "Advisory") {
      setUrl("/advisory");
    } else if (subType === "Execution") {
      setUrl("/execution");
    } else {
      setUrl("/operation");
    }
  }, [subType]);

  useEffect(() => {
    if (isEditMode) {
      setValue("enquiry_type", editData.enquiry_type, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("sub_type", editData.sub_type, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("lead_source", editData.lead_source, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("action", editData.action, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("last_followup_date", formatDate(editData.last_followup_date), {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("next_followup_date", formatDate(editData.next_followup_date), {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("advisory", editData.advisory, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("execution", editData?.execution, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      setValue("operation_Maintenance", editData?.operation_Maintenance, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
    if (isConvertToLead) {
      setValue(
        "last_followup_date",
        formatDate(convertLead.last_followup_date),
        {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        }
      );
      setValue(
        "next_followup_date",
        formatDate(convertLead.next_followup_date),
        {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        }
      );
    }
  }, [isEditMode, isConvertToLead]);

  const handleSaveData = async (data) => {
    try {
      const enquiryData = {
        ...data,
        ...customerData,
      };

      // let customerId = null;

      const customerResponse = await addCustomer(customerData);
      if (!customerResponse.success) throw new Error("Customer error");

      enquiryData.customer_id = customerResponse.company_id;

      const enquiryResponse = await generateEnquiry(enquiryData);
      if (!enquiryResponse.success) throw new Error("Enquiry creation failed");

      if (isConvertToLead) {
        await convertToEnquiry(convertLead.lead_id);
      }

      reset();
      showSuccess("Enquiry Generated Successfully!");
      navigate("/enquiry");
    } catch (error) {
      showError("Error saving lead generation");
      console.error("Lead save error:", error);
    }
  };

  const handleUpdateData = async (data) => {
    console.log("edited data", data);
    console.log("customer data", customerData);
    try {
      const enquiryData = {
        ...data,
        ...customerData,
      };
      const [customerResponse, leadResponse] = await Promise.all([
        updateCustomer(customerData.company_id, customerData),
        updateEnquiry(editData.enquiry_id, enquiryData),
      ]);

      if (customerResponse.success && leadResponse.success) {
        showSuccess("Enquiry Updated Successfully!");
        navigate("/enquiry");
      }
    } catch (error) {
      showError("Error Updating Enquiry data");
      console.error("Error Updating Enquiry data");
    }
  };
  return (
    <>
      <Header />
      <Box sx={{ mt: 2, background: "#fff", p: 2 }}>
        <Box
          component={"form"}
          onSubmit={handleSubmit(
            isEditMode ? handleUpdateData : handleSaveData
          )}
        >
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={12}
            maxWidth={"100%"}
            sx={{ mt: 2 }}
          >
            {enquiryTypeForm
              .filter((item) => item.name !== "advisory")
              .map((enquiry, index) => (
                <React.Fragment key={index}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    {enquiry.name !== "advisory" && (
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "15px", mt: 1 }}
                      >
                        {enquiry.label}{" "}
                        {enquiry.required && (
                          <span style={{ color: "red" }}>*</span>
                        )}
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <FormControl fullWidth>
                      {enquiry.name === "enquiry_type" && (
                        <Controller
                          name="enquiry_type"
                          control={control}
                          rules={{ required: "Enquiry Type is required" }}
                          render={({ field: controllerField, fieldState }) => (
                            <TextField
                              {...controllerField}
                              select
                              size="small"
                              fullWidth
                              value={controllerField.value || ""}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            >
                              <MenuItem value="" disabled>
                                --Select--
                              </MenuItem>
                              <MenuItem value="Product">Product</MenuItem>
                              <MenuItem value="Service">Service</MenuItem>
                            </TextField>
                          )}
                        />
                      )}

                      {enquiry.name === "sub_type" && (
                        <Controller
                          name="sub_type"
                          control={control}
                          rules={{ required: "Sub Type is required" }}
                          render={({ field: controllerField, fieldState }) => (
                            <TextField
                              {...controllerField}
                              select
                              size="small"
                              fullWidth
                              value={controllerField.value || ""}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            >
                              <MenuItem value="" disabled>
                                --Select--
                              </MenuItem>

                              {enquiryType &&
                                (enquiryType === "Product"
                                  ? PRODUCT_SUBTYPES
                                  : SERVICE_SUBTYPES
                                ).map((item) => (
                                  <MenuItem key={item} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                            </TextField>
                          )}
                        />
                      )}

                      {/* {subType === "advisory" && (
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Controller
                          name="advisory"
                          control={control}
                          // rules={{ required: `${enquiry.label} is required` }}
                          render={({ field: controllerField, fieldState }) => (
                            <TextField
                              {...controllerField}
                              select
                              size="small"
                              fullWidth
                              value={controllerField.value || ""}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            >
                              <MenuItem value="" disabled>
                                --Select--
                              </MenuItem>
                              {data.map((item) => (
                                <MenuItem value={item.advisory}>
                                  {item.advisory}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                    )} */}

                      {enquiry.name === "lead_source" &&
                        enquiry.name !== "enquiry_type" &&
                        enquiry.name !== "sub_type" && (
                          <Controller
                            name={enquiry.name}
                            control={control}
                            rules={{ required: `${enquiry.label} is required` }}
                            render={({
                              field: controllerField,
                              fieldState,
                            }) => (
                              <TextField
                                {...controllerField}
                                select
                                size="small"
                                value={controllerField.value || ""}
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              >
                                <MenuItem value="" disabled>
                                  --Select--
                                </MenuItem>
                                {/* {enquiry.options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))} */}
                                <MenuItem value="Associate">Associate</MenuItem>
                                <MenuItem value="cold_call">Cold Call</MenuItem>
                                <MenuItem value="email_marketing">
                                  Email Marketing
                                </MenuItem>
                                <MenuItem value="email_marketing">
                                  Existing
                                </MenuItem>
                                <MenuItem value="reference">Reference</MenuItem>
                                <MenuItem value="website">Website</MenuItem>
                              </TextField>
                            )}
                          />
                        )}

                      {enquiry.name === "action" &&
                        enquiry.name !== "enquiry_type" &&
                        enquiry.name !== "sub_type" && (
                          <Controller
                            name="action"
                            control={control}
                            rules={{ required: "Action is required" }}
                            render={({
                              field: controllerField,
                              fieldState,
                            }) => (
                              <TextField
                                {...controllerField}
                                select
                                size="small"
                                value={controllerField.value || ""}
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              >
                                <MenuItem value="" disabled>
                                  --Select--
                                </MenuItem>
                                {Action_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        )}
                      {enquiry.type === "date" && (
                        <Controller
                          name={enquiry.name}
                          disabled={
                            enquiry.name === "last_followup_date"
                              ? isEditMode
                                ? true
                                : isConvertToLead
                                ? true
                                : false
                              : false
                          }
                          control={control}
                          rules={{ required: `${enquiry.label} is required` }}
                          render={({ field: controllerField, fieldState }) => (
                            <TextField
                              {...controllerField}
                              type="date"
                              size="small"
                              value={controllerField.value || null}
                              fullWidth
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      )}
                    </FormControl>
                  </Grid>

                  {enquiry.name === "sub_type" && subType === "Advisory" && (
                    <>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "15px", mt: 1 }}
                        >
                          Advisory <span style={{ color: "red" }}>*</span>
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth>
                          <Controller
                            name="advisory"
                            control={control}
                            rules={{ required: ` Advisory is required` }}
                            render={({
                              field: controllerField,
                              fieldState,
                            }) => (
                              <TextField
                                {...controllerField}
                                select
                                size="small"
                                fullWidth
                                value={controllerField.value || ""}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              >
                                <MenuItem value="" disabled>
                                  --Select--
                                </MenuItem>
                                {data.map((item) => (
                                  <MenuItem
                                    key={item.advisory}
                                    value={item.advisory}
                                  >
                                    {item.advisory}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {enquiry.name === "sub_type" && subType === "Execution" && (
                    <>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: "15px", mt: 1 }}
                        >
                          Execution <span style={{ color: "red" }}>*</span>
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth>
                          <Controller
                            name="execution"
                            control={control}
                            rules={{ required: ` Execution is required` }}
                            render={({
                              field: controllerField,
                              fieldState,
                            }) => (
                              <TextField
                                {...controllerField}
                                select
                                size="small"
                                value={controllerField.value || ""}
                                fullWidth
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              >
                                <MenuItem value="" disabled>
                                  --Select--
                                </MenuItem>
                                {data.map((item) => (
                                  <MenuItem
                                    key={item.execution}
                                    value={item.execution}
                                  >
                                    {item.execution}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
                  {enquiry.name === "sub_type" &&
                    subType === "Operation & Maintenance" && (
                      <>
                        <Grid size={{ xs: 12, md: 3 }}>
                          <Typography
                            variant="body1"
                            sx={{ fontSize: "15px", mt: 1 }}
                          >
                            Operation & maintenance
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                          <FormControl fullWidth>
                            <Controller
                              name="operation_Maintenance"
                              control={control}
                              rules={{ required: `Operation is required` }}
                              render={({
                                field: controllerField,
                                fieldState,
                              }) => (
                                <TextField
                                  {...controllerField}
                                  select
                                  size="small"
                                  fullWidth
                                  value={controllerField.value || ""}
                                  error={!!fieldState.error}
                                  helperText={fieldState.error?.message}
                                >
                                  <MenuItem value="" disabled>
                                    --Select--
                                  </MenuItem>
                                  {data.map((item) => (
                                    <MenuItem
                                      key={item.operation}
                                      value={item.operation}
                                    >
                                      {item.operation}
                                    </MenuItem>
                                  ))}
                                </TextField>
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
                  Confirm
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default EnquiryType;
