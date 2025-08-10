import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  IconButton,
  Tooltip
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getEvent, listInvites } from "../../lib/mockdb";
import RsvpDashboard from "./RsvpDashboard";

export default function RsvpPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [invites, setInvites] = useState([]);

  const loadEvent = () => {
    const ev = getEvent(eventId);
    setEvent(ev || null);
    setInvites(listInvites(eventId));
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  // Listen for event detail updates
  useEffect(() => {
    const eventHandler = (e) => {
      if (e.detail?.eventId === eventId) {
        loadEvent();
      }
    };
    window.addEventListener("event-updated", eventHandler);
    return () => window.removeEventListener("event-updated", eventHandler);
  }, [eventId]);

  // Listen for RSVP / invite updates
  useEffect(() => {
    const inviteHandler = (e) => {
      if (e.detail?.eventId === eventId) {
        setInvites(listInvites(eventId));
      }
    };
    window.addEventListener("invite-updated", inviteHandler);
    return () => window.removeEventListener("invite-updated", inviteHandler);
  }, [eventId]);

  if (!event) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Event not found or deleted.
        </Typography>
        <Button variant="outlined" onClick={() => window.history.back()}>
          Back to Events
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {event.title || event.name || "Untitled Event"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {event.date
                ? new Date(event.date).toLocaleString()
                : "No date set"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Location: {event.location || "Location not specified"}
            </Typography>
          </Box>
          <Tooltip title="Refresh Event Data">
            <IconButton onClick={loadEvent}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button variant="outlined" onClick={() => window.history.back()}>
          Back to Events
        </Button>
      </Paper>

      {/* RSVP Dashboard */}
      <RsvpDashboard eventId={eventId} invites={invites} />
    </Box>
  );
}
