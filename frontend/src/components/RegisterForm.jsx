import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Form.css";

function RegisterForm({ route }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState(""); // Campo para el nombre del perfil organizacional
    const [descripcion, setDescripcion] = useState(""); // Campo para la descripción del perfil organizacional
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Formato de datos esperado por el serializer
            const data = {
                username,
                password,
                email,
                org_profile: {
                    nombre,
                    descripcion,
                },
            };

            console.log("Datos enviados:", data); // Log para depuración
            const res = await api.post(route, data);
            console.log("Respuesta del servidor:", res.data); // Log para depuración
            navigate("/login");
        } catch (error) {
            console.error("Error al registrar:", error.response?.data || error.message);
            alert(error.response?.data?.detail || "Error al registrar la cuenta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Register</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                className="form-input"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del perfil organizacional"
                required
            />
            <textarea
                className="form-input"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del perfil organizacional"
                required
            ></textarea>
            {loading && <p>Loading...</p>}
            <button className="form-button" type="submit" disabled={loading}>
                Register
            </button>
        </form>
    );
}

export default RegisterForm;