import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";

import StepDetails from "../components/EventWizard/StepDetails";
import StepLocation from "../components/EventWizard/StepLocation";
import StepDateTime from "../components/EventWizard/StepDateTime";
import StepMedia from "../components/EventWizard/StepMedia";
import StepReview from "../components/EventWizard/StepReview";

import { EventContext } from "../context/EventContext";

const steps = ["Event Details", "Location", "Date & Time", "Media Upload", "Review & Submit"];

export default function EventCreationPage() {
  const { addEvent } = useContext(EventContext);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    lat: null,
    lng: null,
    date: dayjs(),
    time: dayjs(),
    media: [],
    type: "public", // default
    attendees: 0
  });

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // ✅ Generate unique id
      const newId = Date.now();

      addEvent({
        ...formData,
        id: newId,
        link: `/event/${newId}`
      });

      // Reset form for next creation
      setFormData({
        title: "",
        description: "",
        location: "",
        lat: null,
        lng: null,
        date: dayjs(),
        time: dayjs(),
        media: [],
        type: "public",
        attendees: 0
      });

      setActiveStep(0);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5dc", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#5c4033" }}>
        Create New Event
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        {activeStep === 0 && <StepDetails formData={formData} setFormData={setFormData} />}
        {activeStep === 1 && <StepLocation formData={formData} setFormData={setFormData} />}
        {activeStep === 2 && <StepDateTime formData={formData} setFormData={setFormData} />}
        {activeStep === 3 && <StepMedia formData={formData} setFormData={setFormData} />}
        {activeStep === 4 && <StepReview formData={formData} />}
      </Paper>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
        <IconButton onClick={handleBack} disabled={activeStep === 0}>
          <ArrowBackIcon />
        </IconButton>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#8B5E3C",
            "&:hover": { backgroundColor: "#70422a" }
          }}
          onClick={handleNext}
        >
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}
