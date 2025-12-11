import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BotonVolverFijo from "../components/BotonVolverFijo";
import api from "../api";

function ResultadosClasificacionDataProblems() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clasificacion, setClasificacion] = useState(null);
  const [dataProblems, setDataProblems] = useState([]);

  useEffect(() => {
    const loadClassificationFromDb = async () => {
      setLoading(true);
      try {
        // intenta obtener la clasificación más reciente desde la API
        const resp = await api.get("/api/clasificacion/");
        let items = Array.isArray(resp.data) ? resp.data : [];
        if (items.length === 0) {
          setClasificacion(null);
          setDataProblems([]);
          return;
        }

        // elegir la más reciente por updated_at si existe, si no usar la primera
        items.sort((a, b) => {
          const ta = a.updated_at || a.created_at || "";
          const tb = b.updated_at || b.created_at || "";
          return ta < tb ? 1 : ta > tb ? -1 : 0;
        });
        const chosen = items[0];

        // Normalizar keys (backend puede usar agg_func)
        const normalized = {
          id: chosen.id,
          matrix: chosen.matrix || chosen.matrix || [],
          results: chosen.results || chosen.results || [],
          aggFunc: chosen.agg_func || chosen.aggFunc || "",
          data_problems: chosen.data_problems || chosen.data_problems || chosen.dataProblems || chosen.dataProblemsIds || [],
        };

        // Resolver data problems: si la API devolvió objetos úsalos, si son ids intenta localStorage, si no pide al backend por id
        const dpField = chosen.data_problems || chosen.data_problems || chosen.dataProblems;
        let resolvedProblems = [];

        if (Array.isArray(dpField) && dpField.length > 0) {
          if (typeof dpField[0] === "object" && dpField[0] !== null && "id" in dpField[0]) {
            resolvedProblems = dpField;
          } else {
            // son IDs -> buscar en localStorage allDataProblems
            const all = JSON.parse(localStorage.getItem("allDataProblems") || "[]");
            if (all && all.length > 0) {
              resolvedProblems = all.filter((ap) => dpField.includes(ap.id));
            } else {
              // fallback: solicitar cada data problem por su id
              const fetched = await Promise.all(
                dpField.map((id) =>
                  api.get(`/api/dataproblem/${id}/`)
                    .then((r) => r.data)
                    .catch(() => null)
                )
              );
              resolvedProblems = fetched.filter(Boolean);
            }
          }
        }

        setClasificacion(normalized);
        setDataProblems(resolvedProblems);
      } catch (err) {
        console.error("Error cargando clasificación desde API:", err);
        setClasificacion(null);
        setDataProblems([]);
      } finally {
        setLoading(false);
      }
    };

    // Si hay clasificación guardada en sessionStorage prioriza eso (compatibilidad)
    const sessionClas = JSON.parse(sessionStorage.getItem("clasificacionDataProblems") || "null");
    if (sessionClas && sessionClas.matrix && sessionClas.dataProblems) {
      setClasificacion({
        matrix: sessionClas.matrix,
        results: sessionClas.results || [],
        aggFunc: sessionClas.aggFunc || sessionClas.agg_func || "",
      });
      setDataProblems(sessionClas.dataProblems);
      setLoading(false);
    } else {
      loadClassificationFromDb();
    }
  }, []);

  if (loading) {
    return (
      <Box minHeight="100vh" bgcolor="#f7fafc" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!clasificacion || !clasificacion.matrix || dataProblems.length === 0) {
    return (
      <Box minHeight="100vh" bgcolor="#f7fafc">
        <Header title="Clasificación de Data Problems" />
        <Container maxWidth="md" sx={{ mt: 8 }}>
          <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" color="primary" gutterBottom>
              No se ha realizado ninguna clasificación aún.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={() => navigate("/clasificaciondataproblems")}>
                Realizar Clasificación
              </Button>
            </Stack>
          </Paper>
        </Container>
        <BotonVolverFijo to="/" label="Volver" />
      </Box>
    );
  }

  const matrix = clasificacion.matrix;
  const results = clasificacion.results || [];

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Clasificación de Data Problems" />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" color="primary" align="center" gutterBottom>
            Matriz de Clasificación de Data Problems
          </Typography>
          <Stack direction="row" justifyContent="right" sx={{ mb: 3 }}>
            <Button variant="contained" color="primary" onClick={() => navigate("/clasificaciondataproblems")}>
              Modificar Clasificación
            </Button>
          </Stack>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data Problem</TableCell>
                {[...Array(10)].map((_, idx) => (
                  <TableCell key={idx} align="center">{idx + 1}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataProblems.map((dp, rowIdx) => (
                <TableRow key={dp.id || rowIdx}>
                  <TableCell>{dp.nombre || dp.title || `DP ${dp.id || rowIdx}`}</TableCell>
                  {(matrix[rowIdx] || []).map((val, colIdx) => (
                    <TableCell key={colIdx} align="center">
                      {val ? "✔️" : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <b>Total ({clasificacion.aggFunc || clasificacion.agg_func || "agg"})</b>
                </TableCell>
                {(results.length > 0 ? results : Array(10).fill(0)).map((val, idx) => (
                  <TableCell key={idx} align="center">
                    <b>{typeof val === "number" ? val.toFixed(2) : val}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Container>
      <BotonVolverFijo to="/" label="Volver" />
    </Box>
  );
}

export default ResultadosClasificacionDataProblems;