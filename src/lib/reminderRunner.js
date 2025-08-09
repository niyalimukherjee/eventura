// src/lib/reminderRunner.js
// Requires mockdb functions
import { listEvents, listInvites } from "./mockdb";

/**
 * Stores sent reminders in localStorage under "sentReminders" as:
 * { "<eventId>|<offsetDays>|<inviteeId>": timestamp }
 */
const STORAGE_KEY = "sentReminders_v1";

function loadSent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function saveSent(obj) { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }

/** Simulate sending reminder: replace with API call. */
function sendReminderToInvitee(eventDoc, invitee) {
  // For production, call server to send email/push
  console.log(`[Reminder] event=${eventDoc.id} to=${invitee.email} (${invitee.id})`);
  // show toast/alert (comment out if noisy)
  // window.alert(`Reminder sent to ${invitee.email} for event ${eventDoc.title}`);
}

/** main runner */
export function startReminderRunner({ intervalMs = 60000 } = {}) {
  // initial run
  runOnce();
  // set interval
  const id = setInterval(runOnce, intervalMs);
  return () => clearInterval(id);

  function runOnce() {
    try {
      const events = listEvents();
      const sent = loadSent();
      const now = Date.now();

      events.forEach((ev) => {
        if (!ev.reminders || !ev.startAt) return;
        // compute ms for event start
        const startMs = new Date(ev.startAt).getTime();
        ev.reminders.forEach((r) => {
          const offsetMs = (r.offsetDays || 0) * 24 * 3600 * 1000;
          const sendAt = startMs - offsetMs;
          // only consider reminders whose sendAt <= now and not in future
          if (sendAt <= now) {
            // for each pending invitee
            const invites = listInvites(ev.id) || [];
            invites.forEach((inv) => {
              if (inv.status !== "pending") return;
              const key = `${ev.id}|${r.offsetDays}|${inv.id}`;
              if (sent[key]) return; // already sent
              // send (simulate)
              sendReminderToInvitee(ev, inv);
              sent[key] = Date.now();
            });
          }
        });
      });

      saveSent(sent);
    } catch (err) {
      console.error("Reminder runner error:", err);
    }
  }
}
