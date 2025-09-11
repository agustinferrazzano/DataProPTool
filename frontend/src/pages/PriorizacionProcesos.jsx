import React, { useMemo, useState } from "react";
import { Box, Button, Paper, Typography, Container, Table, TableBody, TableCell, TableHead, TableRow, Collapse, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BotonVolverFijo from "../components/BotonVolverFijo";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Genera una matriz de 20x10 con valores aleatorios entre 0 y 1, pero siempre los mismos para cada usuario
function generarMatrizAleatoriaDeterministica(filas = 20, columnas = 10, semilla = 12345) {
  let seed = semilla;
  function random() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
  return Array.from({ length: filas }, () =>
    Array.from({ length: columnas }, () => random())
  );
}

function PriorizacionProcesos() {
  const navigate = useNavigate();
  const [openMatriz, setOpenMatriz] = useState(false);

  // Recupera los resultados de la matriz de clasificación
  const clasificacion = JSON.parse(sessionStorage.getItem("clasificacionDataProblems") || "null");
  // Si no hay clasificación, inicializa en 0
  const resultados = clasificacion && Array.isArray(clasificacion.results)
    ? clasificacion.results
    : Array(10).fill(0);

  // Genera la matriz aleatoria determinística solo una vez
  const matriz = useMemo(() => generarMatrizAleatoriaDeterministica(20, 10, 12345), []);

  // Calcula los puntajes de cada fila
  const filasConPuntaje = matriz.map((fila, idx) => {
    const puntaje = fila.reduce((acc, val, colIdx) => acc + val * (Number(resultados[colIdx]) || 0), 0);
    return { idx: idx + 1, valores: fila, puntaje };
  });

  // Ordena las filas de mayor a menor puntaje para mostrar debajo
  const filasOrdenadas = [...filasConPuntaje].sort((a, b) => b.puntaje - a.puntaje);

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Priorización de Procesos" />

      {/* Contenedor expandible para la matriz */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 4,
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setOpenMatriz((prev) => !prev)}
        >
          <Box maxWidth="lg" width="100%" mx="auto">
            <Box display="flex" alignItems="flex-start" justifyContent="space-between">
              <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  Priorización de Procesos
                </Typography>
                <Typography variant="subtitle1" color="black" gutterBottom>
                  Si desea, haga click para ver la matriz de priorización
                </Typography>
              </Box>
              <IconButton
                size="large"
                onClick={e => {
                  e.stopPropagation();
                  setOpenMatriz((prev) => !prev);
                }}
                aria-label={openMatriz ? "Ocultar matriz" : "Mostrar matriz"}
                sx={{ ml: 2, mt: 1 }}
              >
                {openMatriz ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Box>
            <Collapse in={openMatriz}>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Table size="small" sx={{ mb: 4, width: "auto" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Fila</b></TableCell>
                      {[...Array(10)].map((_, idx) => (
                        <TableCell key={idx} align="center">
                          <b>Col {idx + 1}</b>
                          <br />
                          <span style={{ fontSize: 12, color: "#1976d2" }}>
                            {typeof resultados[idx] === "number" ? Number(resultados[idx]).toFixed(2) : resultados[idx]}
                          </span>
                        </TableCell>
                      ))}
                      <TableCell align="center"><b>Puntaje</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filasConPuntaje.map((fila) => (
                      <TableRow key={fila.idx}>
                        <TableCell>{fila.idx}</TableCell>
                        {fila.valores.map((val, colIdx) => (
                          <TableCell key={colIdx} align="center">
                            {val.toFixed(3)}
                          </TableCell>
                        ))}
                        <TableCell align="center">
                          <b>{fila.puntaje.toFixed(3)}</b>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </Box>
        </Paper>
      </Container>

      {/* Contenedor para los resultados ordenados */}
      <Container maxWidth="lg" sx={{ mb: 8, px: 0 }}> {/* Ahora ocupa el ancho máximo, sin padding extra */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filas ordenadas por puntaje (mayor a menor)
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Fila</b></TableCell>
                <TableCell align="center"><b>Puntaje</b></TableCell>
                <TableCell align="left"><b>Recomendaciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filasOrdenadas.map((fila) => (
                <TableRow key={fila.idx}>
                  <TableCell>{fila.idx}</TableCell>
                  <TableCell align="center">
                    <b>{fila.puntaje.toFixed(3)}</b>
                  </TableCell>
                  <TableCell align="left">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>

      <BotonVolverFijo to="/" label="Volver" />
    </Box>
  );
}

export default PriorizacionProcesos;