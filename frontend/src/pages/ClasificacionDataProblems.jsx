import React, { useState, useEffect } from "react";
import { Box, Button, Paper, Typography, Stepper, Step, StepLabel, Container, Stack, Alert } from "@mui/material";
import DataProblemSelector from "../components/DataProblemSelector";
import AggregationFunctionSelector from "../components/AggregationFunctionSelector";
import RolesSelector from "../components/RolesSelector";
import ClassificationMatrix from "../components/ClassificationMatrix";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import BotonVolverFijo from "../components/BotonVolverFijo";
import api from "../api";

const STEPS = ["Selección", "Clasificación"];

function ClasificacionDataProblems() {
  const [step, setStep] = useState(0);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [aggFunc, setAggFunc] = useState("media");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [problemsData, setProblemsData] = useState([]);
  const [results, setResults] = useState(Array(10).fill(0));
  const [promedios, setPromedios] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Solo cargar si el usuario lo solicita explícitamente (botón "Cargar Clasificación")
  const loadExistingClassification = async () => {
    try {
      setIsLoading(true);
      const resp = await api.get("/api/clasificacion/");
      const items = Array.isArray(resp.data) ? resp.data : [];

      if (items.length === 0) {
        alert("No hay clasificaciones previas para cargar.");
        setIsLoading(false);
        return;
      }

      // elegir la más reciente por updated_at / created_at
      items.sort((a, b) => {
        const ta = a.updated_at || a.created_at || "";
        const tb = b.updated_at || b.created_at || "";
        return ta < tb ? 1 : ta > tb ? -1 : 0;
      });
      const firstClassification = items[0];

      // Normalizar campo de data_problems
      const dpField = firstClassification.data_problems || firstClassification.data_problems_ids || firstClassification.dataProblems || [];

      // resolver dataProblems a objetos completos usando localStorage o requests
      const allProblems = JSON.parse(localStorage.getItem("allDataProblems") || "[]");
      let resolvedProblems = [];

      if (Array.isArray(dpField) && dpField.length > 0) {
        if (typeof dpField[0] === "object" && dpField[0] !== null && "id" in dpField[0]) {
          resolvedProblems = dpField;
        } else {
          // dpField debe ser lista de ids
          if (allProblems && allProblems.length > 0) {
            resolvedProblems = allProblems.filter((ap) => dpField.includes(ap.id));
          } else {
            // pedir cada data problem si no está en localStorage
            const fetched = await Promise.all(
              dpField.map((id) =>
                api.get(`/api/dataproblem/${id}/`).then((r) => r.data).catch(() => null)
              )
            );
            resolvedProblems = fetched.filter(Boolean);
          }
        }
      }

      // actualizar estados con la clasificación cargada
      const dpIds = resolvedProblems.map((p) => p.id);
      setSelectedProblems(dpIds);
      setAggFunc(firstClassification.agg_func || firstClassification.aggFunc || "media");
      setSelectedRoles(firstClassification.roles || []);
      setPromedios(firstClassification.promedios || {});
      setResults(firstClassification.results || []);
      setProblemsData(resolvedProblems);

      // si la clasificación trae una matriz válida la usamos, si no inicializamos según problemas
      if (Array.isArray(firstClassification.matrix) && firstClassification.matrix.length > 0) {
        setMatrix(firstClassification.matrix);
      } else {
        setMatrix(Array(resolvedProblems.length).fill(null).map(() => Array(10).fill(false)));
      }

      setStep(1);
    } catch (err) {
      console.error("Error al cargar clasificaciones previas:", err);
      alert("Error al cargar la clasificación.");
    } finally {
      setIsLoading(false);
    }
  };

  // Avanzar a la matriz
  const handleNext = async () => {
    const allProblems = JSON.parse(localStorage.getItem("allDataProblems") || "[]");
    const filtered = allProblems.filter(dp => selectedProblems.includes(dp.id));
    setProblemsData(filtered);
    setStep(1);

    // Cargar promedios para los problemas seleccionados
    fetchPromedios(filtered.map(dp => dp.id));

    // inicializar matriz si está vacía o tamaño incorrecto
    if (matrix.length !== filtered.length) {
      setMatrix(Array(filtered.length).fill(null).map(() => Array(10).fill(false)));
    }
  };

  // Solicita promedios desde la API y guarda en estado local
  const fetchPromedios = async (ids = []) => {
    if (!ids || ids.length === 0) {
      setPromedios({});
      return;
    }
    try {
      const promises = ids.map((id) =>
        api.get(`/api/evaluaciondataproblem/?data_problem=${id}`)
          .then((res) => {
            if (Array.isArray(res.data) && res.data.length > 0) {
              const p = res.data[0].promedio_notas;
              return { id, promedio: p !== null && p !== undefined ? Number(p) : 0 };
            }
            return { id, promedio: 0 };
          })
          .catch(() => ({ id, promedio: 0 }))
      );
      const result = await Promise.all(promises);
      const map = {};
      result.forEach(({ id, promedio }) => { map[id] = promedio; });
      setPromedios(map);
    } catch (e) {
      setPromedios({});
    }
  };

  // Sincroniza la matriz cuando cambia problemsData y estés en el paso 1
  useEffect(() => {
    if (step === 1 && problemsData.length > 0 && matrix.length === 0) {
      setMatrix(Array(problemsData.length).fill(null).map(() => Array(10).fill(false)));
      fetchPromedios(problemsData.map(dp => dp.id));
    }
  }, [step, problemsData]);

  // Obtiene los resultados de evaluación
  const getEvaluacionValor = (problemId) => {
    if (promedios && Object.prototype.hasOwnProperty.call(promedios, problemId)) {
      const val = promedios[problemId];
      return typeof val === "number" && !isNaN(val) ? val : 0;
    }
    return 0;
  };

  // Calcular totales por columna según función, usando el resultado de la evaluación como peso
  const handleCalculate = async () => {
    let totals = [];
    const pesos = problemsData.map(dp => getEvaluacionValor(dp.id));
    
    for (let col = 0; col < 10; col++) {
      const colVals = matrix.map((row, rowIdx) => (row[col] ? 1 : 0) * (pesos[rowIdx] || 0));
      let val = 0;
      if (aggFunc === "media") {
        val = colVals.reduce((a, b) => a + b, 0) / (colVals.length || 1);
        val = Number.isNaN(val) ? 0 : Number(val.toFixed(2));
      } else if (aggFunc === "suma") {
        val = colVals.reduce((a, b) => a + b, 0);
      } else if (aggFunc === "max") {
        val = Math.max(...colVals);
      } else if (aggFunc === "min") {
        val = Math.min(...colVals);
      }
      totals.push(val);
    }
    setResults(totals);

    // Guardar en DB: una única clasificación que puede contener muchos data problems
    try {
      const payload = {
        data_problems: selectedProblems,
        agg_func: aggFunc,
        roles: selectedRoles,
        matrix,
        results: totals,
        promedios,
      };
      // si ya existe una clasificacion (puedes decidir criterio: la más reciente)
      const existing = await api.get("/api/clasificacion/");
      const items = Array.isArray(existing.data) ? existing.data : [];
      let resp;
      if (items.length > 0) {
        // actualizar la más reciente (usar id)
        items.sort((a,b)=> {
          const ta = a.updated_at || a.created_at || "";
          const tb = b.updated_at || b.created_at || "";
          return ta < tb ? 1 : ta > tb ? -1 : 0;
        });
        const toUpdate = items[0];
        resp = await api.put(`/api/clasificacion/${toUpdate.id}/`, payload);
      } else {
        resp = await api.post("/api/clasificacion/", payload);
      }
      console.log("Clasificación guardada:", resp.data);
      alert("Clasificación guardada exitosamente.");
    } catch (err) {
      console.error("Error guardando clasificación:", err);
      alert("Error al guardar la clasificación.");
    }

    // Guardar en sessionStorage local también
    sessionStorage.setItem(
      "clasificacionDataProblems",
      JSON.stringify({
        selectedProblems,
        aggFunc,
        selectedRoles,
        matrix,
        results: totals,
        dataProblems: problemsData,
        promedios,
      })
    );
  };

  // Nueva clasificación
  const handleNewClassification = () => {
    setStep(0);
    setSelectedProblems([]);
    setAggFunc("media");
    setSelectedRoles([]);
    setMatrix([]);
    setProblemsData([]);
    setResults(Array(10).fill(0));
    setPromedios({});
  };

  if (isLoading) {
    return (
      <Box minHeight="100vh" bgcolor="#f7fafc">
        <Header title="Clasificación de Data Problems" />
        <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography>Cargando clasificaciones previas...</Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
      <Header title="Clasificación de Data Problems" />
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={2} sx={{ p: 4, position: "relative" }}>
          <Stepper activeStep={step} sx={{ mb: 4 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {step === 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Selecciona los Data Problems a clasificar:
              </Typography>
              <DataProblemSelector selected={selectedProblems} onChange={setSelectedProblems} />
              <Typography variant="h6" sx={{ mt: 3 }}>
                Selecciona la función de agregación:
              </Typography>
              <AggregationFunctionSelector value={aggFunc} onChange={setAggFunc} />
              <Typography variant="h6" sx={{ mt: 3 }}>
                Selecciona los roles utilizados:
              </Typography>
              <RolesSelector 
                selected={selectedRoles}
                onChange={setSelectedRoles} 
              />
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={selectedProblems.length === 0 || selectedRoles.length === 0}
                  onClick={handleNext}
                >
                  Siguiente
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={loadExistingClassification}
                >
                  Cargar Clasificación Anterior
                </Button>
              </Stack>
            </>
          )}
          {step === 1 && matrix.length === problemsData.length && (
            <>
              <Typography variant="h6" gutterBottom>
                Clasificación de Data Problems
              </Typography>
              <Box sx={{ position: "relative" }}>
                <ClassificationMatrix
                  dataProblems={problemsData}
                  matrix={matrix}
                  setMatrix={setMatrix}
                  onCalculate={handleCalculate}
                  aggFunc={aggFunc}
                  results={results}
                  promedios={promedios}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleNewClassification}
                  >
                    Nueva Clasificación
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalculate}
                  >
                    Calcular Resultados
                  </Button>
                </Stack>
              </Box>
            </>
          )}
        </Paper>
      </Container>
      <BotonVolverFijo to="/resultadosclasificacion" label="Ir a Resultados" />
    </Box>
  );
}

export default ClasificacionDataProblems;