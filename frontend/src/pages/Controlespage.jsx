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

function ControlesPage() {
  const [policyName, setPolicyName] = useState("");
  const [politicaDescription, setDescripcion] = useState("");
  const [controls, setControls] = useState([]);
  const [org, setUsuario] = useState([{}]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlegetControls = () => {
    api
      .get("/api/controles/")
      .then((response) => {
        setControls(response.data);
      })
      .catch((error) => {
        console.error("Error fetching controls:", error);
      });
  };

  const handlegetOrg = () => {
    api
      .get("/api/usuarios/")
      .then((response) => {
        setUsuario(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error.response?.data || error.message);
      });
  };

  useEffect(() => {
    handlegetControls();
    handlegetOrg();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (policyName && politicaDescription) {
      const newControl = {
        nombre: policyName,
        tipo: "politica",
        descripcion: politicaDescription,
        organizacion: org[0].id,
      };
      api
        .post("/api/controles/", newControl)
        .then((response) => {
          if (response.status === 201) {
            setPolicyName("");
            setDescripcion("");
            handlegetControls();
            setIsModalOpen(false);
            alert("Política cargada correctamente.");
          } else {
            alert("Error al cargar la política.");
          }
        })
        .catch(() => alert("Error al cargar la política."));
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
      <Header title="Gestión de Políticas" onLogout={handleLogout} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Gestión de Políticas
          </Typography>

          <Box my={4}>
            <Typography variant="h6" color="primary">
              Controles Cargados
            </Typography>
            {controls.length > 0 ? (
              <List>
                {controls.map((control, index) => (
                  <ListItem key={index} divider>
                    <Stack direction="row" spacing={4} width="100%" alignItems="center">
                      <Typography variant="subtitle1" sx={{ minWidth: 180, fontWeight: 500 }}>
                        {control.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {control.descripcion}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => {/* lógica para modificar el control */}}
                      >
                        Modificar
                      </Button>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No hay controles cargados.</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Cargar Nueva Política
            </Button>
          </Stack>
        </Paper>
      </Container>
      <Box
        sx={{
          position: "fixed", // Cambia de absolute a fixed
          bottom: 24,
          right: 24,
          zIndex: 1200, // Asegura que quede por encima del contenido
        }}
      >
        <NavBoton to="/datos-org" variant="outlined" color="secondary" sx={{ minWidth: 120 }}>
          Volver
        </NavBoton>
      </Box>

      {/* Modal para cargar nueva política usando GenericModal */}
      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Cargar Nuevas Políticas"
        submitText="Cargar"
        cancelText="Cancelar"
      >
        <TextField
          label="Nombre de la Política"
          value={policyName}
          onChange={(e) => setPolicyName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción de la Política"
          value={politicaDescription}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          fullWidth
          multiline
          minRows={3}
        />
      </GenericModal>
    </Box>
  );
}

export default ControlesPage;