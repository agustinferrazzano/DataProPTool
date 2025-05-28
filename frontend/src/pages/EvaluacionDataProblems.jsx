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
import Header from "../components/Header";
import api from "../api";

// Componente para seleccionar técnica de evaluación
const EVALUATION_TECHNIQUES = [
  {
    key: "moscow",
    label: "MoSCoW",
    values: [
      { value: "M", label: "Must have" },
      { value: "S", label: "Should have" },
      { value: "C", label: "Could have" },
      { value: "W", label: "Won't have" },
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

function EvaluationTechniqueSelector({ selected, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClick} sx={{ mr: 2 }}>
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
      <DialogTitle>Editar significados de la técnica</DialogTitle>
      <DialogContent>
        {localValues.map((v, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <TextField
              label="Valor"
              value={v.value}
              disabled
              sx={{ mr: 2, width: 100 }}
            />
            <TextField
              label="Significado"
              value={v.label}
              onChange={(e) => handleValueChange(idx, "label", e.target.value)}
              sx={{ width: 300 }}
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

function Row({ row, evalTechnique, evalValues }) {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [evaluadores, setEvaluadores] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoValor, setNuevoValor] = useState("");

  // Calcular media local según técnica
  let media = "-";
  if (evaluadores.length > 0) {
    if (evalTechnique === "moscow") {
      // Muestra el valor más frecuente
      const freq = {};
      evaluadores.forEach(ev => {
        freq[ev.valor] = (freq[ev.valor] || 0) + 1;
      });
      const max = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
      media = max ? evalValues.find(v => v.value === max[0])?.label || max[0] : "-";
    } else if (evalTechnique === "numerical") {
      // Promedio numérico
      const avg = (
        evaluadores.reduce((acc, curr) => acc + Number(curr.valor), 0) /
        evaluadores.length
      ).toFixed(2);
      media = avg;
    } else if (evalTechnique === "hundred") {
      // Suma total asignada (o promedio)
      const total = evaluadores.reduce((acc, curr) => acc + Number(curr.valor), 0);
      media = total;
    }
  }

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
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.nombre}</TableCell>
        <TableCell>
          {row.descripcion.length > 60
            ? row.descripcion.slice(0, 60) + "..."
            : row.descripcion}
        </TableCell>
        <TableCell>{row.fuente_identificacion_nombre}</TableCell>
        <TableCell>
          {row.causa_raiz && row.causa_raiz.length > 60
            ? row.causa_raiz.slice(0, 60) + "..."
            : row.causa_raiz || "N/A"}
        </TableCell>
        <TableCell>
          {row.data_stages?.length > 0
            ? row.data_stages.map((ds) => (
                <Chip key={ds.id} label={ds.titulo} size="small" sx={{ mr: 0.5 }} />
              ))
            : "N/A"}
        </TableCell>
        <TableCell>
          {row.data_qualities?.length > 0
            ? row.data_qualities.map((dq) => (
                <Chip key={dq.id} label={dq.titulo} size="small" sx={{ mr: 0.5 }} />
              ))
            : "N/A"}
        </TableCell>
        <TableCell align="center">
          <b>{media}</b>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={11} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Descripción completa:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.descripcion}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Causa raíz completa:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.causa_raiz || "N/A"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Fuente de Identificación:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.fuente_identificacion_nombre}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Fuente de Confirmación:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.fuente_confirmacion_nombre}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Técnicas utilizadas:
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {row.tecnicas_utilizadas_completo}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Data Stage:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {row.data_stages?.length > 0
                  ? row.data_stages.map((ds) => (
                      <Chip key={ds.id} label={ds.titulo} size="small" />
                    ))
                  : <Typography variant="body2">N/A</Typography>}
              </Stack>
              <Typography variant="subtitle1" gutterBottom>
                Data Quality:
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
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function EvaluacionDataProblems() {
  const [rows, setRows] = useState([]);
  const [evalTechnique, setEvalTechnique] = useState("moscow");
  const [evalValues, setEvalValues] = useState(EVALUATION_TECHNIQUES[0].values);
  const [valuesDialogOpen, setValuesDialogOpen] = useState(false);
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
  }, []);

  // Cambia los valores cuando cambia la técnica
  useEffect(() => {
    const found = EVALUATION_TECHNIQUES.find(t => t.key === evalTechnique);
    setEvalValues(found ? found.values : []);
  }, [evalTechnique]);

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Evaluación de Data Problems" />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <EvaluationTechniqueSelector
              selected={evalTechnique}
              onChange={setEvalTechnique}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setValuesDialogOpen(true)}
            >
              Editar significados de valores
            </Button>
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
                  <TableCell>Data Stage</TableCell>
                  <TableCell>Data Quality</TableCell>
                  <TableCell align="center">Resultado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <Row
                      key={row.id}
                      row={row}
                      evalTechnique={evalTechnique}
                      evalValues={evalValues}
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

export default EvaluacionDataProblems;