import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography, Paper } from "@mui/material";

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
          p: 2,
          bgcolor: "white",
        }}
      >
        <Typography variant="h4" color="primary">
          Welcome
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/login" variant="outlined" color="primary">
            Login
          </Button>
          <Button component={Link} to="/register" variant="contained" color="primary">
            Register
          </Button>
        </Stack>
      </Paper>

      {/* Cuerpo */}
      <Box component="main" p={4}>
        <Typography variant="h6" color="primary" mb={2}>
          About This Page
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is the home page of our application. From here, you can navigate to the login page to access your account or to the register page to create a new account.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;