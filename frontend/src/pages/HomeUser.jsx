import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Stack, Paper, Container } from "@mui/material";
import Header from "../components/Header";
import NavBoton from "../components/NavBoton";

function HomeUser() {
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setLoggedOut(true);
  };

  if (loggedOut) {
    return <Navigate to="/home" />;
  }

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      {/* Nuevo Header con Material UI */}
      <Header title="Home User" onLogout={handleLogout} />

      {/* Cuerpo */}
      <Container maxWidth="xl" sx={{ mt: 15, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 6 }}>
          <Stack spacing={2}>
            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
              <NavBoton to="/dataproblems" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A1. Identificación de Data Problems
              </NavBoton>
              <NavBoton to="/pageA2" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A2. Análisis de Data Problems específicos
              </NavBoton>
              <NavBoton to="/pageA3" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A3. Evaluación de Data Problems específicos
              </NavBoton>
              <NavBoton to="/pageA4" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A4. Evaluación de Data Problems específicos
              </NavBoton>
              <NavBoton to="/pageA5" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A5. Priorización de Data Problems específicos
              </NavBoton>
            </Box>
            <Box textAlign="center" mt={4}>
              <NavBoton to="/datos-org" variant="outlined" color="secondary">
                Carga de datos
              </NavBoton>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default HomeUser;