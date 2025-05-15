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

function StakeholderPage() {
  const [processes, setProcess] = useState([]);
  const [stakeholders, setStakeholder] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [org, setUsuario] = useState([{}]);
  const navigate = useNavigate();

  const handlegetStakeholder = () => {
    api
      .get("/api/stakeholders/")
      .then((response) => setStakeholder(response.data))
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
    if (roleName && roleDescription) {
      const newRole = {
        nombre: roleName,
        tipo: "stakeholder",
        descripcion_rol: roleDescription,
        procesos_ids: selectedProcess,
        organizacion: org[0].id,
      };
      api
        .post("/api/stakeholders/", newRole)
        .then((response) => {
          if (response.status === 201) {
            setRoleName("");
            setRoleDescription("");
            setSelectedProcess([]);
            handlegetStakeholder();
            setIsModalOpen(false);
            alert("Stakeholder cargado correctamente.");
          } else {
            alert("Error al cargar el Stakeholder.");
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
      <Header title="Gestión de Cargos Organizacionales" onLogout={handleLogout} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Gestión de Cargos Organizacionales
          </Typography>

          <Box my={4}>
            <Typography variant="h6" color="primary">
              Stakeholders Cargados
            </Typography>
            {stakeholders.length > 0 ? (
              <List>
                {stakeholders.map((role, index) => (
                  <ListItem key={index} divider>
                    <Stack direction="row" spacing={4} width="100%" alignItems="center">
                      <Typography variant="subtitle1" sx={{ minWidth: 180, fontWeight: 500 }}>
                        {role.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {role.descripcion_rol}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Procesos: {role.procesos?.map((proceso) => proceso.nombre).join(", ")}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No hay Stakeholders cargados.</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Cargar Nuevo Cargo
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
        title="Cargar Nuevo Cargo"
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
          </>
        }
      >
        <TextField
          label="Nombre del Cargo"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción del Cargo"
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          required
          fullWidth
          multiline
          minRows={3}
        />
      </GenericModal>
    </Box>
  );
}

export default StakeholderPage;