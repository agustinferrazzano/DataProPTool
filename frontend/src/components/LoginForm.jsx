import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  InputAdornment,
} from "@mui/material";

function LoginForm({ route }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post(route, { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
    } catch (error) {
      setErrorMsg("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={8}
      p={4}
      bgcolor="white"
      borderRadius={2}
      boxShadow={3}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="h5" align="center" color="primary">
            Iniciar Sesión
          </Typography>
          {errorMsg && (
            <Typography color="error" align="center" variant="body2">
              {errorMsg}
            </Typography>
          )}
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            fullWidth
          />
          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowPassword((show) => !show)}
                    size="small"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputAdornment>
              ),
            }}
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
            Ingresar
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

export default LoginForm;