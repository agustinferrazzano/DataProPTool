import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const AGG_FUNCS = [
  { key: "media", label: "Media" },
  { key: "suma", label: "Suma" },
  { key: "max", label: "Máximo" },
  { key: "min", label: "Mínimo" },
];

function AggregationFunctionSelector({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      sx={{ mb: 2 }}
    >
      {AGG_FUNCS.map((f) => (
        <ToggleButton key={f.key} value={f.key}>
          {f.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default AggregationFunctionSelector;