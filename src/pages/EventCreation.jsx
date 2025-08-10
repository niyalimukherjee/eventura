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

// ✅ Ant Design imports
import { Tour } from "antd";
import "antd/dist/reset.css";

const steps = ["Event Details", "Location", "Date & Time", "Media Upload", "Review & Submit"];

export default function EventCreationPage() {
  const { addEvent } = useContext(EventContext);
  const [activeStep, setActiveStep] = useState(0);
  const [tourOpen, setTourOpen] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      const newId = Date.now();
      addEvent({
        ...formData,
        id: newId,
        link: `/event/${newId}`
      });

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

  // ✅ Tour steps for Event Creation
  const tourSteps = [
    {
      title: "Event Details",
      description: "Start by entering the name, description, and type of event.",
      target: () => document.querySelector("#step-details")
    },
    {
      title: "Location",
      description: "Provide the event location and optional map coordinates.",
      target: () => document.querySelector("#step-location")
    },
    {
      title: "Date & Time",
      description: "Select when your event will take place.",
      target: () => document.querySelector("#step-datetime")
    },
    {
      title: "Media Upload",
      description: "Add images or videos to make your event stand out.",
      target: () => document.querySelector("#step-media")
    },
    {
      title: "Review & Submit",
      description: "Check your event details and submit when ready.",
      target: () => document.querySelector("#step-review")
    }
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f5dc", minHeight: "100vh" }}>
      {/* Tour Start Button */}
      <Button
        variant="outlined"
        sx={{ mb: 2, borderColor: "#8B5E3C", color: "#8B5E3C" }}
        onClick={() => setTourOpen(true)}
      >
        Start Tour
      </Button>

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
        {activeStep === 0 && <div id="step-details"><StepDetails formData={formData} setFormData={setFormData} /></div>}
        {activeStep === 1 && <div id="step-location"><StepLocation formData={formData} setFormData={setFormData} /></div>}
        {activeStep === 2 && <div id="step-datetime"><StepDateTime formData={formData} setFormData={setFormData} /></div>}
        {activeStep === 3 && <div id="step-media"><StepMedia formData={formData} setFormData={setFormData} /></div>}
        {activeStep === 4 && <div id="step-review"><StepReview formData={formData} /></div>}
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

      {/* Ant Design Tour */}
      <Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={tourSteps} />
    </Box>
  );
}
