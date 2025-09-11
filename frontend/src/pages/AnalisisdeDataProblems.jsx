import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from "@mui/material";
import Header from "../components/Header";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../api";
import BotonVolverFijo from "../components/BotonVolverFijo";

function AnalisisdeDataProblems() {
  const [dataProblems, setDataProblems] = useState([]);
  const [fuentes, setFuentes] = useState([]);
  const navigate = useNavigate();

  // Traer fuentes y dataproblems
  useEffect(() => {
    api.get("/api/fuentes/")
      .then((response) => setFuentes(response.data))
      .catch((error) => console.error("Error al obtener las fuentes:", error));
  }, []);

  useEffect(() => {
    api.get("/api/dataproblem/")
      .then((response) => {
        const problems = response.data;
        // Filtra los que NO tienen análisis
        const notAnalysed = problems.filter((problem) => !problem.analisis);
        // Machea los IDs de las fuentes con sus nombres
        const updatedProblems = notAnalysed.map((problem) => ({
          ...problem,
          fuente_identificacion_nombre:
            fuentes.find((fuente) => fuente.id === (problem.fuente_identificacion?.id ?? problem.fuente_identificacion))?.nombre || "N/A",
          fuente_confirmacion_nombre:
            fuentes.find((fuente) => fuente.id === (problem.fuente_confirmacion?.id ?? problem.fuente_confirmacion))?.nombre || "N/A",
        }));
        setDataProblems(updatedProblems);
      })
      .catch((err) => console.error("Error al obtener Data Problems:", err));
  }, [fuentes]);

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Análisis de Data Problems" />
      <Container maxWidth="xl" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4, overflowX: "auto" }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Data Problems Cargados
          </Typography>
          {/* Botones de navegación agregados */}
          <Stack
            direction="row"
            spacing={10}
            sx={{ mb: 3, justifyContent: "left" }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ mr: 1, minWidth: 90 }}>
                Explicación del Paso:
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/informacion")}
              >
                Información
              </Button>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ mr: 1, minWidth: 90 }}>
                Ver las posibles herramientas a utilizar en el analisis:
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/herramientas")}
              >
                Herramientas
              </Button>
            </Box>
          </Stack>
          {/* Fin botones de navegación */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 180, maxWidth: 260, fontWeight: 500 }}>Nombre</TableCell>
                  <TableCell sx={{ minWidth: 220, maxWidth: 350 }}>Descripción</TableCell>
                  <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>Fuente ID</TableCell>
                  <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>Fuente Conf</TableCell>
                  <TableCell sx={{ minWidth: 140, maxWidth: 220 }}>Stakeholder</TableCell>
                  <TableCell sx={{ minWidth: 120, maxWidth: 200 }}>Departamentos</TableCell>
                  <TableCell sx={{ minWidth: 120, maxWidth: 200 }}>Procesos</TableCell>
                  <TableCell align="center" sx={{ minWidth: 120 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataProblems.length > 0 ? (
                  dataProblems.map((dp) => (
                    <TableRow key={dp.id}>
                      <TableCell sx={{ minWidth: 180, maxWidth: 260, fontWeight: 500 }}>{dp.nombre}</TableCell>
                      <TableCell sx={{ minWidth: 220, maxWidth: 350 }}>
                        {dp.descripcion?.length > 60
                          ? dp.descripcion.slice(0, 60) + "..."
                          : dp.descripcion}
                      </TableCell>
                      <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>{dp.fuente_identificacion_nombre}</TableCell>
                      <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>{dp.fuente_confirmacion_nombre}</TableCell>
                      <TableCell sx={{ minWidth: 140, maxWidth: 220 }}>{dp.stakeholder?.nombre || "N/A"}</TableCell>
                      <TableCell sx={{ minWidth: 120, maxWidth: 200 }}>
                        {dp.departamentos?.length > 0
                          ? dp.departamentos.map((dep) => (
                              <Chip key={dep.id} label={dep.nombre} size="small" sx={{ mr: 0.5 }} />
                            ))
                          : "N/A"}
                      </TableCell>
                      <TableCell sx={{ minWidth: 120, maxWidth: 200 }}>
                        {dp.procesos_negocio?.length > 0
                          ? dp.procesos_negocio.map((proc) => (
                              <Chip key={proc.id} label={proc.nombre} size="small" sx={{ mr: 0.5 }} />
                            ))
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 120 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate(`/analizar/${dp.id}`)}
                        >
                          Analizar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No hay Data Problems para analizar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <BotonVolverFijo to="/" />
    </Box>
  );
}

export default AnalisisdeDataProblems;