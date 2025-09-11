import React from "react";
import { Box, Button, Typography, Paper, Container, Table, TableBody, TableCell, TableHead, TableRow, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BotonVolverFijo from "../components/BotonVolverFijo";

function ResultadosClasificacionDataProblems() {
  const navigate = useNavigate();
  const clasificacion = JSON.parse(sessionStorage.getItem("clasificacionDataProblems") || "null");

  if (!clasificacion || !clasificacion.matrix || !clasificacion.dataProblems) {
    return (
      <Box minHeight="100vh" bgcolor="#f7fafc">
        <Header title="Clasificación de Data Problems" />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" color="primary" gutterBottom>
              No se ha realizado ninguna clasificación aún.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/clasificaciondataproblems")}
              >
                Realizar Clasificación
              </Button>
            </Stack>
          </Paper>
        </Container>
        <BotonVolverFijo to="/" label="Volver" /> {/* Usa el componente aquí */}
      </Box>
    );
  }

  // Si no se guardaron los nombres de los problemas, puedes obtenerlos de localStorage
  let dataProblems = clasificacion.dataProblems;
  if (!dataProblems || dataProblems.length === 0) {
    const all = JSON.parse(localStorage.getItem("allDataProblems") || "[]");
    dataProblems = all.filter(dp => clasificacion.selectedProblems.includes(dp.id));
  }

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Clasificación de Data Problems" />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Matriz de Clasificación de Data Problems
          </Typography>
          <Stack direction="row" justifyContent="right" sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/clasificaciondataproblems")}
            >
              Modificar Clasificación
            </Button>
          </Stack>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data Problem</TableCell>
                {[...Array(10)].map((_, idx) => (
                  <TableCell key={idx} align="center">{idx + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataProblems.map((dp, rowIdx) => (
                <TableRow key={dp.id}>
                  <TableCell>{dp.nombre}</TableCell>
                  {clasificacion.matrix[rowIdx].map((val, colIdx) => (
                    <TableCell key={colIdx} align="center">
                      {val ? "✔️" : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <b>Total ({clasificacion.aggFunc})</b>
                </TableCell>
                {clasificacion.results.map((val, idx) => (
                  <TableCell key={idx} align="center">
                    <b>{typeof val === "number" ? val.toFixed(2) : val}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Container>
      <BotonVolverFijo to="/" label="Volver" /> {/* Usa el componente aquí */}
    </Box>
  );
}

export default ResultadosClasificacionDataProblems;