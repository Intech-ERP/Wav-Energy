import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import logo from "../../assets/logo.png";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Navbar = ({ sidebarOpen, setSidebar }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "#fff",
          color: "black",
          borderBottom: "1px solid #e9e9e9",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Box component="img" src={logo} sx={{ height: 30 }} />

            <IconButton
              color="default"
              sx={{
                "&:hover": { backgroundColor: "transparent" },
              }}
              onClick={() => setSidebar((prev) => !prev)}
            >
              {sidebarOpen ? <ArrowCircleRightIcon /> : <ArrowCircleLeftIcon />}
            </IconButton>
          </Box>

          <IconButton
            color="default"
            sx={{
              "&:hover": { backgroundColor: "transparent" },
            }}
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
