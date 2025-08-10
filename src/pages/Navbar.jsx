// src/components/Navbar.jsx
import React, { useState, useMemo } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Avatar, Drawer, List, ListItem,
  ListItemText, Divider
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/AuthContext";
import AccountCircle from "@mui/icons-material/AccountCircle";

// Safe import for listEvents
let listEvents = () => [];
try {
  listEvents = require("../lib/mockdb").listEvents || (() => []);
} catch (err) {
  console.warn("mockdb not found, using empty event list");
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    logOut();
    navigate("/signin");
  };
  const goToProfile = () => navigate("/profile");

  // Get first available event for RSVP
  const nextEventId = useMemo(() => {
    try {
      const events = listEvents();
      console.log("Events from mockdb:", events);
      return events?.length > 0 ? events[0].id : null;
    } catch {
      return null;
    }
  }, []);

  // Navigation links
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Event Create", path: "/event-create" }
  ];

  // Drawer menu for mobile
  const drawer = (
    <Box sx={{ width: 260 }}>
      <Box
        sx={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          px: 2, py: 1, backgroundColor: "#f5f5dc",
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
      <List>
        {navLinks.map((item) => (
          <ListItem
            button key={item.path} component={Link} to={item.path}
            onClick={handleDrawerToggle}
            sx={{ "&:hover": { backgroundColor: "rgba(139,94,60,0.1)" } }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem
          button
          component={Link}
          to={nextEventId ? `/rsvp/${nextEventId}` : "/rsvp"}
          onClick={handleDrawerToggle}
          sx={{ "&:hover": { backgroundColor: "rgba(139,94,60,0.1)" } }}
        >
          <ListItemText primary="RSVP" />
        </ListItem>
      </List>
      <Divider />
      {currentUser ? (
        <>
          <ListItem
            button onClick={() => { goToProfile(); handleDrawerToggle(); }}
            sx={{ "&:hover": { backgroundColor: "rgba(139,94,60,0.1)" } }}
          >
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem
            button onClick={() => { handleLogout(); handleDrawerToggle(); }}
            sx={{ "&:hover": { backgroundColor: "rgba(255,0,0,0.1)" } }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button component={Link} to="/signin" onClick={handleDrawerToggle}>
            <ListItemText primary="Sign In" />
          </ListItem>
          <ListItem button component={Link} to="/signup" onClick={handleDrawerToggle}>
            <ListItemText primary="Sign Up" />
          </ListItem>
        </>
      )}
    </Box>
  );

  // Hide navbar on auth pages
  if (location.pathname === "/signin" || location.pathname === "/signup") {
    return null;
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #8B5E3C, #D2B48C)",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6" component={Link} to="/"
            style={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
          >
            Event Manager
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
            {navLinks.map((item) => (
              <Button
                key={item.path} component={Link} to={item.path}
                sx={{
                  color: "white", textTransform: "none", borderRadius: "20px", px: 2,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              component={Link}
              to={nextEventId ? `/rsvp/${nextEventId}` : "/rsvp"}
              sx={{
                color: "white", textTransform: "none", borderRadius: "20px", px: 2,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
              }}
            >
              RSVP
            </Button>
            {currentUser ? (
              <>
                <IconButton onClick={goToProfile} sx={{ p: 0 }}>
                  <Avatar
                    src={currentUser.photoURL || ""}
                    sx={{ bgcolor: "white", color: "#8B5E3C", width: 36, height: 36 }}
                  >
                    {!currentUser.photoURL && <AccountCircle />}
                  </Avatar>
                </IconButton>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/signin">Sign In</Button>
                <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center" }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right" open={mobileOpen} onClose={handleDrawerToggle}
        sx={{ "& .MuiDrawer-paper": { backgroundColor: "#fff" } }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Navbar;
