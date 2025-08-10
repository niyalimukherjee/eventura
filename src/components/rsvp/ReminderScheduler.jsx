import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Stack, Chip } from "@mui/material";
import { upsertEvent, getEvent } from "../../lib/mockdb";

export default function ReminderScheduler({ eventId, onReminderTriggered }) {
  const [policy, setPolicy] = useState([]);
  const [newOffset, setNewOffset] = useState(7);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const ev = getEvent(eventId);
    setEvent(ev);
    setPolicy(ev?.reminders || []);
  }, [eventId]);

  function addOffset() {
    const n = Number(newOffset);
    if (isNaN(n) || n < 0) return alert("Enter a valid offset (days).");
    const next = [...policy, { offsetDays: n }];
    setPolicy(next);
    upsertEvent({ id: eventId, reminders: next });
    window.dispatchEvent(new CustomEvent("event-updated", { detail: { eventId } }));
    onReminderTriggered?.();
  }

  function removeIdx(i) {
    const next = policy.filter((_, idx) => idx !== i);
    setPolicy(next);
    upsertEvent({ id: eventId, reminders: next });
    window.dispatchEvent(new CustomEvent("event-updated", { detail: { eventId } }));
  }

  return (
    <Box>
      <Typography variant="subtitle1">Automated Reminders</Typography>
      <Typography variant="body2" color="text.secondary">
        Remind pending invitees before the event starts.
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center" my={2}>
        <TextField
          type="number"
          label="Days before"
          value={newOffset}
          onChange={(e) => setNewOffset(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={addOffset}>Add reminder</Button>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {policy.map((p, i) => (
          <Chip key={i} label={`${p.offsetDays} day(s) before`} onDelete={() => removeIdx(i)} />
        ))}
        {policy.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            No reminders configured.
          </Typography>
        )}
      </Stack>

      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">
          Event date: {event ? new Date(event.startAt || event.date).toLocaleString() : "-"}
        </Typography>
      </Box>
    </Box>
  );
}
