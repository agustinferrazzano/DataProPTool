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

function RepositorioPage() {
  const [repositories, setRepositories] = useState([]);
  const [repoName, setRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [org, setUsuario] = useState([{}]);
  const navigate = useNavigate();

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
    if (repoName && repoDescription) {
      const newRepository = {
        nombre: repoName,
        tipo: "repositorio",
        descripcion: repoDescription,
        organizacion: org[0].id,
      };
      api
        .post("/api/repositorios/", newRepository)
        .then((response) => {
          if (response.status === 201) {
            setRepoName("");
            setRepoDescription("");
            handlegetRepos();
            setIsModalOpen(false);
            alert("Repositorio cargado correctamente.");
          } else {
            alert("Error al cargar el repositorio.");
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
      <Header title="Gestión de Repositorios" onLogout={handleLogout} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Gestión de Repositorios
          </Typography>

          <Box my={4}>
            <Typography variant="h6" color="primary">
              Repositorios Cargados
            </Typography>
            {repositories.length > 0 ? (
              <List>
                {repositories.map((repo, index) => (
                  <ListItem key={index} divider>
                    <Stack direction="row" spacing={4} width="100%" alignItems="center">
                      <Typography variant="subtitle1" sx={{ minWidth: 180, fontWeight: 500 }}>
                        {repo.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {repo.descripcion}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No hay repositorios cargados.</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Cargar Nuevo Repositorio
            </Button>
          </Stack>
        </Paper>
      </Container>

      <BotonVolverFijo to="/datos-org" label="Volver" /> {/* Usa el componente aquí */}

      {/* Modal para cargar nuevo repositorio usando GenericModal */}
      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Cargar Nuevo Repositorio"
        submitText="Cargar"
        cancelText="Cancelar"
      >
        <TextField
          label="Nombre del Repositorio"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción"
          value={repoDescription}
          onChange={(e) => setRepoDescription(e.target.value)}
          required
          fullWidth
          multiline
          minRows={3}
        />
      </GenericModal>
    </Box>
  );
}

export default RepositorioPage;