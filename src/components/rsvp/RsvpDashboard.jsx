import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  MenuItem,
  Select,
  TextField,
  IconButton,
  Stack,
  Paper,
  Checkbox,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DoneIcon from "@mui/icons-material/Done";
import { listInvites, setInviteStatus } from "../../lib/mockdb"; // adjust path if needed
import ReminderScheduler from "./ReminderScheduler";

/**
 * Props:
 *  - eventId (string) : id of event to show RSVPs for
 */
export default function RsvpDashboard({ eventId }) {
  const [invites, setInvites] = useState([]);
  const [filter, setFilter] = useState("all"); // all / pending / going / maybe / not-going
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [eventId]);

  function load() {
    const arr = listInvites(eventId) || [];
    setInvites(arr);
    setSelected({});
  }

  const counts = useMemo(() => {
    const c = { going: 0, maybe: 0, "not-going": 0, pending: 0 };
    (invites || []).forEach((i) => {
      c[i.status] = (c[i.status] || 0) + 1;
    });
    return c;
  }, [invites]);

  const visible = invites.filter((it) => {
    if (filter !== "all" && it.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (it.name || "").toLowerCase().includes(s) ||
      (it.email || "").toLowerCase().includes(s)
    );
  });

  function toggleSelect(id) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function bulkSetStatus(status) {
    const ids = Object.entries(selected).filter(([,v])=>v).map(([k])=>k);
    ids.forEach((id) => setInviteStatus(eventId, id, status));
    load();
  }

  function resendReminders(ids) {
    // Trigger the reminder sending flow via local runner (or directly simulate)
    // We'll use a custom event so reminderRunner can pick it up, or just show an alert
    const sendTo = ids.length ? ids : visible.filter(v=>v.status==='pending').map(i=>i.id);
    if (!sendTo.length) {
      alert("No pending invitees selected to remind.");
      return;
    }
    // Dispatch custom event with payload
    window.dispatchEvent(new CustomEvent("rsvp-reminder-request", {
      detail: { eventId, inviteeIds: sendTo }
    }));
    alert(`Reminders requested for ${sendTo.length} invitee(s).`);
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <Typography variant="h6">RSVP Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            See who's attending, maybe, not attending, or hasn't responded.
          </Typography>
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton onClick={load}><RefreshIcon /></IconButton>
          </Tooltip>
          <Button
            startIcon={<MailOutlineIcon />}
            variant="contained"
            onClick={() => {
              const ids = Object.entries(selected).filter(([,v])=>v).map(([k])=>k);
              resendReminders(ids);
            }}
          >
            Send Reminder
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Counts */}
      <Stack direction="row" spacing={1} mb={2}>
        <Chip label={`Going: ${counts.going}`} color="success" />
        <Chip label={`Maybe: ${counts.maybe}`} sx={{ bgcolor: "warning.light" }} />
        <Chip label={`Not going: ${counts["not-going"]}`} color="error" />
        <Chip label={`Pending: ${counts.pending}`} variant="outlined" />
      </Stack>

      {/* Controls */}
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} size="small">
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="going">Going</MenuItem>
          <MenuItem value="maybe">Maybe</MenuItem>
          <MenuItem value="not-going">Not Going</MenuItem>
        </Select>

        <TextField
          size="small"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="outlined" onClick={()=>bulkSetStatus("going")} startIcon={<DoneIcon />}>Mark Going</Button>
      </Box>

      {/* Invitee list */}
      <Box>
        {visible.map((it) => (
          <Box
            key={it.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 1, borderRadius: 1, mb: 1, bgcolor: "#fafafa" }}
          >
            <Box display="flex" gap={2} alignItems="center">
              <Checkbox checked={!!selected[it.id]} onChange={()=>toggleSelect(it.id)} />
              <Box>
                <Typography variant="subtitle2">{it.name || it.email}</Typography>
                <Typography variant="caption" color="text.secondary">{it.email}</Typography>
                {it.note ? <Typography variant="caption" sx={{ display: "block" }}>Note: {it.note}</Typography> : null}
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              {/* Status chip (color-coded) */}
              {it.status === "going" && <Chip label="Going" color="success" />}
              {it.status === "maybe" && <Chip label="Maybe" sx={{ bgcolor: "warning.light" }} />}
              {it.status === "not-going" && <Chip label="Not going" color="error" />}
              {it.status === "pending" && <Chip label="Pending" variant="outlined" />}

              {/* Actions */}
              <Button size="small" onClick={() => { setInviteStatus(eventId, it.id, "going"); load(); }}>Set Going</Button>
              <Button size="small" onClick={() => { setInviteStatus(eventId, it.id, "maybe"); load(); }}>Set Maybe</Button>
              <Button size="small" onClick={() => { setInviteStatus(eventId, it.id, "not-going"); load(); }}>Set Not</Button>
            </Box>
          </Box>
        ))}

        {visible.length === 0 && (
          <Typography variant="body2" color="text.secondary">No invitees found.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Reminder scheduler UI */}
      <ReminderScheduler eventId={eventId} onReminderTriggered={()=>{
        // quick feedback, real sending is done by reminderRunner
        alert("Reminder scheduled.");
      }} />
    </Paper>
  );
}
