import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Stack,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../components/Header";
import GenericModal from "../components/GenericModal";
import TextField from "@mui/material/TextField";
import api from "../api";

function Information() {
  // Data Stage
  const [dataStages, setDataStages] = useState([]);
  const [selectedDataStage, setSelectedDataStage] = useState(null);
  const [isDataStageModalOpen, setIsDataStageModalOpen] = useState(false);
  const [isAddDataStageModalOpen, setIsAddDataStageModalOpen] = useState(false);
  const [newDataStageTitulo, setNewDataStageTitulo] = useState("");
  const [newDataStageDescripcion, setNewDataStageDescripcion] = useState("");

  // Data Quality
  const [dataQualities, setDataQualities] = useState([]);
  const [selectedDataQuality, setSelectedDataQuality] = useState(null);
  const [isDataQualityModalOpen, setIsDataQualityModalOpen] = useState(false);
  const [isAddDataQualityModalOpen, setIsAddDataQualityModalOpen] = useState(false);
  const [newDataQualityTitulo, setNewDataQualityTitulo] = useState("");
  const [newDataQualityDescripcion, setNewDataQualityDescripcion] = useState("");

  // Fetch Data Stage
  const fetchDataStages = () => {
    api.get("/api/datastages/")
      .then((response) => setDataStages(response.data))
      .catch((error) => console.error("Error al obtener Data Stages:", error));
  };

  // Fetch Data Quality
  const fetchDataQualities = () => {
    api.get("/api/dataquality/")
      .then((response) => setDataQualities(response.data))
      .catch((error) => console.error("Error al obtener Data Quality:", error));
  };

  useEffect(() => {
    fetchDataStages();
    fetchDataQualities();
  }, []);

  // Data Stage handlers
  const openDataStageModal = (item) => {
    setSelectedDataStage(item);
    setIsDataStageModalOpen(true);
  };
  const closeDataStageModal = () => {
    setSelectedDataStage(null);
    setIsDataStageModalOpen(false);
  };
  const openAddDataStageModal = () => setIsAddDataStageModalOpen(true);
  const closeAddDataStageModal = () => {
    setIsAddDataStageModalOpen(false);
    setNewDataStageTitulo("");
    setNewDataStageDescripcion("");
  };
  const handleAddDataStage = (event) => {
    event.preventDefault();
    const newItem = {
      titulo: newDataStageTitulo,
      descripcion: newDataStageDescripcion,
      es_publica: true, // Siempre público
    };
    api.post("/api/datastages/", newItem)
      .then((response) => {
        if (response.status === 201) {
          fetchDataStages();
          closeAddDataStageModal();
        }
      })
      .catch(() => {
        alert("Error al agregar Data Stage.");
      });
  };

  // Data Quality handlers
  const openDataQualityModal = (item) => {
    setSelectedDataQuality(item);
    setIsDataQualityModalOpen(true);
  };
  const closeDataQualityModal = () => {
    setSelectedDataQuality(null);
    setIsDataQualityModalOpen(false);
  };
  const openAddDataQualityModal = () => setIsAddDataQualityModalOpen(true);
  const closeAddDataQualityModal = () => {
    setIsAddDataQualityModalOpen(false);
    setNewDataQualityTitulo("");
    setNewDataQualityDescripcion("");
  };
  const handleAddDataQuality = (event) => {
    event.preventDefault();
    const newItem = {
      titulo: newDataQualityTitulo,
      descripcion: newDataQualityDescripcion,
      es_publica: true, // Siempre público
    };
    api.post("/api/dataquality/", newItem)
      .then((response) => {
        if (response.status === 201) {
          fetchDataQualities();
          closeAddDataQualityModal();
        }
      })
      .catch(() => {
        alert("Error al agregar Data Quality.");
      });
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Información de Data Stage y Data Quality" />
      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        {/* Sección Data Stage */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="primary">
              Etapa de Datos
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={openAddDataStageModal}
            >
              Cargar Nueva Etapa de Datos
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {dataStages.map((item) => (
              <Grid
                item
                key={item.id}
                xs={12}
                sm={6}
                md={4}
                lg={4}
              >
                <Card>
                  <CardActionArea onClick={() => openDataStageModal(item)}>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {item.titulo}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Sección Data Quality */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" color="primary">
              Dimiención de Calidad
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={openAddDataQualityModal}
            >
              Cargar Nueva Dimiención de Calidad
            </Button>
          </Stack>
          <Grid container spacing={2}>
            {dataQualities.map((item) => (
              <Grid
                item
                key={item.id}
                xs={12}
                sm={6}
                md={4}
                lg={4}
              >
                <Card>
                  <CardActionArea onClick={() => openDataQualityModal(item)}>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {item.titulo}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Modal Detalles Data Stage */}
      <GenericModal
        open={isDataStageModalOpen}
        onClose={closeDataStageModal}
        title={selectedDataStage?.titulo || ""}
        hideActions
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Descripción:
        </Typography>
        <Typography variant="body1">{selectedDataStage?.descripcion}</Typography>
      </GenericModal>

      {/* Modal Agregar Data Stage */}
      <GenericModal
        open={isAddDataStageModalOpen}
        onClose={closeAddDataStageModal}
        onSubmit={handleAddDataStage}
        title="Agregar Nuevo Data Stage"
        submitText="Agregar Data Stage"
        cancelText="Cancelar"
      >
        <TextField
          label="Título"
          value={newDataStageTitulo}
          onChange={(e) => setNewDataStageTitulo(e.target.value)}
          placeholder="Ingresa el título"
          required
          fullWidth
          multiline
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descripción"
          value={newDataStageDescripcion}
          onChange={(e) => setNewDataStageDescripcion(e.target.value)}
          placeholder="Ingresa la descripción"
          required
          fullWidth
          multiline
          minRows={3}
          sx={{ mb: 2 }}
        />
      </GenericModal>

      {/* Modal Detalles Data Quality */}
      <GenericModal
        open={isDataQualityModalOpen}
        onClose={closeDataQualityModal}
        title={selectedDataQuality?.titulo || ""}
        hideActions
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Descripción:
        </Typography>
        <Typography variant="body1">{selectedDataQuality?.descripcion}</Typography>
      </GenericModal>

      {/* Modal Agregar Data Quality */}
      <GenericModal
        open={isAddDataQualityModalOpen}
        onClose={closeAddDataQualityModal}
        onSubmit={handleAddDataQuality}
        title="Agregar Nuevo Data Quality"
        submitText="Agregar Data Quality"
        cancelText="Cancelar"
      >
        <TextField
          label="Título"
          value={newDataQualityTitulo}
          onChange={(e) => setNewDataQualityTitulo(e.target.value)}
          placeholder="Ingresa el título"
          required
          fullWidth
          multiline
          sx={{ mb: 2 }}
        />
        <TextField
          label="Descripción"
          value={newDataQualityDescripcion}
          onChange={(e) => setNewDataQualityDescripcion(e.target.value)}
          placeholder="Ingresa la descripción"
          required
          fullWidth
          multiline
          minRows={3}
          sx={{ mb: 2 }}
        />
      </GenericModal>

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
          onClick={() => window.history.back()}
          sx={{ minWidth: 120 }}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
}

export default Information;