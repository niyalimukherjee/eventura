import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Stack, Chip } from "@mui/material";
import { upsertEvent, listEvents, getEvent } from "../../lib/mockdb";

/**
 * Simple UI to set offsets in days before startAt.
 * Stores reminder policy on event document under `reminders`:
 *   reminders: [{ offsetDays: 7 }, { offsetDays: 1 }]
 *
 * Props:
 *  - eventId
 */
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
    upsertEvent({ id: eventId, reminders: next }); // persist on event
    onReminderTriggered?.();
  }

  function removeIdx(i) {
    const next = policy.filter((_, idx) => idx !== i);
    setPolicy(next);
    upsertEvent({ id: eventId, reminders: next });
  }

  return (
    <Box>
      <Typography variant="subtitle1">Automated Reminders</Typography>
      <Typography variant="body2" color="text.secondary">Remind pending invitees before the event starts.</Typography>

      <Stack direction="row" spacing={1} alignItems="center" my={2}>
        <TextField
          type="number"
          label="Days before"
          value={newOffset}
          onChange={(e)=>setNewOffset(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={addOffset}>Add reminder</Button>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {policy.map((p, i) => (
          <Chip key={i} label={`${p.offsetDays} day(s) before`} onDelete={()=>removeIdx(i)} />
        ))}
        {policy.length === 0 && <Typography variant="caption" color="text.secondary">No reminders configured.</Typography>}
      </Stack>

      <Box mt={2}>
        <Typography variant="caption" color="text.secondary">Event date: {event ? new Date(event.startAt).toLocaleString() : "-"}</Typography>
      </Box>
    </Box>
  );
}
