// src/pages/ProfilePage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Divider,
  Button
} from "@mui/material";

export default function ProfilePage() {
  const { currentUser } = useAuth();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card
        sx={{
          p: 3,
          boxShadow: 3,
          borderRadius: 3,
          background: "linear-gradient(180deg, #fff8f0, #fcefdc)"
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            src={currentUser?.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#8B5E3C",
              fontSize: "2rem",
              color: "white"
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#8B5E3C" }}>
            My Profile
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {currentUser ? (
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Name:</strong> {currentUser.displayName || "Not provided"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {currentUser.email}
            </Typography>
           
          </CardContent>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            No user data found.
          </Typography>
        )}
      </Card>
    </Container>
  );
}
