import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../components/Header";

function HerramientasDeAnalisis() {
  const [herramientas, setHerramientas] = useState([]);
  const [selectedHerramienta, setSelectedHerramienta] = useState(null);
  const [isHerramientaModalOpen, setIsHerramientaModalOpen] = useState(false);
  const [isAddHerramientaModalOpen, setIsAddHerramientaModalOpen] = useState(false);
  const [newHerramientaTitulo, setNewHerramientaTitulo] = useState("");
  const [newHerramientaDescripcion, setNewHerramientaDescripcion] = useState("");
  const navigate = useNavigate();

  // Obtener herramientas
  const fetchHerramientas = () => {
    api.get("/api/herramientas/")
      .then((response) => setHerramientas(response.data))
      .catch((error) => console.error("Error al obtener las herramientas:", error));
  };

  useEffect(() => {
    fetchHerramientas();
  }, []);

  // Abrir modal de detalles de herramienta
  const openHerramientaModal = (herramienta) => {
    setSelectedHerramienta(herramienta);
    setIsHerramientaModalOpen(true);
  };

  // Cerrar modal de detalles de herramienta
  const closeHerramientaModal = () => {
    setSelectedHerramienta(null);
    setIsHerramientaModalOpen(false);
  };

  // Abrir modal de agregar herramienta
  const openAddHerramientaModal = () => setIsAddHerramientaModalOpen(true);

  // Cerrar modal de agregar herramienta
  const closeAddHerramientaModal = () => {
    setIsAddHerramientaModalOpen(false);
    setNewHerramientaTitulo("");
    setNewHerramientaDescripcion("");
  };

  // Agregar herramienta
  const handleAddHerramienta = (event) => {
    event.preventDefault();
    const newHerramienta = {
      titulo: newHerramientaTitulo,
      descripcion: newHerramientaDescripcion,
    };
    api.post("/api/herramientas/", newHerramienta)
      .then((response) => {
        if (response.status === 201) {
          fetchHerramientas();
          closeAddHerramientaModal();
        }
      })
      .catch((error) => {
        console.error("Error al agregar la herramienta:", error.response?.data || error.message);
        alert("Error al agregar la herramienta.");
      });
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Herramientas de Análisis" />
      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="primary">
              Herramientas de Análisis
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BuildIcon />}
              onClick={openAddHerramientaModal}
            >
              Cargar Nueva Herramienta
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {herramientas.map((herramienta) => (
              <Grid
                item
                key={herramienta.id}
                xs={12}
                sm={6}
                md={4}
                lg={4}
              >
                <Card>
                  <CardActionArea onClick={() => openHerramientaModal(herramienta)}>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {herramienta.titulo}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Modal Detalles Herramienta */}
      <Dialog open={isHerramientaModalOpen} onClose={closeHerramientaModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedHerramienta?.titulo}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Descripción:
          </Typography>
          <Typography variant="body1">{selectedHerramienta?.descripcion}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHerramientaModal} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Agregar Herramienta */}
      <Dialog open={isAddHerramientaModalOpen} onClose={closeAddHerramientaModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddHerramienta}>
          <DialogTitle>Agregar Nueva Herramienta</DialogTitle>
          <DialogContent>
            <TextField
              label="Título"
              value={newHerramientaTitulo}
              onChange={(e) => setNewHerramientaTitulo(e.target.value)}
              placeholder="Ingresa el título de la herramienta"
              required
              fullWidth
              multiline
              sx={{ mb: 2 }}
            />
            <TextField
              label="Descripción"
              value={newHerramientaDescripcion}
              onChange={(e) => setNewHerramientaDescripcion(e.target.value)}
              placeholder="Ingresa la descripción de la herramienta"
              required
              fullWidth
              multiline
              minRows={3}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddHerramientaModal} color="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Agregar Herramienta
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ minWidth: 120 }}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
}

export default HerramientasDeAnalisis;