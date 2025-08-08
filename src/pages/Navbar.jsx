// components/Navbar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Event Create", path: "/event-create" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "RSVP", path: "/rsvp" },
  ];

  const drawer = (
    <Box sx={{ width: 260 }}>
      {/* Drawer Header with Close Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          backgroundColor: "#f5f5dc",
        }}
      >
        <Typography variant="h6" sx={{ color: "#8B5E3C", fontWeight: "bold" }}>
          Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon sx={{ color: "#8B5E3C" }} />
        </IconButton>
      </Box>

      <Divider />

      {/* Navigation Links */}
      <List>
        {navLinks.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              "&:hover": { backgroundColor: "rgba(139,94,60,0.1)" },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Profile Option */}
      <ListItem
        button
        component={Link}
        to="/profile"
        onClick={handleDrawerToggle}
        sx={{
          "&:hover": { backgroundColor: "rgba(139,94,60,0.1)" },
        }}
      >
        <ListItemText primary="Profile" />
      </ListItem>
    </Box>
  );

  return (
    <>
      {/* Global background */}
      <style>
        {`
          body {
            background-color: #f5f5dc;
            margin: 0;
            font-family: 'Roboto', sans-serif;
          }
        `}
      </style>

      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #8B5E3C, #D2B48C)",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Brand */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            style={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Event Manager
          </Typography>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
            {navLinks.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: "white",
                  textTransform: "none",
                  borderRadius: "20px",
                  px: 2,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
            <IconButton
              component={Link}
              to="/profile"
              sx={{
                p: 0,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: "#8B5E3C",
                  width: 36,
                  height: 36,
                }}
              >
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center" }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": { backgroundColor: "#fff" },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
