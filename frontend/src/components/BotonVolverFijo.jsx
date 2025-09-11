import React from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function BotonVolverFijo({ to = -1, label = "Volver" }) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(to)}
        sx={{ minWidth: 120 }}
      >
        {label}
      </Button>
    </Box>
  );
}

export default BotonVolverFijo;