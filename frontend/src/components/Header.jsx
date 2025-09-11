import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Stack } from "@mui/material";

function Header({ title = "Home User", onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) onLogout();
    else navigate("/home");
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        <div>
          <Button
            color="primary"
            variant="text"
            onClick={handleMenuOpen}
          >
            Menu
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate("/tecnicas"); }}>Técnicas de Identificación</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/herramientas"); }}>Herramientas de Analisis</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/information"); }}>Información</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;