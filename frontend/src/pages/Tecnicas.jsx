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
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../components/Header";

function Tecnicas() {
  const [tecnicas, setTecnicas] = useState([]);
  const [selectedTecnica, setSelectedTecnica] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitulo, setNewTitulo] = useState("");
  const [newDescripcion, setNewDescripcion] = useState("");
  const navigate = useNavigate();

  // Obtener técnicas
  const fetchTecnicas = () => {
    api.get("/api/tecnicas/")
      .then((response) => setTecnicas(response.data))
      .catch((error) => console.error("Error al obtener las técnicas:", error));
  };

  useEffect(() => {
    fetchTecnicas();
  }, []);

  // Abrir modal de detalles
  const openModal = (tecnica) => {
    setSelectedTecnica(tecnica);
    setIsModalOpen(true);
  };

  // Cerrar modal de detalles
  const closeModal = () => {
    setSelectedTecnica(null);
    setIsModalOpen(false);
  };

  // Abrir modal de agregar
  const openAddModal = () => setIsAddModalOpen(true);

  // Cerrar modal de agregar
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewTitulo("");
    setNewDescripcion("");
  };

  // Agregar técnica
  const handleAddTecnica = (event) => {
    event.preventDefault();
    const newTecnica = {
      titulo: newTitulo,
      descripcion: newDescripcion,
    };
    api.post("/api/tecnicas/", newTecnica)
      .then((response) => {
        if (response.status === 201) {
          fetchTecnicas();
          closeAddModal();
        }
      })
      .catch((error) => {
        console.error("Error al agregar la técnica:", error.response?.data || error.message);
        alert("Error al agregar la técnica.");
      });
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Técnicas de Identificación" />
      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="primary">
              Técnicas de Identificación
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={openAddModal}
            >
              Cargar Nueva Técnica
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {tecnicas.map((tecnica) => (
              <Grid
                item
                key={tecnica.id}
                xs={12}
                sm={6}
                md={4}
                lg={4} // Máximo 3 por fila en pantallas grandes
              >
                <Card>
                  <CardActionArea onClick={() => openModal(tecnica)}>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {tecnica.titulo}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Modal Detalles */}
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedTecnica?.titulo}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Descripción:
          </Typography>
          <Typography variant="body1">{selectedTecnica?.descripcion}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Agregar */}
      <Dialog open={isAddModalOpen} onClose={closeAddModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddTecnica}>
          <DialogTitle>Agregar Nueva Técnica</DialogTitle>
          <DialogContent>
            <TextField
              label="Título"
              value={newTitulo}
              onChange={(e) => setNewTitulo(e.target.value)}
              placeholder="Ingresa el título de la técnica"
              required
              fullWidth
              multiline
              minRows={3}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddModal} color="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Agregar Técnica
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Box
        sx={{
          position: "absolute",
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

export default Tecnicas;