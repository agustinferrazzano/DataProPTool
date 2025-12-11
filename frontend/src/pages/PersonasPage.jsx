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

function PersonasPage() {
  const [persons, setPersons] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [personName, setPersonName] = useState("");
  const [personApellido, setpersonApellido] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [org, setUsuario] = useState([{}]);
  const navigate = useNavigate();

  const handlegetStakeholder = () => {
    api
      .get("/api/stakeholders/")
      .then((response) => setStakeholders(response.data))
      .catch((error) => console.error("Error fetching stakeholders:", error));
  };

  useEffect(() => {
    handlegetStakeholder();
  }, []);


  const handlegetPersonas = () => {
    api
      .get("/api/personas/")
      .then((response) => setPersons(response.data))
      .catch((error) => console.error("Error fetching personas:", error));
  };

  useEffect(() => {
    handlegetPersonas();
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
    if (personName && personApellido && selectedStakeholder) {
      const newPersona = {
        nombre: personName,
        apellido: personApellido,
        rol_id: selectedStakeholder,
        organizacion: org[0].id,
      };
      api
        .post("/api/personas/", newPersona)
        .then((response) => {
          if (response.status === 201) {
            setPersonName("");
            setpersonApellido("");
            setSelectedStakeholder([]);
            setIsModalOpen(false);
            handlegetPersonas();
            alert("Persona cargada correctamente.");
          } else {
            alert("Error al cargar el departamento.");
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
      <Header title="Gestión de Departamentos Organizacionales" onLogout={handleLogout} />

      <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Gestión de Personal Organizacional
          </Typography>

          <Box my={4}>
            <Typography variant="h6" color="primary">
              Personal Cargado
            </Typography>
            {persons.length > 0 ? (
              <List>
                {persons.map((persona, index) => (
                  <ListItem key={index} divider>
                    <Stack direction="row" spacing={4} width="100%" alignItems="center">
                      <Typography variant="subtitle1" sx={{ minWidth: 180, fontWeight: 500 }}>
                        {persona.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {persona.apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {persona.rol ? persona.rol.nombre : "Sin rol asignado"}
                      </Typography>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">No hay personas cargados.</Typography>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Cargar Nueva Persona
            </Button>
          </Stack>
        </Paper>
      </Container>

      <BotonVolverFijo to="/datos-org" label="Volver" /> {/* Usa el componente aquí */}

      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Cargar Nueva Persona"
        submitText="Cargar"
        cancelText="Cancelar"
        selectSection={
          <>
            <label htmlFor="stakeholderSelect" style={{ marginTop: 16 }}>Seleccionar Rol:</label>
            <Select
              id="stakeholderSelect"
              options={stakeholders.map(stakeholder => ({
                value: stakeholder.id,
                label: stakeholder.nombre
              }))}
              value={
                stakeholders
                  .filter(stakeholder => stakeholder.id === selectedStakeholder)
                  .map(stakeholder => ({ value: stakeholder.id, label: stakeholder.nombre }))[0] || null
              }
              onChange={selectedOption => {
                setSelectedStakeholder(selectedOption ? selectedOption.value : null);
              }}
              className="multi-select"
              classNamePrefix="multi-select"
              placeholder="Selecciona un rol"
              menuPlacement="auto"
              isSearchable
              isClearable
              menuPortalTarget={document.body} // <-- Esto permite que el menú se muestre fuera del modal
              styles={{
                menuPortal: base => ({ ...base, zIndex: 20000 }), // <-- Asegura que el menú esté por encima del modal
                menu: (provided) => ({
                  ...provided,
                  zIndex: 20000,
                  maxHeight: 200,
                  overflowY: 'auto',  
                }),
              }}
            />
          </>
        }
      >
        <TextField
          label="Nombre de la Persona"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Apellido de la Persona"
          value={personApellido}
          onChange={(e) => setpersonApellido(e.target.value)}
          required
          fullWidth
          minRows={3}
        />
      </GenericModal>
    </Box>
  );
}

export default PersonasPage;