import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Header from "../components/Header";
import NavBoton from "../components/NavBoton";
import BotonVolverFijo from "../components/BotonVolverFijo"; // Agrega este import

function IdentificaciondeDataProblems() {
  const [dataProblems, setDataProblems] = useState([]);
  const [fuentes, setFuentes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const navigate = useNavigate();

  // Fetch grupos
  const fetchGrupos = () => {
    api.get("/api/grupos/")
      .then((response) => setGrupos(response.data))
      .catch((error) => console.error("Error al obtener los grupos:", error));
  };

  // Fetch fuentes
  const fetchFuentes = () => {
    api.get("/api/fuentes/")
      .then((response) => setFuentes(response.data))
      .catch((error) => console.error("Error al obtener las fuentes:", error));
  };

  // Fetch DataProblems
  const fetchDataProblems = () => {
    api.get("/api/dataproblem/")
      .then((response) => {
        const problems = response.data;
        // Machea los IDs de las fuentes con sus nombres SIN sobreescribir el id
        const updatedProblems = problems.map((problem) => ({
          ...problem,
          fuente_identificacion_nombre:
            fuentes.find((fuente) => fuente.id === problem.fuente_identificacion.id)?.nombre || "N/A",
          fuente_confirmacion_nombre:
            fuentes.find((fuente) => fuente.id === problem.fuente_confirmacion.id)?.nombre || "N/A",
        }));
        setDataProblems(updatedProblems);
      })
      .catch((error) => {
        console.error("Error al obtener los DataProblems:", error);
      });
  };

  useEffect(() => {
    fetchGrupos();
    fetchFuentes();
  }, []);

  useEffect(() => {
    if (fuentes.length > 0) {
      fetchDataProblems();
    }
    // eslint-disable-next-line
  }, [fuentes]);

  // Agrupa los DataProblems por grupo
  const groupedByGroup = grupos.length
    ? grupos.map((grupo) => ({
        grupo,
        problems: dataProblems.filter((dp) => dp.grupo?.id === grupo.id),
      }))
    : [
        {
          grupo: { nombre: "Sin Grupo" },
          problems: dataProblems.filter((dp) => !dp.grupo),
        },
      ];

  // Si hay DataProblems sin grupo, agrégalos como grupo "Sin Grupo"
  if (
    grupos.length &&
    dataProblems.some((dp) => !dp.grupo) &&
    !groupedByGroup.some((g) => g.grupo.nombre === "Sin Grupo")
  ) {
    groupedByGroup.push({
      grupo: { nombre: "Sin Grupo" },
      problems: dataProblems.filter((dp) => !dp.grupo),
    });
  }

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Identificación de Data Problems" />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="primary">
              Identificación de Data Problems
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/cargardataproblems")}
            >
              Cargar Nuevo Data Problem
            </Button>
          </Stack>
          {/* Fila de botones de navegación */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 3, width: "100%" }}
            justifyContent="space-between"
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
                Ver las posibles técnicas a utilizar:
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/tecnicas")}
              >
                Técnicas
              </Button>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ mr: 1, minWidth: 90 }}>
                Cargar nuevos datos faltantes:
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/datos-org")}
              >
                Carga de Datos
              </Button>
            </Box>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          {groupedByGroup.length > 0 && groupedByGroup.some((g) => g.problems.length > 0) ? (
            groupedByGroup.map((group, idx) =>
              group.problems.length > 0 ? (
                <Box key={group.grupo.id || "sin-grupo"} mb={4}>
                  <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
                    Grupo: {group.grupo.nombre}
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>Nombre</TableCell>
                          <TableCell>Descripción</TableCell>
                          <TableCell>Fuente ID</TableCell>
                          <TableCell>Fuente Conf</TableCell>
                          <TableCell>Stakeholder</TableCell>
                          <TableCell>Departamentos</TableCell>
                          <TableCell>Procesos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.problems.map((problem) => (
                          <AccordionTableRow key={problem.id} problem={problem} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : null
            )
          ) : (
            <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
              No hay Data Problems cargados.
            </Typography>
          )}
        </Paper>
      </Container>

      <BotonVolverFijo to="/" label="Volver" /> {/* Usa el componente aquí */}
    </Box>
  );
}

// Componente para una fila expandible de la tabla
function AccordionTableRow({ problem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        hover
        sx={{ cursor: "pointer" }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <TableCell width={40} align="center">
          {expanded ? (
            <KeyboardArrowUpIcon sx={{ transition: "transform 0.2s" }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ transition: "transform 0.2s" }} />
          )}
        </TableCell>
        <TableCell sx={{ minWidth: 180, maxWidth: 260, fontWeight: 500 }}>
          {problem.nombre}
        </TableCell>
        <TableCell sx={{ minWidth: 220, maxWidth: 350 }}>
          {problem.descripcion.length > 60 && !expanded
            ? problem.descripcion.slice(0, 60) + "..."
            : problem.descripcion}
        </TableCell>
        <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>
          {problem.fuente_identificacion_nombre}
        </TableCell>
        <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>
          {problem.fuente_confirmacion_nombre}
        </TableCell>
        <TableCell sx={{ minWidth: 140, maxWidth: 220 }}>
          {problem.stakeholder?.nombre || "N/A"}
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 200 }}>
          {problem.departamentos?.length > 0
            ? problem.departamentos.map((dep) => (
                <Chip key={dep.id} label={dep.nombre} size="small" sx={{ mr: 0.5 }} />
              ))
            : "N/A"}
        </TableCell>
        <TableCell sx={{ minWidth: 120, maxWidth: 200 }}>
          {problem.procesos_negocio?.length > 0
            ? problem.procesos_negocio.map((proc) => (
                <Chip key={proc.id} label={proc.nombre} size="small" sx={{ mr: 0.5 }} />
              ))
            : "N/A"}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={8} sx={{ bgcolor: "#f5f5f5" }}>
            <Box>
              <Typography variant="subtitle2" color="primary">
                Descripción Completa:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {problem.descripcion}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Descripción de la Fuente:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {problem.descripcion_fuente}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Técnicas de Identificación / Confirmación:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {problem.tecnica_identificacion?.titulo || "N/A"} / {problem.tecnica_confirmacion?.titulo || "N/A"}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Grupo:
              </Typography>
              <Typography variant="body2">
                {problem.grupo?.nombre || "Sin Grupo"}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default IdentificaciondeDataProblems;