import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Container,
  Stack,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import api from "../api"; // <--- AGREGA ESTA LÍNEA
import Header from "../components/Header";
import GenericModal from "../components/GenericModal";
import BotonVolverFijo from "../components/BotonVolverFijo";

function Information() {
  // Data Stage
  const [dataStages, setDataStages] = useState([]);
  const [selectedDataStage, setSelectedDataStage] = useState(null);
  const [isDataStageModalOpen, setIsDataStageModalOpen] = useState(false);

  // Data Quality
  const [dataQualities, setDataQualities] = useState([]);
  const [selectedDataQuality, setSelectedDataQuality] = useState(null);
  const [isDataQualityModalOpen, setIsDataQualityModalOpen] = useState(false);

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

  // Data Stage handlers SOLO para ver detalles
  const openDataStageModal = (item) => {
    setSelectedDataStage(item);
    setIsDataStageModalOpen(true);
  };
  const closeDataStageModal = () => {
    setSelectedDataStage(null);
    setIsDataStageModalOpen(false);
  };

  // Data Quality handlers SOLO para ver detalles
  const openDataQualityModal = (item) => {
    setSelectedDataQuality(item);
    setIsDataQualityModalOpen(true);
  };
  const closeDataQualityModal = () => {
    setSelectedDataQuality(null);
    setIsDataQualityModalOpen(false);
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
            {/* Botón de agregar removido */}
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
            {/* Botón de agregar removido */}
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

      <BotonVolverFijo to="/" label="Volver" />
    </Box>
  );
}

export default Information;