import React from "react";
import { Box, Typography } from "@mui/material";

export default function StepReview({ formData }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Review Event Details</Typography>
      <Typography><b>Title:</b> {formData.title}</Typography>
      <Typography><b>Description:</b> {formData.description}</Typography>
      <Typography><b>Location:</b> {formData.location}</Typography>
      <Typography>
        <b>Date & Time:</b> {formData.date.format("MMM D, YYYY")} at {formData.time.format("h:mm A")}
      </Typography>
      <Typography><b>Media Files:</b> {formData.media.length} uploaded</Typography>
    </Box>
  );
}
