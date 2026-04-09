import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Stack, TextField, Typography, List, ListItem } from "@mui/material";
import api from "../api";
import Header from "../components/Header";
import GenericModal from "../components/GenericModal";
import BotonVolverFijo from "../components/BotonVolverFijo";

function GeneralesPage() {
  const [organization, setOrganization] = useState(null);
  const [orgUserId, setOrgUserId] = useState(null);
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
      .get("/api/usuarios/")
      .then((response) => {
        const users = response.data || [];
        const firstUser = users[0] || null;

        if (!firstUser) {
          setOrganization(null);
          setOrgUserId(null);
          return;
        }

        const profile = firstUser.org_profile || {};
        const nextOrganization = {
          nombre: profile.nombre || "",
          descripcion: profile.descripcion || "",
          username: firstUser.username || "",
          email: firstUser.email || "",
          miembros: users.length,
        };

        setOrganization(nextOrganization);
        setOrgUserId(firstUser.id);
        setDraftName(nextOrganization.nombre);
        setDraftDescription(nextOrganization.descripcion);
      })
      .catch((error) => {
        console.error("Error al obtener la información general:", error);
        setOrganization(null);
        setOrgUserId(null);
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

    if (!orgUserId) {
      alert("No se encontró la organización para actualizar.");
      return;
    }

    api
      .patch(`/api/usuarios/${orgUserId}/`, {
        org_profile: {
          nombre: draftName,
          descripcion: draftDescription,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 202) {
          setOrganization((prev) => ({
            ...(prev || {}),
            nombre: draftName,
            descripcion: draftDescription,
          }));
          setIsModalOpen(false);
          alert("Datos generales actualizados correctamente.");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar los datos generales:", error.response?.data || error.message);
        alert("No se pudieron actualizar los datos generales.");
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
                Información de la organización
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
                <ListItem>
                  <Stack spacing={0.5} width="100%">
                    <Typography variant="subtitle2" color="text.secondary">
                      Usuarios vinculados
                    </Typography>
                    <Typography variant="body1">
                      {organization.miembros}
                    </Typography>
                  </Stack>
                </ListItem>
              </List>

              <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                  Editar Datos Generales
                </Button>
              </Stack>
            </Box>
          ) : (
            <Typography color="text.secondary" align="center" sx={{ my: 6 }}>
              No se encontró información general para mostrar.
            </Typography>
          )}
        </Paper>
      </Container>

      <BotonVolverFijo to="/datos-org" label="Volver" />

      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Editar Datos Generales"
        submitText="Guardar"
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