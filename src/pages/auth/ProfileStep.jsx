import React from "react";
import { TextField, Box, Avatar, Button } from "@mui/material";

export default function ProfileStep({ data, onChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange({ profilePic: URL.createObjectURL(file) });
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Full Name"
        margin="normal"
        value={data.fullName || ""}
        onChange={(e) => onChange({ fullName: e.target.value })}
      />

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Avatar
          src={data.profilePic || ""}
          sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
        />
        <Button variant="outlined" component="label">
          Upload Picture
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
      </Box>
    </Box>
  );
}
