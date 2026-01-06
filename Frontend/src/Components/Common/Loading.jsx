import React from "react";
import { Box, Typography } from "@mui/material";
import loading from "../../assets/Loading1.gif";

const Loading = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300, // higher than MUI dialogs
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#fff",
          borderRadius: 1,
          px: 4,
          py: 2,
          boxShadow: 2,
        }}
      >
        <Box
          component="img"
          src={loading}
          alt="Loading"
          sx={{ width: 30, height: 30 }}
        />
        <Typography fontWeight={500}>Downloading...</Typography>
      </Box>
    </Box>
  );
};

export default Loading;
