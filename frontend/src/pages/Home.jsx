import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography, Paper, Container, Grid, Card, CardContent } from "@mui/material";
import { Analytics, DataUsage, Assessment, Security } from "@mui/icons-material";

function Home() {
  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      {/* Encabezado */}
      <Paper
        component="header"
        elevation={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          bgcolor: "white",
        }}
      >
        <Typography variant="h3" color="primary" fontWeight="bold">
          DataProPTool
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            component={Link} 
            to="/login" 
            variant="outlined" 
            color="primary"
            size="large"
          >
            Iniciar Sesión
          </Button>
          <Button 
            component={Link} 
            to="/register" 
            variant="contained" 
            color="primary"
            size="large"
          >
            Registrarse
          </Button>
        </Stack>
      </Paper>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" color="primary" fontWeight="bold" mb={2}>
            Análisis de Problemas de Datos
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={4}>
            Identifica, analiza y soluciona problemas de calidad de datos en tu organización
          </Typography>
          <Button 
            component={Link} 
            to="/login" 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ px: 4, py: 2, fontSize: '1.1rem' }}
          >
            Comenzar Análisis
          </Button>
        </Box>

        {/* Features */}
        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2} sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Analytics sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="primary" mb={2}>
                  Identificación
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detecta automáticamente problemas de calidad en tus datos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2} sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Assessment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="primary" mb={2}>
                  Análisis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analiza en profundidad las causas y efectos de los problemas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2} sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <DataUsage sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="primary" mb={2}>
                  Evaluación
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Evalúa el impacto y prioriza las soluciones más efectivas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card elevation={2} sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" color="primary" mb={2}>
                  Clasificación
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Clasifica y prioriza procesos para una mejor gestión
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box bgcolor="primary.main" color="white" py={4} mt={8}>
        <Container maxWidth="lg">
          <Typography variant="body1" textAlign="center">
            © 2024 DataProPTool - Herramienta de Análisis de Problemas de Datos
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;