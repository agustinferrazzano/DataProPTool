import React, { useMemo } from "react";
import { Box, Button, Paper, Typography, Container, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
      <Container maxWidth="xl" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4, overflowX: "auto" }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Prioriazación de Procesos
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
            Cada celda contiene un valor aleatorio (0 a 1) pero siempre igual para cada usuario. El puntaje de cada fila es la suma de cada valor multiplicado por el resultado de la columna correspondiente.
          </Typography>
          {/* Matriz sin ordenar */}
          <Table size="small" sx={{ mb: 4 }}>
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
          {/* Resultados ordenados */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Filas ordenadas por puntaje (mayor a menor)
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Fila</b></TableCell>
                <TableCell align="center"><b>Puntaje</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filasOrdenadas.map((fila) => (
                <TableRow key={fila.idx}>
                  <TableCell>{fila.idx}</TableCell>
                  <TableCell align="center">
                    <b>{fila.puntaje.toFixed(3)}</b>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    <Box
        sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        }}
    >
        <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/")}
        sx={{ minWidth: 120 }}
        >
        Volver
        </Button>
    </Box>
    </Box>
  );
}

export default PriorizacionProcesos;