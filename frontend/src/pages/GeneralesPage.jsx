import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Stack, TextField, Typography, List, ListItem } from "@mui/material";
import api from "../api";
import Header from "../components/Header";
import GenericModal from "../components/GenericModal";
import BotonVolverFijo from "../components/BotonVolverFijo";

function GeneralesPage() {
  const [organization, setOrganization] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  const loadOrganization = () => {
    setIsLoading(true);
    api
      .get("/api/org-profile/")
      .then((response) => {
        const nextOrganization = {
          nombre: response.data?.nombre || "",
          descripcion: response.data?.descripcion || "",
          username: response.data?.username || "",
          email: response.data?.email || "",
        };

        setOrganization(nextOrganization);
        setDraftName(nextOrganization.nombre);
        setDraftDescription(nextOrganization.descripcion);
      })
      .catch((error) => {
        console.error("Error al obtener la información general:", error);
        setOrganization({ nombre: "", descripcion: "", username: "", email: "" });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrganization();
  }, []);

  const handleOpenModal = () => {
    if (organization) {
      setDraftName(organization.nombre);
      setDraftDescription(organization.descripcion);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    api
      .post("/api/org-profile/", {
        nombre: draftName,
        descripcion: draftDescription,
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201 || response.status === 202) {
          setOrganization((prev) => ({
            ...(prev || {}),
            nombre: draftName,
            descripcion: draftDescription,
            username: response.data?.username || prev?.username || "",
            email: response.data?.email || prev?.email || "",
          }));
          setIsModalOpen(false);
          alert("Datos generales cargados correctamente.");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar los datos generales:", error.response?.data || error.message);
        alert("No se pudieron cargar los datos generales.");
      });
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Datos Generales" onLogout={handleLogout} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Datos Generales
          </Typography>

          {isLoading ? (
            <Typography align="center" color="text.secondary" sx={{ my: 6 }}>
              Cargando información general...
            </Typography>
          ) : organization ? (
            <Box my={4}>
              <Typography variant="h6" color="primary">
                Datos generales cargados
              </Typography>
              <List>
                <ListItem divider>
                  <Stack spacing={0.5} width="100%">
                    <Typography variant="subtitle2" color="text.secondary">
                      Nombre de la organización
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {organization.nombre || "Sin nombre registrado"}
                    </Typography>
                  </Stack>
                </ListItem>
                <ListItem divider>
                  <Stack spacing={0.5} width="100%">
                    <Typography variant="subtitle2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1">
                      {organization.descripcion || "Sin descripción registrada"}
                    </Typography>
                  </Stack>
                </ListItem>
                <ListItem divider>
                  <Stack spacing={0.5} width="100%">
                    <Typography variant="subtitle2" color="text.secondary">
                      Cuenta asociada
                    </Typography>
                    <Typography variant="body1">
                      {organization.username || "Sin usuario"}
                      {organization.email ? ` · ${organization.email}` : ""}
                    </Typography>
                  </Stack>
                </ListItem>
              </List>

              <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                  Cargar / Actualizar Datos Generales
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box my={4}>
              <Typography color="text.secondary" align="center" sx={{ my: 3 }}>
                Aún no hay datos generales cargados.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                  Cargar Datos Generales
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>
      </Container>

      <BotonVolverFijo to="/datos-org" label="Volver" />

      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Cargar Datos Generales"
        submitText="Cargar"
        cancelText="Cancelar"
      >
        <TextField
          label="Nombre de la organización"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Descripción"
          value={draftDescription}
          onChange={(e) => setDraftDescription(e.target.value)}
          required
          fullWidth
          multiline
          minRows={4}
        />
      </GenericModal>
    </Box>
  );
}

export default GeneralesPage;