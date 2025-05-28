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
} from "@mui/material";
import Header from "../components/Header";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../api";

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
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Data Problems Cargados
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fuente ID</TableCell>
                  <TableCell>Fuente Conf</TableCell>
                  <TableCell>Stakeholder</TableCell>
                  <TableCell>Departamentos</TableCell>
                  <TableCell>Procesos</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataProblems.length > 0 ? (
                  dataProblems.map((dp) => (
                    <TableRow key={dp.id}>
                      <TableCell>{dp.nombre}</TableCell>
                      <TableCell>
                        {dp.descripcion?.length > 60
                          ? dp.descripcion.slice(0, 60) + "..."
                          : dp.descripcion}
                      </TableCell>
                      <TableCell>{dp.fuente_identificacion_nombre}</TableCell>
                      <TableCell>{dp.fuente_confirmacion_nombre}</TableCell>
                      <TableCell>{dp.stakeholder?.nombre || "N/A"}</TableCell>
                      <TableCell>
                        {dp.departamentos?.length > 0
                          ? dp.departamentos.map((dep) => (
                              <Chip key={dep.id} label={dep.nombre} size="small" sx={{ mr: 0.5 }} />
                            ))
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {dp.procesos_negocio?.length > 0
                          ? dp.procesos_negocio.map((proc) => (
                              <Chip key={proc.id} label={proc.nombre} size="small" sx={{ mr: 0.5 }} />
                            ))
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
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

export default AnalisisdeDataProblems;