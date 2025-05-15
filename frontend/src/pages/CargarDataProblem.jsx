import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import api from "../api";
import Header from "../components/Header";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Container,
  TextField,
  Grid,
} from "@mui/material";

function CargarDataProblem() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sourceDescription, setSourceDescription] = useState("");
  const [groupedSources, setGroupedSources] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [businessProcesses, setBusinessProcesses] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [groups, setGroups] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [selectedIdentificationSource, setSelectedIdentificationSource] = useState(null);
  const [selectedConfirmationSource, setSelectedConfirmationSource] = useState(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedIdentificationTechnique, setSelectedIdentificationTechnique] = useState(null);
  const [selectedConfirmationTechnique, setSelectedConfirmationTechnique] = useState(null);
  const [org, setUsuario] = useState([{}]);
  const navigate = useNavigate();

  // Fetch data
  const fetchData = () => {
    api.get("/api/departamentos/")
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error("Error al obtener departamentos:", error));

    api.get("/api/procesos/")
      .then((response) => setBusinessProcesses(response.data))
      .catch((error) => console.error("Error al obtener procesos de negocio:", error));

    api.get("/api/fuentes/")
      .then((response) => {
        const grouped = response.data.reduce((acc, source) => {
          const group = acc[source.tipo_fuente] || [];
          group.push({ value: source.id, label: source.nombre });
          acc[source.tipo_fuente] = group;
          return acc;
        }, {});
        const groupedArray = Object.keys(grouped).map((key) => ({
          label: key,
          options: grouped[key],
        }));
        setGroupedSources(groupedArray);
      })
      .catch((error) => console.error("Error al obtener fuentes:", error));

    api.get("/api/stakeholders/")
      .then((response) => setStakeholders(response.data))
      .catch((error) => console.error("Error al obtener stakeholders:", error));

    api.get("/api/grupos/")
      .then((response) => setGroups(response.data))
      .catch((error) => console.error("Error al obtener grupos:", error));

    api.get("/api/tecnicas/")
      .then((response) => setTechniques(response.data))
      .catch((error) => console.error("Error al obtener técnicas:", error));

    api.get("/api/usuarios/")
      .then((response) => setUsuario(response.data))
      .catch((error) => console.error("Error al obtener usuarios:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newDataProblem = {
      nombre: name,
      descripcion: description,
      fuente_identificacion: selectedIdentificationSource,
      fuente_confirmacion: selectedConfirmationSource || null,
      descripcion_fuente: sourceDescription,
      stakeholder_id: selectedStakeholder,
      departamentos_ids: selectedDepartments,
      procesos_negocio_ids: selectedProcesses,
      fuente_confirmacion_id: selectedConfirmationSource,
      fuente_identificacion_id: selectedIdentificationSource,
      tecnica_identificacion_id: selectedIdentificationTechnique,
      tecnica_confirmacion_id: selectedConfirmationTechnique,
      grupo_id: selectedGroup || null,
      organizacion: org[0].id,
    };

    api.post("/api/dataproblem/", newDataProblem)
      .then((response) => {
        if (response.status === 201) {
          alert("Data Problem creado correctamente.");
          navigate("/dataproblems");
        }
      })
      .catch((error) => {
        console.error("Error al crear el Data Problem:", error.response?.data || error.message);
        alert("Hubo un error al crear el Data Problem.");
      });
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Cargar Nuevo Data Problem" onLogout={() => { localStorage.clear(); navigate("/home"); }} />
      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Cargar Nuevo Data Problem
          </Typography>
          <Box component="form" onSubmit={handleSubmit} mt={3}>
            <Stack spacing={3}>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa el nombre del Data Problem"
                required
                fullWidth
              />
              <TextField
                label="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingresa una descripción"
                required
                fullWidth
                multiline
                minRows={3}
              />
              <Typography variant="subtitle2">Fuente de Identificación:</Typography>
              <Select
                id="identificationSource"
                options={groupedSources}
                onChange={(selectedOption) => setSelectedIdentificationSource(selectedOption ? selectedOption.value : null)}
                placeholder="Selecciona una fuente de identificación"
                className="multi-select"
                classNamePrefix="multi-select"
                value={
                  groupedSources
                    .flatMap(group => group.options)
                    .find(opt => opt.value === selectedIdentificationSource) || null
                }
              />
              <Typography variant="subtitle2">Técnica de Identificación:</Typography>
              <Select
                id="identificationTechnique"
                options={techniques.map((technique) => ({
                  value: technique.id,
                  label: technique.titulo,
                }))}
                onChange={(selectedOption) => setSelectedIdentificationTechnique(selectedOption ? selectedOption.value : null)}
                placeholder="Selecciona una técnica de identificación"
                className="multi-select"
                classNamePrefix="multi-select"
                value={
                  techniques
                    .map((technique) => ({ value: technique.id, label: technique.titulo }))
                    .find(opt => opt.value === selectedIdentificationTechnique) || null
                }
              />
              <Typography variant="subtitle2">Fuente de Confirmación:</Typography>
              <Select
                id="confirmationSource"
                options={groupedSources}
                onChange={(selectedOption) => setSelectedConfirmationSource(selectedOption ? selectedOption.value : null)}
                placeholder="Selecciona una fuente de confirmación"
                className="multi-select"
                classNamePrefix="multi-select"
                value={
                  groupedSources
                    .flatMap(group => group.options)
                    .find(opt => opt.value === selectedConfirmationSource) || null
                }
              />
              <Typography variant="subtitle2">Técnica de Confirmación:</Typography>
              <Select
                id="confirmationTechnique"
                options={techniques.map((technique) => ({
                  value: technique.id,
                  label: technique.titulo,
                }))}
                onChange={(selectedOption) => setSelectedConfirmationTechnique(selectedOption ? selectedOption.value : null)}
                placeholder="Selecciona una técnica de confirmación"
                className="multi-select"
                classNamePrefix="multi-select"
                value={
                  techniques
                    .map((technique) => ({ value: technique.id, label: technique.titulo }))
                    .find(opt => opt.value === selectedConfirmationTechnique) || null
                }
              />
              <TextField
                label="Descripción de la Fuente"
                value={sourceDescription}
                onChange={(e) => setSourceDescription(e.target.value)}
                placeholder="Ingresa una descripción de la fuente"
                required
                fullWidth
                multiline
                minRows={2}
              />
              <Typography variant="subtitle2">Seleccionar Departamentos:</Typography>
              <Select
                id="departments"
                isMulti
                options={departments.map((department) => ({
                  value: department.id,
                  label: department.nombre,
                }))}
                onChange={(selectedOptions) => {
                  setSelectedDepartments(selectedOptions ? selectedOptions.map((option) => option.value) : []);
                }}
                placeholder="Selecciona uno o más departamentos"
                className="multi-select"
                classNamePrefix="multi-select"
                value={departments
                  .filter((department) => selectedDepartments.includes(department.id))
                  .map((department) => ({ value: department.id, label: department.nombre }))}
              />
              <Typography variant="subtitle2">Seleccionar Procesos de Negocio:</Typography>
              <Select
                id="processes"
                isMulti
                options={businessProcesses.map((process) => ({
                  value: process.id,
                  label: process.nombre,
                }))}
                onChange={(selectedOptions) => {
                  setSelectedProcesses(selectedOptions ? selectedOptions.map((option) => option.value) : []);
                }}
                placeholder="Selecciona uno o más procesos"
                className="multi-select"
                classNamePrefix="multi-select"
                value={businessProcesses
                  .filter((process) => selectedProcesses.includes(process.id))
                  .map((process) => ({ value: process.id, label: process.nombre }))}
              />
              <Typography variant="subtitle2">Seleccionar Stakeholder:</Typography>
              <Select
                id="stakeholder"
                options={stakeholders.map((stakeholder) => ({
                  value: stakeholder.id,
                  label: stakeholder.nombre,
                }))}
                onChange={(selectedOption) => setSelectedStakeholder(selectedOption ? selectedOption.value : null)}
                placeholder="Selecciona un Stakeholder"
                className="multi-select"
                classNamePrefix="multi-select"
                value={stakeholders
                  .filter((stakeholder) => stakeholder.id === selectedStakeholder)
                  .map((stakeholder) => ({ value: stakeholder.id, label: stakeholder.nombre }))}
              />
              <Typography variant="subtitle2">Seleccionar Grupo (Opcional):</Typography>
              <Select
                id="group"
                options={groups.map((group) => ({
                  value: group.id,
                  label: group.nombre,
                }))}
                onChange={(selectedOption) => setSelectedGroup(selectedOption ? selectedOption.value : null)}
                placeholder="Selecciona un Grupo (Opcional)"
                className="multi-select"
                classNamePrefix="multi-select"
                value={groups
                  .filter((group) => group.id === selectedGroup)
                  .map((group) => ({ value: group.id, label: group.nombre }))}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/dataproblems")}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Crear Data Problem
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default CargarDataProblem;