import React, { createContext, useState, useEffect } from "react";

export const EventContext = createContext();

export function EventProvider({ children }) {
  const [events, setEvents] = useState(() => {
    const stored = localStorage.getItem("events");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    setEvents((prev) => [...prev, { id: Date.now(), ...newEvent }]);
  };

  const removeEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <EventContext.Provider value={{ events, addEvent, removeEvent }}>
      {children}
    </EventContext.Provider>
  );
}
