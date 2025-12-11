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
  Collapse,
  IconButton,
  Chip,
  Stack,
  Drawer,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import Header from "../components/Header";
import api from "../api";
import BotonVolverFijo from "../components/BotonVolverFijo";

const MOSCOW_VALUES = [
  { value: 3, label: "Must have" },
  { value: 2, label: "Should have" },
  { value: 1, label: "Could have" },
  { value: 0, label: "Won't have" },
];
// arreglar ademas la presentencion del promedio
// Componente para una fila expandible de la tabla de evaluación
function AccordionTableRowEvaluacion({ row, personas, dataProblemId, promedio, onEvaluacionGuardada }) {
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [evaluador, setEvaluador] = useState("");
  const [valor, setValor] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);

  // Cargar evaluaciones usando el id del data problem (dataProblemId)
  useEffect(() => {
    if (!dataProblemId) return;
    api.get(`/api/evaluaciondataproblem/?data_problem=${dataProblemId}`)
      .then((res) => {
        setEvaluaciones(res.data || []);
      })
      .catch(() => setEvaluaciones([]));
  }, [dataProblemId, drawerOpen]);

  const handleAgregarEvaluacion = (e) => {
    e.preventDefault();
    if (!evaluador || valor === "") return;

    // DEBUG: ver payload antes de enviar
    const payload = {
      data_problem: Number(dataProblemId), // asegurar tipo number
      evaluador: Number(evaluador),
      nota: Number(valor),
    };
    console.log("POST /api/evaluaciondataproblem/ payload:", payload);

    api.post("/api/evaluaciondataproblem/", payload)
      .then((resp) => {
        console.log("Evaluación creada:", resp.data);
        setEvaluador("");
        setValor("");
        setDrawerOpen(false);
        if (onEvaluacionGuardada) onEvaluacionGuardada(dataProblemId);
      })
      .catch((err) => {
        console.error("Error al crear evaluación:", err.response || err);
      });
  };

  return (
    <>
      <TableRow hover sx={{ cursor: "pointer" }} onClick={() => setExpanded((prev) => !prev)}>
        <TableCell width={40} align="center">
          <ExpandMoreIcon sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
        </TableCell>
        <TableCell sx={{ minWidth: 180, maxWidth: 260, fontWeight: 500 }}>{row.nombre}</TableCell>
        <TableCell sx={{ minWidth: 220, maxWidth: 350 }}>
          {row.descripcion.length > 60 && !expanded ? row.descripcion.slice(0, 60) + "..." : row.descripcion}
        </TableCell>
        <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>{row.fuente_identificacion_nombre}</TableCell>
        <TableCell sx={{ minWidth: 180, maxWidth: 300 }}>{row.causa_raiz && row.causa_raiz.length > 60 && !expanded ? row.causa_raiz.slice(0, 60) + "..." : row.causa_raiz || "N/A"}</TableCell>
        <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>
          {row.data_stages?.length > 0 ? row.data_stages.map((ds) => <Chip key={ds.id} label={ds.titulo} size="small" sx={{ mr: 0.5 }} />) : "N/A"}
        </TableCell>
        <TableCell sx={{ minWidth: 80, maxWidth: 120 }}>
          {row.data_qualities?.length > 0 ? row.data_qualities.map((dq) => <Chip key={dq.id} label={dq.titulo} size="small" sx={{ mr: 0.5 }} />) : "N/A"}
        </TableCell>
        <TableCell align="center"><b>{promedio}</b></TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
          <TableCell colSpan={8} sx={{ bgcolor: "#f5f5f5", px: 4 }}>
            <Box>
              <Typography variant="subtitle2" color="primary">
                Descripción Completa:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.descripcion}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Causa raíz completa:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.causa_raiz || "N/A"}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Fuente de Identificación:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.fuente_identificacion_nombre}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Fuente de Confirmación:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.fuente_confirmacion_nombre}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Técnicas utilizadas:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.tecnicas_utilizadas_completo}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Etapa del Dato:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {row.data_stages?.length > 0
                  ? row.data_stages.map((ds) => (
                      <Chip key={ds.id} label={ds.titulo} size="small" />
                    ))
                  : <Typography variant="body2">N/A</Typography>}
              </Stack>
              <Typography variant="subtitle2" color="primary">
                Dimensiíon de Calidad:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {row.data_qualities?.length > 0
                  ? row.data_qualities.map((dq) => (
                      <Chip key={dq.id} label={dq.titulo} size="small" />
                    ))
                  : <Typography variant="body2">N/A</Typography>}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setDrawerOpen(true)}
              >
                Evaluar
              </Button>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 350, p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Evaluar Data Problem
                  </Typography>
                  <form onSubmit={handleAgregarEvaluacion}>
                    <TextField
                      select
                      label="Evaluador"
                      value={evaluador}
                      onChange={(e) => setEvaluador(e.target.value)}
                      required
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      {personas.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.nombre} {p.apellido}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Valor (MoSCoW)"
                      value={valor}
                      onChange={(e) => setValor(Number(e.target.value))}
                      required
                      fullWidth
                      sx={{ mb: 2 }}
                    >
                      {MOSCOW_VALUES.map((v) => (
                        <MenuItem key={v.value} value={v.value}>
                          {v.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Agregar Evaluación
                    </Button>
                  </form>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">Evaluaciones:</Typography>
                  <List dense>
                    {evaluaciones.map((ev, idx) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={`${ev.evaluador_nombre || ""}`}
                          secondary={MOSCOW_VALUES.find(v => v.value === ev.nota)?.label || ev.nota}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">
                    Promedio (MoSCoW): <b>{promedio}</b>
                  </Typography>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setDrawerOpen(false)}
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Cerrar
                  </Button>
                </Box>
              </Drawer>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function EvaluacionDataProblems() {
  const [rows, setRows] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [promedios, setPromedios] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/dataproblem/?with_analisis=1")
      .then((response) => {
        const data = response.data.map((dp) => ({
          id: dp.id,
          nombre: dp.nombre,
          descripcion: dp.descripcion,
          fuente_identificacion_nombre: dp.fuente_identificacion?.nombre || "N/A",
          fuente_confirmacion_nombre: dp.fuente_confirmacion?.nombre || "N/A",
          tecnicas_utilizadas_completo: [
            dp.tecnica_identificacion?.titulo ? `Identificación: ${dp.tecnica_identificacion.titulo}` : null,
            dp.tecnica_confirmacion?.titulo ? `Confirmación: ${dp.tecnica_confirmacion.titulo}` : null,
          ].filter(Boolean).join(" | ") || "N/A",
          causa_raiz: dp.analisis?.causa_raiz || "",
          data_stages: dp.analisis?.data_stages || [],
          data_qualities: dp.analisis?.data_qualities || [],
        }));
        setRows(data);

        // Solicita promedios para cada data problem por su id
        Promise.all(
          data.map((row) =>
            api.get(`/api/evaluaciondataproblem/?data_problem=${row.id}`).then((res) => {
              const avg = (res.data && res.data.length > 0 && res.data[0].promedio_notas !== undefined && res.data[0].promedio_notas !== null)
                ? Number(res.data[0].promedio_notas).toFixed(2)
                : "-";
              return { id: row.id, promedio: avg };
            }).catch(() => ({ id: row.id, promedio: "-" }))
          )
        ).then((result) => {
          const map = {};
          result.forEach(({ id, promedio }) => { map[id] = promedio; });
          setPromedios(map);
        });
      })
      .catch(() => setRows([]));

    api.get("/api/personas/").then((response) => setPersonas(response.data)).catch(() => setPersonas([]));
  }, []);

  const handleEvaluacionGuardada = (dataProblemId) => {
    // refresca solo el promedio y evaluaciones del data problem afectado
    api.get(`/api/evaluaciondataproblem/?data_problem=${dataProblemId}`).then((res) => {
      const avg = (res.data && res.data.length > 0 && res.data[0].promedio_notas !== undefined && res.data[0].promedio_notas !== null)
        ? Number(res.data[0].promedio_notas).toFixed(2)
        : "-";
      setPromedios((p) => ({ ...p, [dataProblemId]: avg }));
    });
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Evaluación de Data Problems" />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="primary">
              Evaluación de Data Problems
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 3, position: "relative" }}>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                height: "100%",
              }}
            >
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
          </Stack>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fuente Identificación</TableCell>
                  <TableCell>Causa Raíz</TableCell>
                  <TableCell>Etapa del Dato</TableCell>
                  <TableCell>Dimensión de Calidad</TableCell>
                  <TableCell align="center">Promedio MoSCoW</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <AccordionTableRowEvaluacion
                      key={row.id}
                      row={row}
                      personas={personas}
                      dataProblemId={row.id}           // <-- usa id del data problem
                      promedio={promedios[row.id] || "-"}
                      onEvaluacionGuardada={handleEvaluacionGuardada}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">No hay Data Problems evaluados.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <BotonVolverFijo />
    </Box>
  );
}

export default EvaluacionDataProblems;