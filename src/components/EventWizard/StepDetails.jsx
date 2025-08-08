import React from "react";
import { Box, TextField } from "@mui/material";

export default function StepDetails({ formData, setFormData }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Event Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        fullWidth
      />
      <TextField
        label="Event Description"
        multiline
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        fullWidth
      />
    </Box>
  );
}
