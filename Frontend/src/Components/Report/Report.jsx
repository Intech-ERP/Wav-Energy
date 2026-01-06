import {
  Breadcrumbs,
  Button,
  FormControl,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Grid } from "@mui/system";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  data,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useGenerateExcel } from "../../Services/generateExcel.service";
import { showError, showSuccess } from "../../Services/alert";
import Loading from "../Common/Loading";
const reportForm = [
  {
    label: "From date",
    name: "from_date",
    type: "date",
    required: true,
  },
  {
    label: "To date",
    name: "to_date",
    type: "date",
    required: true,
  },
  {
    label: "Menu",
    name: "menu",
    type: "select",
    required: true,
  },
];

const PRODUCT_SUBTYPES = ["Water Heater", "Water Pump", "Street Light"];

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
            // to="/generate-lead"
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
              Report
            </Typography>
          </Link>
        </Breadcrumbs>
      </Box>
    </>
  );
};

const Report = () => {
  const { control, handleSubmit, reset } = useForm();
  const { generateExcel, loading } = useGenerateExcel();
  const menuItem = ["Lead", "Enquiry"];

  const menu = useWatch({
    control,
    name: "menu",
  });

  const enquiryType = useWatch({
    control,
    name: "enquiry_type",
  });

  console.log("menu", menu);

  const handleSubmitData = async (data) => {
    console.log("data", data);
    const response = generateExcel(data);
    if (response) {
      reset({ menu: "", from_date: "", to_date: "" });
    }
  };
  return (
    <Box sx={{ position: "relative" }}>
      <Header />
      <Box sx={{ mt: 2, background: "#fff", p: 2 }}>
        <Box component={"form"} onSubmit={handleSubmit(handleSubmitData)}>
          <Grid container spacing={2}>
            {reportForm.map((item, index) => (
              <React.Fragment key={index}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography variant="body1" sx={{ fontSize: "15px", mt: 1 }}>
                    {item.label}{" "}
                    {item.required && <span style={{ color: "red" }}>*</span>}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth>
                    {item.name !== "menu" && (
                      <Controller
                        name={item.name}
                        control={control}
                        rules={{
                          required: item.required
                            ? `${item.label} is required`
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
                    {item.name === "menu" && (
                      <Controller
                        name={item.name}
                        control={control}
                        rules={{
                          required: item.required
                            ? `${item.label} is required`
                            : false,
                        }}
                        render={({ field: controllerField, fieldState }) => (
                          <TextField
                            {...controllerField}
                            select
                            size="small"
                            value={controllerField.value || ""}
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          >
                            <MenuItem disabled value="">
                              --- Select ---
                            </MenuItem>
                            {menuItem.map((menu, index) => (
                              <MenuItem value={menu} key={index}>
                                {menu}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    )}
                  </FormControl>
                </Grid>
                {item.name === "menu" && menu === "Enquiry" && (
                  <>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "15px", mt: 1 }}
                      >
                        Enquiry Type <span style={{ color: "red" }}>*</span>
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
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
                    </Grid>
                  </>
                )}
                {/* {item.name == "menu" && enquiryType === "Product" && (
                  <>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "15px", mt: 1 }}
                      >
                        Sub Type <span style={{ color: "red" }}>*</span>
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Controller
                        name="sub_type"
                        control={control}
                        rules={{ required: "Sub type is required" }}
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
                            {PRODUCT_SUBTYPES.map((type, index) => (
                              <MenuItem key={index} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Grid>
                  </>
                )} */}
              </React.Fragment>
            ))}
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
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
      </Box>
      {loading && <Loading />}
    </Box>
  );
};

export default Report;
