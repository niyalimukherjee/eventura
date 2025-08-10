// src/lib/mockdb.js
// Mock database using localStorage for persistence

/* -------------------- UTIL -------------------- */

// Generate unique IDs
export function uid() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Read and parse from localStorage safely
function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

// Write to localStorage
function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* -------------------- EVENTS -------------------- */

// List all events
export function listEvents() {
  return read("events");
}

// Get a single event by ID
export function getEvent(id) {
  return listEvents().find(e => e.id === id) || null;
}

// Create or update an event
export function upsertEvent(event) {
  const events = listEvents();
  const id = event.id || uid();
  const index = events.findIndex(e => e.id === id);

  if (index > -1) {
    events[index] = { ...events[index], ...event, id };
  } else {
    events.push({ ...event, id });
  }

  write("events", events);

  // 🔄 Real-time event update signal
  try {
    window.dispatchEvent(new CustomEvent("event-updated", { detail: { eventId: id } }));
  } catch (err) {
    console.warn("Real-time event update failed:", err);
  }

  return events.find(e => e.id === id);
}

/* -------------------- INVITEES -------------------- */

// List all invites for an event
export function listInvites(eventId) {
  return read("invites").filter(invite => invite.eventId === eventId);
}

// Get a single invite for a user
export function getInvite(eventId, userId) {
  return read("invites").find(
    invite => invite.eventId === eventId && invite.userId === userId
  ) || null;
}

// Add multiple invitees to an event
export function addInvitees(eventId, invitees) {
  const invites = read("invites");
  const newInvites = invitees.map(invitee => ({
    eventId,
    userId: invitee.userId || uid(),
    name: invitee.name,
    email: invitee.email,
    status: invitee.status || "pending",
    notes: invitee.notes || ""
  }));

  invites.push(...newInvites);
  write("invites", invites);

  // 🔄 Real-time invite update signal
  try {
    window.dispatchEvent(new CustomEvent("invite-updated", { detail: { eventId } }));
  } catch (err) {
    console.warn("Real-time invite update failed:", err);
  }

  return newInvites;
}

// Update RSVP status for a user in an event
export function setInviteStatus(eventId, userId, status, notes = "") {
  const invites = read("invites");

  const index = invites.findIndex(
    invite => invite.eventId === eventId && invite.userId === userId
  );

  if (index > -1) {
    invites[index].status = status;
    if (notes) invites[index].notes = notes;
  } else {
    invites.push({ eventId, userId, status, notes });
  }

  write("invites", invites);

  // 🔄 Real-time invite update signal
  try {
    window.dispatchEvent(new CustomEvent("invite-updated", { detail: { eventId } }));
  } catch (err) {
    console.warn("Real-time invite update failed:", err);
  }
}

/* -------------------- CLEANUP / SEED -------------------- */

// Remove all data (for dev/testing)
export function clearMockDB() {
  localStorage.removeItem("events");
  localStorage.removeItem("invites");
}

// Ensure there is at least one sample event
export function ensureSampleData() {
  const events = listEvents();
  if (events.length === 0) {
    const eventId = uid();
    upsertEvent({
      id: eventId,
      name: "Sample Event",
      date: "2025-08-15",
      description: "This is a test event for RSVP.",
    });

    addInvitees(eventId, [
      { name: "Alice Johnson", email: "alice@example.com", status: "pending" },
      { name: "Bob Smith", email: "bob@example.com", status: "going" },
      { name: "Charlie Lee", email: "charlie@example.com", status: "maybe" },
    ]);
  }
  return listEvents();
}

// Auto-seed on first load
ensureSampleData();
