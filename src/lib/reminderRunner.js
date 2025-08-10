// src/lib/reminderRunner.js
import { listEvents, listInvites } from './mockdb';

const STORAGE_KEY = "sentReminders_v1";

function loadSent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveSent(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function sendReminderToInvitee(eventDoc, invitee) {
  console.log(
    `[Reminder] event=${eventDoc.id} to=${invitee.email} (${invitee.userId})`
  );

  // 🔔 Trigger a custom browser event for UI notification
  try {
    window.dispatchEvent(
      new CustomEvent("reminder-sent", {
        detail: {
          eventName: eventDoc.name || eventDoc.title,
          email: invitee.email,
          daysBefore: eventDoc.reminders?.find((r) =>
            r.offsetDays !== undefined
          )?.offsetDays
        }
      })
    );
  } catch (err) {
    console.warn("Failed to dispatch reminder event:", err);
  }
}

export function startReminderRunner({ intervalMs = 60000 } = {}) {
  runOnce();
  const id = setInterval(runOnce, intervalMs);
  return () => clearInterval(id);

  function runOnce() {
    try {
      const events = listEvents();
      const sent = loadSent();
      const now = Date.now();

      events.forEach((ev) => {
        if (!ev.reminders || !ev.date) return;

        const startMs = new Date(ev.date).getTime();

        ev.reminders.forEach((r) => {
          const offsetMs = (r.offsetDays || 0) * 24 * 3600 * 1000;
          const sendAt = startMs - offsetMs;

          if (sendAt <= now) {
            const invites = listInvites(ev.id) || [];
            invites.forEach((inv) => {
              if (inv.status !== "pending") return;

              const key = `${ev.id}|${r.offsetDays}|${inv.userId}`;
              if (sent[key]) return;

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
