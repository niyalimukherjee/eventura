// src/components/AppTour.jsx
import React, { useState } from "react";
import { Tour, Button } from "antd";
import "antd/dist/reset.css";

export default function AppTour({ page }) {
  const [open, setOpen] = useState(false);

  // Different tour steps for each page
  const steps = {
    home: [
      {
        title: "Welcome to Home Page",
        description: "Here you can see an overview of your events.",
        target: () => document.querySelector("#home-overview")
      },
      {
        title: "Quick Navigation",
        description: "Use this section to quickly navigate to different parts.",
        target: () => document.querySelector("#home-nav")
      }
    ],
    eventCreate: [
      {
        title: "Step 1: Fill Details",
        description: "Provide event name, description, and other details here.",
        target: () => document.querySelector("#event-details")
      },
      {
        title: "Step 2: Save Event",
        description: "Once done, click here to save the event.",
        target: () => document.querySelector("#event-save")
      }
    ]
  };

  return (
    <>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Start Tour
      </Button>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps[page] || []}
      />
    </>
  );
}
