import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function StepMedia({ formData, setFormData }) {
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, media: [...formData.media, ...files] });
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{
          border: "2px dashed #8B5E3C",
          backgroundColor: "#fff8dc",
          "&:hover": { backgroundColor: "#f5deb3" }
        }}
      >
        Drag & Drop or Click to Upload
        <input
          type="file"
          hidden
          multiple
          onChange={handleMediaUpload}
        />
      </Button>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
        {formData.media.map((file, index) => (
          <Paper
            key={index}
            sx={{
              p: 1,
              border: "1px solid #ccc",
              borderRadius: 1,
              backgroundColor: "white"
            }}
          >
            <Typography variant="body2">{file.name}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
