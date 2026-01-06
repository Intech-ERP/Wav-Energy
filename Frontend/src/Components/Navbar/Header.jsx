import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { Link, NavLink } from "react-router-dom";

const AvatarStyle = {
  width: 56,
  height: 56,
  bgcolor: "#e0e0e0",
  fontWeight: 600,
  color: "black",
};

const Header = ({ sidebarOpen }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const initial = user?.user.slice(0, 1).toUpperCase();
  const menuItems = [
    { label: "Lead", path: "/lead" },
    { label: "Enquiry", path: "/enquiry" },
    { label: "Address Book", path: "/address-book" },
    { label: "Lead Master", path: "/lead-master" },
    { label: "Report", path: "/report" },
    { label: "User Rights", path: "/user-rights" },
  ];

  const allowedMenus = menuItems.filter((item) =>
    user?.menu?.some(
      (m) => m.name === item.label && ["show", "full"].includes(m.access)
    )
  );

  const containerStyle = {
    borderRight: "1px solid #e9e9e9",
    width: sidebarOpen ? "240px" : "0px",
    transition: "0.3s ease width",
    overflow: "hidden",
    flexShrink: 0,
    background: "#ffff",
  };
  return (
    <>
      <Box component="aside" sx={containerStyle}>
        <Box
          sx={{
            width: "100%",
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid #e9e9e9",
          }}
        >
          <Avatar sx={AvatarStyle}>
            <Typography variant="body2">{initial}</Typography>
          </Avatar>

          <Box>
            <Typography variant="body1">{user.user}</Typography>
            <Typography variant="body2" color="text.secondary">
              Emp:{user.emp_id}
            </Typography>
          </Box>
        </Box>

        <List sx={{ p: 0 }}>
          {allowedMenus.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  p: 2,
                  borderBottom: "1px solid #e9e9e9",
                  "&.active": {
                    color: "#009EFB",
                    backgroundColor: "#F4F7FC",
                    fontWeight: 600,
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    opacity: sidebarOpen ? 1 : 0,
                    transition: "opacity 0.2s",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
};

export default Header;
