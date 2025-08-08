import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function StepDateTime({ formData, setFormData }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2 }}>
        <DatePicker
          label="Event Date"
          value={formData.date}
          onChange={(newValue) => setFormData({ ...formData, date: newValue })}
        />
        <TimePicker
          label="Event Time"
          value={formData.time}
          onChange={(newValue) => setFormData({ ...formData, time: newValue })}
        />
      </Box>
    </LocalizationProvider>
  );
}
