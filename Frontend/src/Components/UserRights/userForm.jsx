import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Grid } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { userForm } from "../Config/UserForm";
import { Controller, useForm, useWatch } from "react-hook-form";
import { addUser, updateUser } from "../../Services/user.service";
import { showSuccess } from "../../Services/alert";

const MENU_ACCESS_MAP = [
  {
    type: "Lead",
    access: "Full Access",
  },
  {
    type: "Enquiry",
    access: "Full Access",
  },
  {
    type: "Address Book",
    access: "Full Access",
  },
  {
    type: "Lead Master",
    access: "Full Access",
  },
  {
    type: "Report",
    access: "Full Access",
  },
  {
    type: "User Rights",
    access: "Full Access",
  },
];

const UserForm = ({ openForm, onClose, editRow }) => {
  const isEdit = Boolean(editRow);
  console.log("isEdit", isEdit);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      user_name: "",
      employee_id: "",
      menu: [],
      rights: {},
    },
  });
  const menu = useWatch({
    control,
    name: "menu",
  });

  const onSubmit = async (data) => {
    console.log("user data", data);
    const response = await addUser(data);
    if (response.success) {
      showSuccess(response?.message);
      onClose();
      reset();
    }
  };

  const handleUpdate = async (data) => {
    console.log("data", data);
    const response = await updateUser(editRow.user_id, data);
    if (response.success) {
      showSuccess(response?.message);
      handleClose();
      reset({ user_name: "", employee_id: "", menu: [], rights: {} });
    }
  };

  useEffect(() => {
    if (isEdit) {
      const rightsObj = {};

      editRow.menu?.forEach((item) => {
        rightsObj[item.name] = item?.access;
      });

      reset({
        user_name: editRow.user,
        employee_id: editRow.emp_id,
        menu: editRow?.menu?.map((item) => item.name),
        rights: rightsObj,
      });
    }
  }, [isEdit, editRow, open]);

  const handleClose = () => {
    onClose();
    reset({ user_name: "", employee_id: "", menu: [], rights: {} });
  };
  return (
    <>
      <Box>
        <Dialog
          open={openForm}
          PaperProps={{
            sx: {
              width: 1200,
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
              {isEdit ? "Edit user" : "Add user"}
            </Typography>
            <IconButton sx={{ ml: 2 }} onClick={handleClose}>
              <CloseIcon sx={{ color: "#0072BC" }} />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box
              component="form"
              onSubmit={handleSubmit(isEdit ? handleUpdate : onSubmit)}
            >
              <Grid container spacing={3} columns={12}>
                {/* userForm fields */}
                {userForm.map((user, index) => (
                  <React.Fragment key={user.name ?? index}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "15px", mt: 1 }}
                      >
                        {user.label}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <Controller
                        name={user.name}
                        control={control}
                        rules={{ required: `${user.label} is required` }}
                        render={({ field: controllerField, fieldState }) => (
                          <TextField
                            {...controllerField}
                            type={
                              user.name === "employee_id" ? "number" : "text"
                            }
                            value={controllerField.value || ""}
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>
                  </React.Fragment>
                ))}

                {/* Menu multi-select */}
                <React.Fragment>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "15px", mt: 1 }}
                    >
                      Menu
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }} sx={{ mb: 1 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <Controller
                        name="menu"
                        control={control}
                        rules={{
                          validate: (value) =>
                            (value && value.length > 0) || "Menu is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            multiple
                            size="small"
                            displayEmpty
                            value={field.value || []}
                            renderValue={(selected) =>
                              selected?.length
                                ? selected.join(", ")
                                : "Select Menu"
                            }
                          >
                            {MENU_ACCESS_MAP?.map((opt) => (
                              <MenuItem key={opt.type} value={opt.type}>
                                <Checkbox
                                  checked={field.value?.includes(opt.type)}
                                />
                                <ListItemText primary={opt.type} />
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </React.Fragment>

                {menu?.map((item, index) => (
                  <React.Fragment key={item}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: "15px", mt: 1 }}
                      >
                        {item}
                      </Typography>
                    </Grid>

                    <Grid
                      size={{ xs: 12, md: 3 }}
                      sx={{
                        border: "1px solid #c4c4c4",
                        borderRadius: 2,
                        p: 1,
                      }}
                    >
                      <Controller
                        name={`rights.${item}`}
                        control={control}
                        rules={{ required: "Access type is required" }}
                        render={({ field, fieldState }) => (
                          // <FormControl
                          //   error={!!fieldState.error}
                          //   sx={{ display: "flex", border: "1px solid black" }}
                          // >

                          // </FormControl>
                          <>
                            <RadioGroup
                              row
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              sx={{
                                width: "245px",
                              }}
                            >
                              <FormControlLabel
                                value="full"
                                control={<Radio size="small" />}
                                label="Full access"
                              />
                              <FormControlLabel
                                value="show"
                                control={<Radio size="small" />}
                                label="Show only"
                              />
                            </RadioGroup>

                            {fieldState.error && (
                              <FormHelperText sx={{ color: "red" }}>
                                {fieldState.error.message}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      />
                    </Grid>
                  </React.Fragment>
                ))}

                {/* Submit */}
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
      </Box>
    </>
  );
};

export default UserForm;
