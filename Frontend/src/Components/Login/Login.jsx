import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import logo from "../../assets/logo.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../Services/alert";
import { login } from "../../Services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!loginData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      // const user = await login(loginData);

      //save user info
      // localStorage.setItem("user", JSON.stringify(user));
      showSuccess("Login successful!");
      navigate("/cold-call");
    } catch (error) {
      showError("Login failed. username or password is inValid.");
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          border: "1px solid #e9e9e9",
          p: 4,
          width: 430,
          background: "#fff",
          borderRadius: 3,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{ height: 40, display: "block", margin: "0 auto", mb: 3 }}
        />

        {/* Login Form */}
        <FormControl fullWidth>
          <FormLabel sx={{ mb: 1, fontSize: 14 }}>Username</FormLabel>
          <TextField
            size="small"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            fullWidth
          />

          <FormLabel sx={{ mt: 2, mb: 1, fontSize: 14 }}>Password</FormLabel>
          <TextField
            size="small"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 4, borderRadius: 1, py: 1.2, textTransform: "none" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Login;
