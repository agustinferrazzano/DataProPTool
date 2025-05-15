import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Header from "../components/Header";
import NavBoton from "../components/NavBoton";
import GenericModal from "../components/GenericModal";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Container,
  TextField,
  List,
  ListItem,
} from "@mui/material";
import Select from "react-select";

function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [processes, setProcess] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [org, setUsuario] = useState([{}]);
  const navigate = useNavigate();

  const handlegetStakeholder = () => {
    api
      .get("/api/stakeholders/")
      .then((response) => setStakeholders(response.data))
      .catch((error) => console.error("Error fetching stakeholders:", error));
  };

  useEffect(() => {
    handlegetStakeholder();
  }, []);

  const handlegetProcesos = () => {
    api
      .get("/api/procesos/")
      .then((response) => setProcess(response.data))
      .catch((error) => console.error("Error fetching procesos:", error));
  };

  useEffect(() => {
    handlegetProcesos();
  }, []);

  const handlegetDepartamentos = () => {
    api
      .get("/api/departamentos/")
      .then((response) => setDepartamentos(response.data))
      .catch((error) => console.error("Error fetching departamentos:", error));
  };

  useEffect(() => {
    handlegetDepartamentos();
  }, []);

  const handlegetOrg = () => {
    api
      .get("/api/usuarios/")
      .then((response) => setUsuario(response.data))
      .catch((error) => console.error("Error al obtener los usuarios:", error.response?.data || error.message));
  };

  useEffect(() => {
    handlegetOrg();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (departmentName && departmentDescription) {
      const newDepartamento = {
        nombre: departmentName,
        tipo: "Departamento",
        descripcion: departmentDescription,
        procesos_ids: selectedProcess,
        stakeholder_ids: selectedStakeholder,
        organizacion: org[0].id,
      };
      api
        .post("/api/departamentos/", newDepartamento)
        .then((response) => {
          if (response.status === 201) {
            setDepartmentName("");
            setDepartmentDescription("");
            setSelectedProcess([]);
            setSelectedStakeholder([]);
            handlegetDepartamentos();
            setIsModalOpen(false);
            alert("Departamento cargado correctamente.");
          } else {
            alert("Error al cargar el departamento.");
          }
        });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Gestión de Departamentos Organizacionales" onLogout={handleLogout} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Gestión de Departamentos Organizacionales
          </Typography>

          <Box my={4}>
            <Typography variant="h6" color="primary">
              Departamentos Cargados
            </Typography>
            {departamentos.length > 0 ? (
              <List>
                {departamentos.map((departamento, index) => (
                  <ListItem key={index} divider>
                    <Stack direction="row" spacing={4} width="100%" alignItems="center">
                      <Typography variant="subtitle1" sx={{ minWidth: 180, fontWeight: 500 }}>
                        {departamento.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {departamento.descripcion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Procesos: {departamento.procesos?.map((proceso) => proceso.nombre).join(", ")}
                        {departamento.procesos?.length && departamento.stakeholder?.length ? " | " : ""}
                        Stakeholders: {departamento.stakeholder?.map((role) => role.nombre).join(", ")}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No hay Departamentos cargados.</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Cargar Nuevo Departamento
            </Button>
          </Stack>
        </Paper>
      </Container>

      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          right: 24,
        }}
      >
        <NavBoton to="/datos-org" variant="outlined" color="secondary" sx={{ minWidth: 120 }}>
          Volver
        </NavBoton>
      </Box>

      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Cargar Nuevo Departamento"
        submitText="Cargar"
        cancelText="Cancelar"
        selectSection={
          <>
            <label htmlFor="processSelect">Seleccionar Procesos:</label>
            <Select
              id="processSelect"
              isMulti
              options={processes.map(proceso => ({
                value: proceso.id,
                label: proceso.nombre
              }))}
              value={processes
                .filter(proceso => selectedProcess.includes(proceso.id))
                .map(proceso => ({ value: proceso.id, label: proceso.nombre }))}
              onChange={selectedOptions => {
                setSelectedProcess(selectedOptions ? selectedOptions.map(opt => opt.value) : []);
              }}
              className="multi-select"
              classNamePrefix="multi-select"
              placeholder="Selecciona uno o más procesos"
            />
            <label htmlFor="stakeholderSelect" style={{ marginTop: 16 }}>Seleccionar Stakeholders:</label>
            <Select
              id="stakeholderSelect"
              isMulti
              options={stakeholders.map(stakeholder => ({
                value: stakeholder.id,
                label: stakeholder.nombre
              }))}
              value={stakeholders
                .filter(stakeholder => selectedStakeholder.includes(stakeholder.id))
                .map(stakeholder => ({ value: stakeholder.id, label: stakeholder.nombre }))}
              onChange={selectedOptions => {
                setSelectedStakeholder(selectedOptions ? selectedOptions.map(opt => opt.value) : []);
              }}
              className="multi-select"
              classNamePrefix="multi-select"
              placeholder="Selecciona uno o más stakeholders"
            />
          </>
        }
      >
        <TextField
          label="Nombre del Departamento"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción del Departamento"
          value={departmentDescription}
          onChange={(e) => setDepartmentDescription(e.target.value)}
          required
          fullWidth
          multiline
          minRows={3}
        />
      </GenericModal>
    </Box>
  );
}

export default DepartamentosPage;