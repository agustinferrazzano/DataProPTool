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
            {/* Título de bienvenida y divisor */}
            <Box>
              <Box textAlign="center" mb={2}>
                <h2 style={{ margin: 0 }}>¡Bienvenido!</h2>
              </Box>
              <Box mb={3}>
                <hr style={{ border: "none", borderTop: "2px solid #1976d2", margin: 0 }} />
              </Box>
            </Box>
            {/* Botones de pasos principales */}
            <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
              <NavBoton to="/dataproblems" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A1. Identificación de Problemas de Datos
              </NavBoton>
              <NavBoton to="/analisis" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A2. Análisis de Problemas de Datos Especificos
              </NavBoton>
              <NavBoton to="/evaluacion" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A3. Evaluación de Problemas de Datos Especificos
              </NavBoton>
              <NavBoton to="/resultadosclasificacion" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A4. Clasificacion de Problemas de Datos Genericos
              </NavBoton>
              <NavBoton to="/priorizacionprocesos" variant="contained" color="primary" sx={{ minWidth: 220, flex: "1 1 220px" }}>
                A5. Priorización de Procesos de Datos
              </NavBoton>
            </Box>
            {/* Separador visual */}
            <Box my={3}>
              <hr style={{ border: "none", borderTop: "1.5px dashed #90caf9", margin: 0, width: "60%" }} />
            </Box>
            {/* Botones de carga de datos e información */}
            <Box textAlign="center" mt={2} display="flex" justifyContent="center" gap={2}>
              <NavBoton to="/datos-org" variant="contained" color="secondary">
                Carga de datos
              </NavBoton>
              <NavBoton to="/information" variant="contained" color="secondary">
                Informacion del Proceso
              </NavBoton>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default HomeUser;