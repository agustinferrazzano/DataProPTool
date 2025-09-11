import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Stack,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import Header from "../components/Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api";
import BotonVolverFijo from "../components/BotonVolverFijo"; // Agrega este import

function AnalizarDataProblems() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataProblem, setDataProblem] = useState(null);
  const [fuentes, setFuentes] = useState([]);
  const [tools, setTools] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]); // Ahora puede ser varios
  const [causaRaiz, setCausaRaiz] = useState("");
  const [dataStages, setDataStages] = useState([]);
  const [dataQualities, setDataQualities] = useState([]);
  const [selectedDataStages, setSelectedDataStages] = useState([]);
  const [selectedDataQualities, setSelectedDataQualities] = useState([]);

  useEffect(() => {
    api.get(`/api/dataproblem/${id}/`)
      .then((response) => setDataProblem(response.data))
      .catch((err) => console.error("Error al obtener Data Problem:", err));
    api.get("/api/fuentes/")
      .then((response) => setFuentes(response.data))
      .catch((err) => console.error("Error al obtener fuentes:", err));
    api.get("/api/herramientas/")
      .then((response) => setTools(response.data))
      .catch((err) => console.error("Error al obtener herramientas:", err));
    api.get("/api/datastages/")
      .then((response) => setDataStages(response.data))
      .catch((err) => console.error("Error al obtener data stages:", err));
    api.get("/api/dataquality/")
      .then((response) => setDataQualities(response.data))
      .catch((err) => console.error("Error al obtener data quality:", err));
  }, [id]);

  // Helper para mostrar nombre de fuente
  const getFuenteNombre = (fuente) => {
    if (!fuente) return "N/A";
    if (typeof fuente === "object") return fuente.nombre;
    const found = fuentes.find((f) => f.id === fuente);
    return found ? found.nombre : "N/A";
  };

  // Manejo de selección múltiple de herramientas
  const handleToolChange = (event) => {
    const value = event.target.value;
    setSelectedTools(typeof value === "string" ? value.split(",") : value);
  };

  // Manejo de selección de Data Stage
  const handleDataStageCheck = (id) => {
    setSelectedDataStages((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Manejo de selección de Data Quality
  const handleDataQualityCheck = (id) => {
    setSelectedDataQualities((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      herramientas: selectedTools,
      causa_raiz: causaRaiz,
      data_stages: selectedDataStages,
      data_qualities: selectedDataQualities,
    };
    api.post(`/api/analisisdataproblem/`, {
      data_problem: id,
      ...payload,
    })
      .then(() => {
        alert("Análisis guardado correctamente");
        navigate("/analisis");
      })
      .catch((err) => {
        alert("Error al guardar el análisis");
        console.error(err);
      });
  };

  if (!dataProblem) {
    return (
      <Box minHeight="100vh" bgcolor="#f7fafc">
        <Header title="Analizar Data Problem" />
        <Container maxWidth="md" sx={{ mt: 6 }}>
          <Typography>Cargando información...</Typography>
        </Container>
        <BotonVolverFijo to="/analisis" label="Volver" />
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Analizar Data Problem" />
      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            {dataProblem.nombre}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {dataProblem.descripcion}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip label={`Fuente Identificación: ${getFuenteNombre(dataProblem.fuente_identificacion)}`} />
            <Chip label={`Fuente Confirmación: ${getFuenteNombre(dataProblem.fuente_confirmacion)}`} />
            <Chip label={`Cargado por: ${dataProblem.stakeholder?.nombre || "N/A"}`} />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Departamentos afectados:</Typography>
            {dataProblem.departamentos?.length > 0
              ? dataProblem.departamentos.map((dep) => (
                  <Chip key={dep.id} label={dep.nombre} size="small" sx={{ mr: 0.5 }} />
                ))
              : <Typography variant="body2">N/A</Typography>}
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>Procesos afectados:</Typography>
            {dataProblem.procesos_negocio?.length > 0
              ? dataProblem.procesos_negocio.map((proc) => (
                  <Chip key={proc.id} label={proc.nombre} size="small" sx={{ mr: 0.5 }} />
                ))
              : <Typography variant="body2">N/A</Typography>}
          </Stack>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <b>Descripción de la Fuente:</b> {dataProblem.descripcion_fuente}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <b>Técnicas:</b> {dataProblem.tecnica_identificacion?.titulo || "N/A"} / {dataProblem.tecnica_confirmacion?.titulo || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <b>Grupo:</b> {dataProblem.grupo?.nombre || "Sin Grupo"}
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel id="herramienta-label">Herramientas a utilizar</InputLabel>
                <Select
                  labelId="herramienta-label"
                  multiple
                  value={selectedTools}
                  label="Herramientas a utilizar"
                  onChange={handleToolChange}
                  renderValue={(selected) =>
                    tools
                      .filter((tool) => selected.includes(tool.id))
                      .map((tool) => tool.titulo)
                      .join(", ")
                  }
                  required
                >
                  {tools.map((tool) => (
                    <MenuItem key={tool.id} value={tool.id}>
                      <Checkbox checked={selectedTools.includes(tool.id)} />
                      {tool.titulo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Descripción de causa raíz"
                value={causaRaiz}
                onChange={(e) => setCausaRaiz(e.target.value)}
                placeholder="Describe la causa raíz del problema"
                required
                fullWidth
                multiline
                minRows={3}
              />
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Data Stage
              </Typography>
              <FormGroup row>
                {dataStages.map((stage) => (
                  <FormControlLabel
                    key={stage.id}
                    control={
                      <Checkbox
                        checked={selectedDataStages.includes(stage.id)}
                        onChange={() => handleDataStageCheck(stage.id)}
                      />
                    }
                    label={stage.titulo}
                  />
                ))}
              </FormGroup>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Dimensión de Calidad
              </Typography>
              <FormGroup row>
                {dataQualities.map((quality) => (
                  <FormControlLabel
                    key={quality.id}
                    control={
                      <Checkbox
                        checked={selectedDataQualities.includes(quality.id)}
                        onChange={() => handleDataQualityCheck(quality.id)}
                      />
                    }
                    label={quality.titulo}
                  />
                ))}
              </FormGroup>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Guardar Análisis
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Container>
      <BotonVolverFijo to="/analisis" label="Volver" /> {/* Usa el componente aquí */}
    </Box>
  );
}

export default AnalizarDataProblems;