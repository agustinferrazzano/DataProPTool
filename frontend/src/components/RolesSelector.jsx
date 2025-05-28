import React, { useEffect, useState } from "react";
import { Checkbox, List, ListItem, ListItemText, ListItemIcon, CircularProgress } from "@mui/material";
import api from "../api";

function RolesSelector({ selected, onChange }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/stakeholders/")
      .then(res => setRoles(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter((sid) => sid !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <List>
      {roles.map((role) => (
        <ListItem key={role.id} button onClick={() => handleToggle(role.id)}>
          <ListItemIcon>
            <Checkbox checked={selected.includes(role.id)} />
          </ListItemIcon>
          <ListItemText primary={role.nombre} />
        </ListItem>
      ))}
    </List>
  );
}

export default RolesSelector;