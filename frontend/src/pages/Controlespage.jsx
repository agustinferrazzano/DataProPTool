import { useState } from "react";
import "../styles/ControlesPage.css";
import "../styles/Botones.css"; 
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import { useEffect } from "react";

function ControlesPage() {
    const [policyName, setPolicyName] = useState("");
    const [politicaDescription, setDescripcion] = useState("");
    const [controls, setControls] = useState([]); // Lista de controles cargados
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };


    const handlegetControls = () => {
        api
            .get("/api/controles/")
            .then((response) => {
                console.log("Respuesta del backend:", response.data); // Verifica la estructura de los datos
                setControls(response.data); // Asegúrate de que sea un array
            })
            .catch((error) => {
                console.error("Error fetching controls:", error);
            });
    };

    useEffect(() => {
        handlegetControls();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (policyName && politicaDescription) {
            const newControl = { nombre: policyName, tipo: "politica", descripcion: politicaDescription };
            api
                .post("/api/controles/", newControl).then((response) => {
                     if (response.status === 201) {
                        setPolicyName("");
                        setDescripcion("");
                        handlegetControls();
                        alert("Política y archivo cargados correctamente.");
                        
                    } else {
                        alert(error);
                    }
                })
        } else {
            alert("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="controles-container">
            <h1>Gestión de Políticas</h1>

            {/* Lista de controles */}
            <div className="controls-list">
                <h2>Controles Cargados</h2>
                {controls.length > 0 ? (
                    <ul>
                        {controls.map((control, index) => (
                            <li key={index}>
                                {control.nombre} - {control.descripcion}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay controles cargados.</p>
                )}
            </div>
            
            <form className="controles-form" onSubmit={handleSubmit}>
                <h3>Cargar Nuevas Políticas</h3> {/* Subtítulo agregado */}
                <label htmlFor="policyName">Nombre de la Política:</label>
                <input
                    type="text"
                    id="policyName"
                    value={policyName}
                    onChange={(e) => setPolicyName(e.target.value)}
                    placeholder="Ingresa el nombre de la política"
                    required
                />

                    <label htmlFor="politicaDescription">Descripción de la Politica:</label>
                    <textarea
                        id="politicaDescription"
                        value={politicaDescription}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Ingresa una descripción del departamento"
                        required
                    ></textarea>

                <button type="submit" className="submit-button">
                    Cargar
                </button>
            </form>

            <button className="back-to-home" onClick={() => navigate("/datos-org")}>
                Volver
            </button>
        </div>
    );
}

export default ControlesPage;