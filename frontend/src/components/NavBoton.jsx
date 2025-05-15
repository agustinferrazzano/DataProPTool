import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function NavBoton({ to = "/", children = "Volver", variant = "contained", color = "primary", ...props }) {
  const navigate = useNavigate();

  return (
    <Button
      className="back-to-home"
      variant={variant}
      color={color}
      onClick={() => navigate(to)}
      {...props}
    >
      {children}
    </Button>
  );
}

export default NavBoton;