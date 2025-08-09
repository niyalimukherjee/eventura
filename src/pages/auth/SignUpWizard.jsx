import React, { useState } from "react";
import { Box, Button, Stepper, Step, StepLabel, Paper } from "@mui/material";
import AccountStep from "../auth/AccountStep";
import ProfileStep from "../auth/ProfileStep";
import PreferencesStep from "../auth/PreferencesStep";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const steps = ["Account Setup", "Profile Info", "Preferences"];

export default function SignUpWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      try {
        await signUp(formData.email, formData.password, {
          fullName: formData.fullName,
          profilePic: formData.profilePic
        });
        navigate("/dashboard");
      } catch (error) {
        alert(error.message);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const updateData = (newData) => setFormData((prev) => ({ ...prev, ...newData }));

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && <AccountStep data={formData} onChange={updateData} />}
        {activeStep === 1 && <ProfileStep data={formData} onChange={updateData} />}
        {activeStep === 2 && <PreferencesStep data={formData} onChange={updateData} />}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </Paper>
  );
}
