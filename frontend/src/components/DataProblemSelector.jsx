import React, { useEffect, useState } from "react";
import { Checkbox, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from "@mui/material";
import api from "../api";

function DataProblemSelector({ selected, onChange }) {
  const [dataProblems, setDataProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/dataproblem/")
      .then(res => setDataProblems(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get("/api/dataproblem/")
      .then(res => {
        setDataProblems(res.data);
        // Guarda todos los problemas en localStorage para usarlos en la matriz
        localStorage.setItem("allDataProblems", JSON.stringify(res.data));
      })
      .finally(() => setLoading(false));
  }, []);


  const handleToggle = (id) => {
    let newSelected;
    if (selected.includes(id)) {
      newSelected = selected.filter((sid) => sid !== id);
    } else {
      newSelected = [...selected, id];
    }
    onChange(newSelected); // <-- Esto es lo importante
  };

  if (loading) return <CircularProgress />;

  return (
    <List>
      {dataProblems.map((dp) => (
        <ListItem key={dp.id} button onClick={() => handleToggle(dp.id)}>
          <ListItemIcon>
            <Checkbox checked={selected.includes(dp.id)} />
          </ListItemIcon>
          <ListItemText primary={dp.nombre} secondary={dp.descripcion} />
        </ListItem>
      ))}
    </List>
  );
}

export default DataProblemSelector;