import React, { useState, useEffect } from "react";
import { Box, Button, Paper, Typography, Stepper, Step, StepLabel, Container, Stack } from "@mui/material";
import DataProblemSelector from "../components/DataProblemSelector";
import AggregationFunctionSelector from "../components/AggregationFunctionSelector";
import RolesSelector from "../components/RolesSelector";
import ClassificationMatrix from "../components/ClassificationMatrix";
import { useNavigate } from "react-router-dom";

const STEPS = ["Selección", "Clasificación"];

function ClasificacionDataProblems() {
  const [step, setStep] = useState(0);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [aggFunc, setAggFunc] = useState("media");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [problemsData, setProblemsData] = useState([]);
  const [results, setResults] = useState(Array(10).fill(0));
  const navigate = useNavigate();

  // Avanzar a la matriz
  const handleNext = () => {
    const allProblems = JSON.parse(localStorage.getItem("allDataProblems") || "[]");
    const filtered = allProblems.filter(dp => selectedProblems.includes(dp.id));
    setProblemsData(filtered);
    setStep(1);
  };

  // Sincroniza la matriz cuando cambia problemsData y estés en el paso 1
  useEffect(() => {
    if (step === 1 && problemsData.length > 0) {
      setMatrix(Array(problemsData.length).fill(null).map(() => Array(10).fill(false)));
    }
  }, [step, problemsData]);

  // Calcular totales por columna según función
  const handleCalculate = () => {
    let totals = [];
    for (let col = 0; col < 10; col++) {
      const colVals = matrix.map(row => row[col] ? 1 : 0);
      let val = 0;
      if (aggFunc === "media") {
        val = colVals.reduce((a, b) => a + b, 0) / (colVals.length || 1);
        val = Number.isNaN(val) ? 0 : Number(val.toFixed(2)); // Limita a 2 decimales
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

    // Guarda en sessionStorage
    sessionStorage.setItem(
      "clasificacionDataProblems",
      JSON.stringify({
        selectedProblems,
        aggFunc,
        selectedRoles,
        matrix,
        results: totals,
        dataProblems: problemsData,
      })
    );
  };

  return (
    <Box minHeight="100vh" bgcolor="#f7fafc">
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
              <RolesSelector selected={selectedRoles} onChange={setSelectedRoles} />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 4 }}
                disabled={selectedProblems.length === 0 || selectedRoles.length === 0}
                onClick={handleNext}
              >
                Siguiente
              </Button>
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
                />
                <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setStep(0)}
                  >
                    Volver
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
              {/* Botón fijo para ir a resultados */}
              <Box
                sx={{
                  position: "fixed",
                  bottom: 24,
                  right: 24,
                  zIndex: 1200,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/resultadosclasificacion")}
                >
                  Ir a Resultados
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default ClasificacionDataProblems;