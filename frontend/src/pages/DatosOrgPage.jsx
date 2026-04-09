import { useNavigate } from "react-router-dom";
import { Box, Paper, Stack, Container } from "@mui/material";
import Header from "../components/Header";
import NavBoton from "../components/NavBoton";
import BotonVolverFijo from "../components/BotonVolverFijo"; // Importa el componente

function DatosOrgPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/home");
    };

    return (
        <Box minHeight="100vh" bgcolor="#f7fafc" position="relative">
            {/* Nuevo Header con Material UI */}
            <Header title="Datos Organizacionales" onLogout={handleLogout} />

            {/* Cuerpo */}
            <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
                <Paper elevation={2} sx={{ p: 4, position: "relative", minHeight: 400, mt: 3 }}>  
                    <Stack spacing={2} alignItems="center" mt={2} justifyContent="center">
                        <NavBoton to="/generales" variant="contained" color="primary" sx={{ minWidth: 320, mt: 4 }}>
                            Generales
                        </NavBoton>
                        <NavBoton to="/Controles" variant="contained" color="primary" sx={{ minWidth: 320 }}>
                            Controles
                        </NavBoton>
                        <NavBoton to="/repositorio" variant="contained" color="primary" sx={{ minWidth: 320 }}>
                            Repositorios de Datos
                        </NavBoton>
                        <NavBoton to="/sistemas" variant="contained" color="primary" sx={{ minWidth: 320 }}>
                            Sistemas de Información
                        </NavBoton>
                        <NavBoton to="/procesos" variant="contained" color="primary" sx={{ minWidth: 320 }}>
                            Procesos de Negocio
                        </NavBoton>
                        <NavBoton to="/stakeholders" variant="contained" color="primary" sx={{ minWidth: 320 }}>
                            Stakeholders
                        </NavBoton>
                        <NavBoton to="/persons" variant="contained" color="primary" sx={{ minWidth: 320 }}>
                            Personas
                        </NavBoton>
                        <NavBoton to="/departamentos" variant="contained" color="primary" sx={{ minWidth: 320 }}>
                            Departamentos Organizacionales
                        </NavBoton>
                    </Stack>
                </Paper>
            </Container>
            <BotonVolverFijo to="/" label="Volver" /> {/* Usa el componente aquí */}
        </Box>
    );
}

export default DatosOrgPage;