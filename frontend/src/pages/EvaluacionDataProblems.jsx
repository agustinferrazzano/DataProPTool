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
  List,
  ListItem,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import Header from "../components/Header";
import api from "../api";
import BotonVolverFijo from "../components/BotonVolverFijo"; // Agrega este import

// MoSCoW ahora tiene valor numérico
const EVALUATION_TECHNIQUES = [
  {
    key: "moscow",
    label: "MoSCoW",
    values: [
      { value: 3, label: "Must have" },
      { value: 2, label: "Should have" },
      { value: 1, label: "Could have" },
      { value: 0, label: "Won't have" },
    ],
  },
  {
    key: "numerical",
    label: "Numerical Assignment Techniques",
    values: [
      { value: 1, label: "Baja prioridad" },
      { value: 2, label: "Media prioridad" },
      { value: 3, label: "Alta prioridad" },
    ],
  },
  {
    key: "hundred",
    label: "Hundred Dollar Method",
    values: [
      { value: 0, label: "Asignar cantidad de dólares (0-100)" },
    ],
  },
];

function EvaluationTechniqueSelector({ selected, onChange, buttonProps }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        onClick={handleClick}
        {...buttonProps}
      >
        Técnica: {EVALUATION_TECHNIQUES.find(t => t.key === selected)?.label || "Seleccionar"}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {EVALUATION_TECHNIQUES.map((tech) => (
          <MenuItem
            key={tech.key}
            selected={tech.key === selected}
            onClick={() => {
              onChange(tech.key);
              handleClose();
            }}
          >
            {tech.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// Componente para mostrar/editar los significados de los valores de la técnica
function TechniqueValuesDialog({ open, onClose, techniqueKey, values, onSave }) {
  const [localValues, setLocalValues] = useState(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleValueChange = (idx, field, val) => {
    setLocalValues((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: val } : v))
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar valores de la técnica</DialogTitle>
      <DialogContent>
        {localValues.map((v, idx) => (
          <Box key={idx} sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <TextField
              label="Valor numérico"
              type="number"
              value={v.value}
              onChange={e => handleValueChange(idx, "value", Number(e.target.value))}
              sx={{ mr: 2, width: 140 }}
            />
            <TextField
              label="Significado"
              value={v.label}
              disabled
              sx={{ width: 200 }}
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button
          onClick={() => {
            onSave(localValues);
            onClose();
          }}
          variant="contained"
          color="primary"
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Componente para una fila expandible de la tabla de evaluación
function AccordionTableRowEvaluacion({ row, evalTechnique, evalValues, onSaveEvaluacion }) {
  const [expanded, setExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [evaluadores, setEvaluadores] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoValor, setNuevoValor] = useState("");

  // Calcular media local según técnica
  let media = "-";
  let mediaNumerica = 0;
  if (evaluadores.length > 0) {
    if (evalTechnique === "moscow" || evalTechnique === "numerical") {
      const avg = (
        evaluadores.reduce((acc, curr) => acc + Number(curr.valor), 0) / evaluadores.length
      );
      const rounded = Math.round(avg);
      const label = evalValues.find(v => v.value === rounded)?.label || avg.toFixed(2);
      media = label;
      mediaNumerica = avg;
    } else if (evalTechnique === "hundred") {
      const total = evaluadores.reduce((acc, curr) => acc + Number(curr.valor), 0);
      media = total;
      mediaNumerica = total;
    }
  }

  // Guardar evaluación en sessionStorage cada vez que cambia
  useEffect(() => {
    if (evaluadores.length > 0) {
      const evaluacion = {
        dataProblemId: row.id,
        dataProblemNombre: row.nombre,
        tecnica: evalTechnique,
        evaluadores,
        resultado: media,
        resultadoNumerico: mediaNumerica,
      };
      const prev = JSON.parse(sessionStorage.getItem("evaluacionDataProblems") || "[]");
      const filtrado = prev.filter(e => e.dataProblemId !== row.id);
      const actualizado = [...filtrado, evaluacion];
      sessionStorage.setItem("evaluacionDataProblems", JSON.stringify(actualizado));
      if (onSaveEvaluacion) onSaveEvaluacion(evaluacion);
    }
  }, [evaluadores, evalTechnique, evalValues, row.id, row.nombre, media, mediaNumerica, onSaveEvaluacion]);

  const handleAgregarEvaluador = (e) => {
    e.preventDefault();
    if (!nuevoNombre) return;
    if (evalTechnique === "moscow" && !nuevoValor) return;
    if (evalTechnique === "numerical" && (nuevoValor === "" || isNaN(Number(nuevoValor)))) return;
    if (evalTechnique === "hundred" && (nuevoValor === "" || isNaN(Number(nuevoValor)) || Number(nuevoValor) < 0 || Number(nuevoValor) > 100)) return;

    setEvaluadores((prev) => [
      ...prev,
      { nombre: nuevoNombre, valor: nuevoValor },
    ]);
    setNuevoNombre("");
    setNuevoValor("");
  };

  return (
    <>
      <TableRow
        hover
        sx={{ cursor: "pointer" }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <TableCell width={40} align="center">
          <ExpandMoreIcon
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </TableCell>
        <TableCell sx={{ minWidth: 180, maxWidth: 260, fontWeight: 500 }}>
          {row.nombre}
        </TableCell>
        <TableCell sx={{ minWidth: 220, maxWidth: 350 }}>
          {row.descripcion.length > 60 && !expanded
            ? row.descripcion.slice(0, 60) + "..."
            : row.descripcion}
        </TableCell>
        <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>
          {row.fuente_identificacion_nombre}
        </TableCell>
        <TableCell sx={{ minWidth: 180, maxWidth: 300 }}>
          {row.causa_raiz && row.causa_raiz.length > 60 && !expanded
            ? row.causa_raiz.slice(0, 60) + "..."
            : row.causa_raiz || "N/A"}
        </TableCell>
        <TableCell sx={{ minWidth: 100, maxWidth: 140 }}>
          {row.data_stages?.length > 0
            ? row.data_stages.map((ds) => (
                <Chip key={ds.id} label={ds.titulo} size="small" sx={{ mr: 0.5 }} />
              ))
            : "N/A"}
        </TableCell>
        <TableCell sx={{ minWidth: 80, maxWidth: 120 }}>
          {row.data_qualities?.length > 0
            ? row.data_qualities.map((dq) => (
                <Chip key={dq.id} label={dq.titulo} size="small" sx={{ mr: 0.5 }} />
              ))
            : "N/A"}
        </TableCell>
        <TableCell align="center">
          <b>{media}</b>
          {evalTechnique === "moscow" && (
            <span style={{ fontSize: 12, color: "#1976d2", marginLeft: 4 }}>
              ({mediaNumerica.toFixed(2)})
            </span>
          )}
        </TableCell>
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
                  <form onSubmit={handleAgregarEvaluador}>
                    <TextField
                      label="Nombre del evaluador"
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      required
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                    {evalTechnique === "moscow" && (
                      <TextField
                        select
                        label="Valor"
                        value={nuevoValor}
                        onChange={(e) => setNuevoValor(Number(e.target.value))}
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        {evalValues.map((v) => (
                          <MenuItem key={v.value} value={v.value}>
                            {v.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    {evalTechnique === "numerical" && (
                      <TextField
                        select
                        label="Valor"
                        value={nuevoValor}
                        onChange={(e) => setNuevoValor(e.target.value)}
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                      >
                        {evalValues.map((v) => (
                          <MenuItem key={v.value} value={v.value}>
                            {v.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    {evalTechnique === "hundred" && (
                      <TextField
                        label="Dólares asignados"
                        type="number"
                        value={nuevoValor}
                        onChange={(e) => setNuevoValor(e.target.value)}
                        required
                        fullWidth
                        inputProps={{ min: 0, max: 100, step: 1 }}
                        sx={{ mb: 2 }}
                      />
                    )}
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
                    {evaluadores.map((ev, idx) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={ev.nombre}
                          secondary={
                            evalTechnique === "moscow"
                              ? evalValues.find(v => v.value === ev.valor)?.label || ev.valor
                              : ev.valor
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">
                    Resultado local: <b>{media}</b>
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
  const [evalTechnique, setEvalTechnique] = useState("moscow");
  const [evalValues, setEvalValues] = useState(EVALUATION_TECHNIQUES[0].values);
  const [valuesDialogOpen, setValuesDialogOpen] = useState(false);
  const [evaluacionesGuardadas, setEvaluacionesGuardadas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/dataproblem/?with_analisis=1")
      .then((response) => {
        const data = response.data.map((dp) => ({
          id: dp.id,
          nombre: dp.nombre,
          descripcion: dp.descripcion,
          fuente_identificacion_nombre:
            dp.fuente_identificacion?.nombre || "N/A",
          fuente_confirmacion_nombre:
            dp.fuente_confirmacion?.nombre || "N/A",
          tecnicas_utilizadas:
            [
              dp.tecnica_identificacion?.titulo,
              dp.tecnica_confirmacion?.titulo,
            ]
              .filter(Boolean)
              .join(" / ") || "N/A",
          tecnicas_utilizadas_completo:
            [
              dp.tecnica_identificacion?.titulo
                ? `Identificación: ${dp.tecnica_identificacion.titulo}`
                : null,
              dp.tecnica_confirmacion?.titulo
                ? `Confirmación: ${dp.tecnica_confirmacion.titulo}`
                : null,
            ]
              .filter(Boolean)
              .join(" | ") || "N/A",
          causa_raiz: dp.analisis?.causa_raiz || "",
          data_stages: dp.analisis?.data_stages || [],
          data_qualities: dp.analisis?.data_qualities || [],
        }));
        setRows(data);
      })
      .catch(() => {
        setRows([]);
      });

    // Cargar evaluaciones guardadas al entrar
    const guardadas = JSON.parse(sessionStorage.getItem("evaluacionDataProblems") || "[]");
    setEvaluacionesGuardadas(guardadas);
  }, []);

  // Cambia los valores cuando cambia la técnica
  useEffect(() => {
    const found = EVALUATION_TECHNIQUES.find(t => t.key === evalTechnique);
    setEvalValues(found ? found.values : []);
  }, [evalTechnique]);

  // Función para manejar el guardado de evaluaciones (opcional, para lógica extra)
  const handleSaveEvaluacion = (evaluacion) => {
    // Actualiza la lista de evaluaciones guardadas
    const guardadas = JSON.parse(sessionStorage.getItem("evaluacionDataProblems") || "[]");
    setEvaluacionesGuardadas(guardadas);
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
            <EvaluationTechniqueSelector
              selected={evalTechnique}
              onChange={setEvalTechnique}
              buttonProps={{
                variant: "contained",
                color: "primary",
                startIcon: <AddIcon />,
                sx: { minWidth: 220 }
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setValuesDialogOpen(true)}
              sx={{ minWidth: 180 }}
            >
              Editar valores de técnica
            </Button>
            {/* Botón de información alineado a la derecha */}
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
          <TechniqueValuesDialog
            open={valuesDialogOpen}
            onClose={() => setValuesDialogOpen(false)}
            techniqueKey={evalTechnique}
            values={evalValues}
            onSave={setEvalValues}
          />
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
                  <TableCell align="center">Resultado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <AccordionTableRowEvaluacion
                      key={row.id}
                      row={row}
                      evalTechnique={evalTechnique}
                      evalValues={evalValues}
                      onSaveEvaluacion={handleSaveEvaluacion}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      No hay Data Problems evaluados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <BotonVolverFijo /> {/* Usa el componente aquí */}
    </Box>
  );
}

export default EvaluacionDataProblems;