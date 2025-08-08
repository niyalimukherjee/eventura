import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import dayjs from "dayjs";
import { EventContext } from "../context/EventContext";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useContext(EventContext);

  const event = events.find((e) => e.id.toString() === id);

  if (!event) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Event not found</Typography>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5dc", minHeight: "100vh" }}>
      <Typography variant="h3" fontWeight="bold" sx={{ color: "#5c4033" }}>
        {event.title}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {event.description}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Date: {dayjs(event.date).format("MMM D, YYYY")} <br />
        Time: {dayjs(event.time).format("h:mm A")}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Location: {event.location}
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#8B5E3C", "&:hover": { backgroundColor: "#70422a" } }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
}
