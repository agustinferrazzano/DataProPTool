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

function ProcesosPage() {
  const [systems, setSistemas] = useState([]);
  const [process, setProcess] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState([]);
  const [processName, setProcessName] = useState("");
  const [processDescription, setProcessDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [org, setUsuario] = useState([{}]);
  const navigate = useNavigate();

  const handlegetSistemas = () => {
    api
      .get("/api/sistemas/")
      .then((response) => setSistemas(response.data))
      .catch((error) => {
        console.error("Error fetching sistemas:", error);
      });
  };

  useEffect(() => {
    handlegetSistemas();
  }, []);

  const handlegetProcesos = () => {
    api
      .get("/api/procesos/")
      .then((response) => setProcess(response.data))
      .catch((error) => {
        console.error("Error fetching procesos:", error);
      });
  };

  useEffect(() => {
    handlegetProcesos();
  }, []);

  const handlegetOrg = () => {
    api
      .get("/api/usuarios/")
      .then((response) => setUsuario(response.data))
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error.response?.data || error.message);
      });
  };

  useEffect(() => {
    handlegetOrg();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (processName && processDescription) {
      const newProcess = {
        nombre: processName,
        tipo: "Proceso de negocio",
        descripcion: processDescription,
        sistema_ids: selectedSystem,
        organizacion: org[0].id,
      };
      api
        .post("/api/procesos/", newProcess)
        .then((response) => {
          if (response.status === 201) {
            setProcessName("");
            setProcessDescription("");
            setSelectedSystem([]);
            handlegetProcesos();
            setIsModalOpen(false);
            alert("Proceso cargado correctamente.");
          } else {
            alert("Error al cargar el proceso.");
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
      <Header title="Gestión de Procesos Organizacionales" onLogout={handleLogout} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Gestión de Procesos Organizacionales
          </Typography>

          <Box my={4}>
            <Typography variant="h6" color="primary">
              Procesos Cargados
            </Typography>
            {process.length > 0 ? (
              <List>
                {process.map((proces, index) => (
                  <ListItem key={index} divider>
                    <Stack direction="row" spacing={4} width="100%" alignItems="center">
                      <Typography variant="subtitle1" sx={{ minWidth: 180, fontWeight: 500 }}>
                        {proces.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {proces.descripcion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Sistemas: {proces.sistema?.map((sistema) => sistema.nombre).join(", ")}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No hay Procesos cargados.</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Cargar Nuevo Proceso
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

      {/* Modal para cargar nuevo proceso usando GenericModal */}
      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Cargar Nuevo Proceso"
        submitText="Cargar"
        cancelText="Cancelar"
        selectSection={
          <>
            <label htmlFor="systemSelect">Seleccionar Sistemas:</label>
            <Select
              id="systemSelect"
              isMulti
              options={systems.map(system => ({
                value: system.id,
                label: system.nombre
              }))}
              value={systems
                .filter(system => selectedSystem.includes(system.id))
                .map(system => ({ value: system.id, label: system.nombre }))}
              onChange={selectedOptions => {
                setSelectedSystem(selectedOptions ? selectedOptions.map(opt => opt.value) : []);
              }}
              className="multi-select"
              classNamePrefix="multi-select"
              placeholder="Selecciona uno o más sistemas"
            />
          </>
        }
      >
        <TextField
          label="Nombre del Proceso"
          value={processName}
          onChange={(e) => setProcessName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción del Proceso"
          value={processDescription}
          onChange={(e) => setProcessDescription(e.target.value)}
          required
          fullWidth
          multiline
          minRows={3}
        />
      </GenericModal>
    </Box>
  );
}

export default ProcesosPage;