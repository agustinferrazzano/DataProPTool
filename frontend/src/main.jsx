import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

const colors = {
  primaryBlue: '#1E3A8A',     // Azul oscuro para botones y navbar
  secondaryBlue: '#3B82F6',   // Azul medio para hover o destacados
  grayLight: '#F3F4F6',       // Fondo claro
  grayMedium: '#9CA3AF',      // Texto secundario, bordes
  grayDark: '#374151',        // Texto principal
  white: '#FFFFFF',           // Fondo principal
  successGreen: '#10B981',    // Mensajes de éxito
  errorRed: '#EF4444',        // Mensajes de error
  warningYellow: '#FBBF24',   // Mensajes de advertencia
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryBlue,
      dark: colors.primaryBlue,
      light: colors.secondaryBlue,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.secondaryBlue,
      contrastText: colors.white,
    },
    background: {
      default: colors.grayLight,
      paper: colors.white,
    },
    text: {
      primary: colors.grayDark,
      secondary: colors.grayMedium,
    },
    success: {
      main: colors.successGreen,
    },
    error: {
      main: colors.errorRed,
    },
    warning: {
      main: colors.warningYellow,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
