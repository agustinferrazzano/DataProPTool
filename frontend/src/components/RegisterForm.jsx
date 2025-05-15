import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";

function RegisterForm({ route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        username,
        password,
        email,
        org_profile: {
          nombre,
          descripcion,
        },
      };

      await api.post(route, data);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Error al registrar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10} p={4} bgcolor="white" borderRadius={2} boxShadow={3}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h5" align="center" color="primary">
            Registro
          </Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Usuario"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Nombre del perfil organizacional"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Descripción del perfil organizacional"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            fullWidth
            multiline
            minRows={2}
          />
          {loading && (
            <Box textAlign="center">
              <CircularProgress color="primary" size={24} />
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            fullWidth
          >
            Registrar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/home")}
            fullWidth
          >
            Cancelar
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default RegisterForm;