import React, { useState, useMemo, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  InputAdornment,
  useMediaQuery,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import { EventContext } from "../context/EventContext";
import { useNavigate } from "react-router-dom";

dayjs.extend(isToday);

export default function Home() {
  const navigate = useNavigate();
  const { events, removeEvent } = useContext(EventContext);
  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");

  // Safe filter + sort logic
  const filteredEvents = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return [...events]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((event) => {
        const matchesType = filterType ? event.type === filterType : true;
        const matchesSearch =
          (event.title?.toLowerCase() || "").includes(lowerSearch) ||
          (event.location?.toLowerCase() || "").includes(lowerSearch);
        return matchesType && matchesSearch;
      });
  }, [filterType, search, events]);

  return (
    <Box sx={{ p: isMobile ? 2 : 4, backgroundColor: "#f5f5dc", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#5c4033" }}>
        Event Timeline
      </Typography>

      {/* Filters + Search */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          mb: 3
        }}
      >
        <TextField
          select
          label="Filter by Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ flex: 1, backgroundColor: "white", borderRadius: 1 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="public">Public</MenuItem>
          <MenuItem value="private">Private</MenuItem>
          <MenuItem value="RSVP">RSVP-only</MenuItem>
        </TextField>

        <TextField
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 2, backgroundColor: "white", borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Event List */}
      <Grid container spacing={3}>
        {filteredEvents.map((event) => {
          const isPast = dayjs(event.date).isBefore(dayjs(), "minute");
          const isEventToday = dayjs(event.date).isToday();

          return (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card
                sx={{
                  backgroundColor: isPast ? "#e0d5b9" : "white",
                  opacity: isPast ? 0.7 : 1,
                  borderLeft: `6px solid ${
                    event.type === "public"
                      ? "#4caf50"
                      : event.type === "private"
                      ? "#2196f3"
                      : "#ff9800"
                  }`,
                  borderRadius: 2,
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
                }}
              >
                <CardContent>
                  {/* Title + Action */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "#5c4033" }}>
                      {event.title || "Untitled Event"}
                    </Typography>
                    <IconButton
                      color="success"
                      onClick={() => {
                        if (window.confirm("Mark this event as completed?")) {
                          removeEvent(event.id);
                        }
                      }}
                      disabled={isPast}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Box>

                  {/* Today chip */}
                  {isEventToday && (
                    <Chip
                      label="Today"
                      color="primary"
                      size="small"
                      sx={{ fontWeight: "bold", mt: 0.5 }}
                    />
                  )}

                  <Typography variant="body2" color="text.secondary">
                    {event.date ? dayjs(event.date).format("MMM D, YYYY • h:mm A") : "No date set"}
                  </Typography>

                  {/* Location */}
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {event.location || "Location not specified"}
                    </Typography>
                  </Box>

                  {/* Attendees */}
                  <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                    <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {event.attendees || 0} Attendees
                    </Typography>
                  </Box>

                  {/* View details */}
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      mt: 2,
                      backgroundColor: "#8B5E3C",
                      "&:hover": { backgroundColor: "#70422a" }
                    }}
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
