import React from "react";
import { TextField, Box } from "@mui/material";

export default function AccountStep({ data, onChange }) {
  return (
    <Box>
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={data.email || ""}
        onChange={(e) => onChange({ email: e.target.value })}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={data.password || ""}
        onChange={(e) => onChange({ password: e.target.value })}
      />
    </Box>
  );
}
