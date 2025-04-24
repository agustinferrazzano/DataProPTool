import { useState } from "react";
import "../styles/ControlesPage.css";
import "../styles/Botones.css"; 
import { useNavigate } from "react-router-dom";

function ControlesPage() {
    const [policyName, setPolicyName] = useState("");
    const [file, setFile] = useState(null);
    const [controls, setControls] = useState([]); // Lista de controles cargados
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (policyName && file) {
            const newControl = { name: policyName, fileName: file.name };
            setControls([...controls, newControl]); // Agrega el nuevo control a la lista
            setPolicyName(""); // Limpia el campo de texto
            setFile(null); // Limpia el archivo seleccionado
            alert("Política y archivo cargados correctamente.");
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
                <ul>
                    {controls.map((control, index) => (
                        <li key={index}>
                            {control.name} - {control.fileName}
                        </li>
                    ))}
                </ul>
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

                <label htmlFor="fileUpload">Archivo de la Política:</label>
                <input
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                    required
                />

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