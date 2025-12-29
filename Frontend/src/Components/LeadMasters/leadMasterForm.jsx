import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid } from "@mui/system";
import { useForm } from "react-hook-form";
import {
  addLeadMaster,
  updateLeadMaster,
} from "../../Services/leadMaster.service";
import { showError, showSuccess } from "../../Services/alert";
import { useFetchData } from "../../Hooks/useFetchData";

const LeadMasterForm = ({
  open,
  onClose,
  tabValue,
  setIsAdvisoryAdded,
  editData,
}) => {
  const idField = `${tabValue}_id`;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      [tabValue]: "",
      [idField]: "",
    },
  });

  console.log("edited data", editData);

  const handleSubmitData = async (data) => {
    console.log("submitted data", data);
    try {
      const response = await addLeadMaster(tabValue, data);
      if (response.success) {
        reset();
        showSuccess(`${tabValue} Added Successfully!`);
        onClose();
        setIsAdvisoryAdded();
      }
    } catch (error) {
      console.error(`Error Adding ${tabValue}`, error);
    }
  };
  const handleUpdateData = async (data) => {
    console.log("update data", data);
    try {
      const response = await updateLeadMaster(data, tabValue);
      if (response.success) {
        showSuccess(`${tabValue} data Updated Successfully!`);
        reset();
        onClose();
        setIsAdvisoryAdded();
      } else if (response.success === false) {
        showError(response.message || "Update failed");
      }
    } catch (error) {
      console.error("error Update", error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  useEffect(() => {
    if (open && editData) {
      reset({
        [tabValue]: editData[tabValue] || "",
        [idField]: editData[idField] || editData[`${tabValue}_id`] || "",
      });
    } else if (open) {
      reset({
        [tabValue]: "",
        // [idField]: "",
      });
    }
  }, [editData, open, tabValue, reset, idField]);
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 500,
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
            {`${tabValue}`}
          </Typography>
          <IconButton sx={{ ml: 2 }} onClick={handleClose}>
            <CloseIcon sx={{ color: "#0072BC" }} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            component={"form"}
            onSubmit={handleSubmit(
              editData ? handleUpdateData : handleSubmitData
            )}
          >
            <Grid container>
              <Grid size={{ xs: 12 }} sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ fontSize: "15px" }}>
                  {`Add ${tabValue}`}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <TextField
                    name={tabValue}
                    type="text"
                    size="small"
                    {...register(tabValue, {
                      required: `${tabValue} is required`,
                    })}
                    error={!!errors?.[tabValue]}
                    helperText={errors?.[tabValue]?.message}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
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
                    {editData ? "Update" : "Submit"}
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

export default LeadMasterForm;
