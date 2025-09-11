import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Header from "../components/Header";
import NavBoton from "../components/NavBoton";
import GenericModal from "../components/GenericModal";
import BotonVolverFijo from "../components/BotonVolverFijo"; // Agrega este import
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

function SistemasPage() {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState([]);
  const [systemName, setSystemName] = useState("");
  const [systemDescription, setSystemDescription] = useState("");
  const [system, setSistemas] = useState([]);
  const [org, setUsuario] = useState([{}]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlegetSistemas = () => {
    api
      .get("/api/sistemas/")
      .then((response) => setSistemas(response.data))
      .catch((error) => console.error("Error fetching sistemas:", error));
  };

  useEffect(() => {
    handlegetSistemas();
  }, []);

  const handlegetRepos = () => {
    api
      .get("/api/repositorios/")
      .then((response) => setRepositories(response.data))
      .catch((error) => console.error("Error fetching repositorios:", error));
  };

  useEffect(() => {
    handlegetRepos();
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
    if (systemName && systemDescription) {
      const newSystem = {
        nombre: systemName,
        tipo: "Sistema",
        descripcion: systemDescription,
        repositorio_ids: selectedRepo,
        organizacion: org[0].id,
      };
      api
        .post("/api/sistemas/", newSystem)
        .then((response) => {
          if (response.status === 201) {
            setSystemName("");
            setSystemDescription("");
            setSelectedRepo([]);
            handlegetSistemas();
            setIsModalOpen(false);
            alert("Sistema cargado correctamente.");
          } else {
            alert("Error al cargar el sistema.");
          }
        })
        .catch(() => alert("Error al cargar el sistema."));
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
      <Header title="Gestión de Sistemas" onLogout={handleLogout} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Gestión de Sistemas
          </Typography>

          <Box my={4}>
            <Typography variant="h6" color="primary">
              Sistemas Cargados
            </Typography>
            {system.length > 0 ? (
              <List>
                {system.map((sistema, index) => (
                  <ListItem key={index} divider>
                    <Stack direction="row" spacing={4} width="100%" alignItems="center">
                      <Typography variant="subtitle1" sx={{ minWidth: 180, fontWeight: 500 }}>
                        {sistema.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {sistema.descripcion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Repositorios: {sistema.repositorio?.map((repo) => repo.nombre).join(", ")}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No hay sistemas cargados.</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Cargar Nuevo Sistema
            </Button>
          </Stack>
        </Paper>
      </Container>

      <BotonVolverFijo to="/datos-org" label="Volver" /> {/* Usa el componente aquí */}

      {/* Modal para cargar nuevo sistema usando GenericModal */}
      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Cargar Nuevo Sistema"
        submitText="Cargar"
        cancelText="Cancelar"
        selectSection={
          <Box sx={{ mb: 2 }}>
            <label htmlFor="repoSelect" style={{ display: "block", marginBottom: 8 }}>
              Seleccionar Repositorios:
            </label>
            <Select
              id="repoSelect"
              isMulti
              options={repositories.map(repo => ({
                value: repo.id,
                label: repo.nombre
              }))}
              value={repositories
                .filter(repo => selectedRepo.includes(repo.id))
                .map(repo => ({ value: repo.id, label: repo.nombre }))}
              onChange={selectedOptions => {
                setSelectedRepo(selectedOptions ? selectedOptions.map(opt => opt.value) : []);
              }}
              className="multi-select"
              classNamePrefix="select"
              placeholder="Selecciona uno o más repositorios"
              menuPlacement="top" // <-- Esto hace que el menú se muestre hacia arriba
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                  maxHeight: 200,
                }),
              }}
            />
          </Box>
        }
      >
        <TextField
          label="Nombre del Sistema"
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción del Sistema"
          value={systemDescription}
          onChange={(e) => setSystemDescription(e.target.value)}
          required
          fullWidth
          multiline
          minRows={3}
        />
      </GenericModal>
    </Box>
  );
}

export default SistemasPage;