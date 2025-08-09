import React from "react";
import { FormGroup, FormControlLabel, Checkbox, Box } from "@mui/material";

const interests = ["Music", "Sports", "Tech", "Art", "Travel", "Food"];

export default function PreferencesStep({ data, onChange }) {
  const handleToggle = (interest) => {
    const selected = new Set(data.preferences || []);
    selected.has(interest) ? selected.delete(interest) : selected.add(interest);
    onChange({ preferences: Array.from(selected) });
  };

  return (
    <Box>
      <FormGroup>
        {interests.map((interest) => (
          <FormControlLabel
            key={interest}
            control={
              <Checkbox
                checked={(data.preferences || []).includes(interest)}
                onChange={() => handleToggle(interest)}
              />
            }
            label={interest}
          />
        ))}
      </FormGroup>
    </Box>
  );
}
