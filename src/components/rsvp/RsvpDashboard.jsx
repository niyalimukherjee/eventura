import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Select,
  MenuItem,
  TextField,
  Button
} from "@mui/material";
import {
  setInviteStatus,
  getEvent,
  upsertEvent
} from "../../lib/mockdb";
import { Tour } from "antd";

export default function RsvpDashboard({ eventId, invites = [] }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reminderDays, setReminderDays] = useState(7);
  const [reminders, setReminders] = useState([]);
  const [openTour, setOpenTour] = useState(false);

  // Tour refs
  const countersRef = useRef(null);
  const filterRef = useRef(null);
  const inviteListRef = useRef(null);
  const reminderRef = useRef(null);

  useEffect(() => {
    const ev = getEvent(eventId);
    if (ev?.reminders) {
      setReminders(ev.reminders);
    } else {
      setReminders([]);
    }
  }, [eventId]);

  const handleStatusChange = (userId, status) => {
    setInviteStatus(eventId, userId, status);
  };

  const handleAddReminder = () => {
    const days = parseInt(reminderDays, 10);
    if (isNaN(days) || days < 0) {
      alert("Please enter a valid number of days.");
      return;
    }

    const eventDoc = getEvent(eventId);
    if (!eventDoc) {
      alert("Event not found.");
      return;
    }

    if (!Array.isArray(eventDoc.reminders)) {
      eventDoc.reminders = [];
    }

    if (eventDoc.reminders.some((r) => r.offsetDays === days)) {
      alert(`Reminder for ${days} days before already exists.`);
      return;
    }

    eventDoc.reminders.push({ offsetDays: days });
    upsertEvent(eventDoc);
    setReminders(eventDoc.reminders);

    alert(`Reminder added for ${days} days before the event.`);
  };

  const statusColors = {
    going: "success",
    maybe: "warning",
    pending: "default",
    declined: "error"
  };

  const statusCounts = useMemo(() => {
    return (invites || []).reduce(
      (acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      },
      { going: 0, maybe: 0, pending: 0, declined: 0 }
    );
  }, [invites]);

  const sortedFilteredInvites = useMemo(() => {
    const order = { going: 1, maybe: 2, pending: 3, declined: 4 };
    return (invites || [])
      .filter((inv) =>
        filterStatus === "all" ? true : inv.status === filterStatus
      )
      .filter((inv) =>
        `${inv.name} ${inv.email}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
      .sort(
        (a, b) => (order[a.status] || 99) - (order[b.status] || 99)
      );
  }, [invites, filterStatus, searchQuery]);

  const steps = [
    {
      title: "RSVP Status Overview",
      description: "See how many people are going, maybe, pending, or declined.",
      target: () => countersRef.current
    },
    {
      title: "Filters & Search",
      description: "Filter by RSVP status or search by name/email.",
      target: () => filterRef.current
    },
    {
      title: "Invite List",
      description: "Manage each invitee's RSVP status using the dropdown menu.",
      target: () => inviteListRef.current
    },
    {
      title: "Automated Reminders",
      description: "Set reminders to automatically notify pending invitees before the event.",
      target: () => reminderRef.current
    }
  ];

  return (
    <>
      <Paper sx={{ p: 3 }}>
        {/* Status counters */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2 }}
          ref={countersRef}
        >
          <Chip label={`Going: ${statusCounts.going}`} color="success" />
          <Chip label={`Maybe: ${statusCounts.maybe}`} color="warning" />
          <Chip label={`Pending: ${statusCounts.pending}`} />
          <Chip label={`Declined: ${statusCounts.declined}`} color="error" />
        </Stack>

        {/* Filter + Search */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2, flexWrap: "wrap" }}
          ref={filterRef}
        >
          <Select
            size="small"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="going">Going</MenuItem>
            <MenuItem value="maybe">Maybe</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="declined">Declined</MenuItem>
          </Select>
          <TextField
            size="small"
            placeholder="Search name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 200 }}
          />
        </Stack>

        {/* Invite List */}
        <Box ref={inviteListRef}>
          {sortedFilteredInvites.length === 0 ? (
            <Typography color="text.secondary">No invitees found.</Typography>
          ) : (
            <Stack spacing={2}>
              {sortedFilteredInvites.map((invite) => (
                <Paper
                  key={invite.userId}
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1
                  }}
                >
                  <Box>
                    <Typography fontWeight="bold">{invite.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {invite.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={invite.status}
                      color={statusColors[invite.status] || "default"}
                      size="small"
                    />
                    <Select
                      value={invite.status}
                      size="small"
                      onChange={(e) =>
                        handleStatusChange(invite.userId, e.target.value)
                      }
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="going">Going</MenuItem>
                      <MenuItem value="maybe">Maybe</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="declined">Declined</MenuItem>
                    </Select>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        {/* Automated Reminders */}
        <Box sx={{ mt: 4 }} ref={reminderRef}>
          <Typography variant="h6" gutterBottom>
            Automated Reminders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Remind pending invitees before the event starts.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <TextField
              type="number"
              size="small"
              label="Days before"
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
              sx={{ width: 150 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddReminder}>
              Add Reminder
            </Button>
          </Stack>
          {reminders.length > 0 && (
            <Stack spacing={1} sx={{ mt: 2 }}>
              {reminders.map((r, idx) => (
                <Chip
                  key={idx}
                  label={`Reminder: ${r.offsetDays} days before`}
                  color="info"
                />
              ))}
            </Stack>
          )}
        </Box>
      </Paper>

      {/* Tour Trigger */}
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => setOpenTour(true)}
      >
        Start Tour
      </Button>

      <Tour
        open={openTour}
        onClose={() => setOpenTour(false)}
        steps={steps}
      />
    </>
  );
}
