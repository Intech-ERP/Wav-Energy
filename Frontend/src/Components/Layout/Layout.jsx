import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Box } from "@mui/material";
import Header from "../Navbar/Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <Navbar sidebarOpen={sidebarOpen} setSidebar={setSidebarOpen} />
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 65px)",
          overflowX: "hidden",
        }}
      >
        <Header sidebarOpen={sidebarOpen} />
        <Box
          component={"main"}
          sx={{ flexGrow: 1, p: 2, minWidth: 0, overflowX: "hidden" }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Layout;
