import { useState } from "react";
import "../styles/FormPage.css";
import "../styles/Botones.css";
import { useNavigate } from "react-router-dom";

function ProcesosPage() {
    const [systems, setSystems] = useState([]); // Lista de sistemas cargados
    const [selectedSystem, setSelectedSystem] = useState(""); // Sistema seleccionado
    const [processName, setProcessName] = useState(""); // Nombre del proceso
    const [processDescription, setProcessDescription] = useState(""); // Descripción del proceso
    const [processFile, setProcessFile] = useState(null); // Archivo del proceso
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación

    const handleSystemChange = (event) => {
        setSelectedSystem(event.target.value); // Actualiza el sistema seleccionado
    };

    const handleFileChange = (event) => {
        setProcessFile(event.target.files[0]); // Actualiza el archivo seleccionado
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedSystem && processName && processDescription && processFile) {
            alert(`Proceso cargado correctamente:\nNombre: ${processName}\nDescripción: ${processDescription}\nSistema: ${selectedSystem}`);
            setProcessName(""); // Limpia el campo de nombre
            setProcessDescription(""); // Limpia el campo de descripción
            setSelectedSystem(""); // Limpia el sistema seleccionado
            setProcessFile(null); // Limpia el archivo seleccionado
            setShowForm(false); // Oculta el formulario después de cargar
        } else {
            alert("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="page-container">
            <h1>Gestión de Procesos Organizacionales</h1>

            <div className="items-list">
                <h2>Sistemas Cargados</h2>
                {systems.length > 0 ? (
                    <ul>
                        {systems.map((system, index) => (
                            <li key={index} className="item">
                                <div>
                                    <strong>{system.name}</strong>
                                    <p>{system.description}</p>
                                </div>
                                <span>{system.fileName}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay sistemas cargados.</p>
                )}
                <button
                    className="show-form-button"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Ocultar Formulario" : "Cargar Nuevo Proceso"}
                </button>
            </div>

            {showForm && (
                <form className="form-container" onSubmit={handleSubmit}>
                    <h3>Cargar Nuevo Proceso</h3>
                    <label htmlFor="processName">Nombre del Proceso:</label>
                    <input
                        type="text"
                        id="processName"
                        value={processName}
                        onChange={(e) => setProcessName(e.target.value)}
                        placeholder="Ingresa el nombre del proceso"
                        required
                    />

                    <label htmlFor="processDescription">Descripción del Proceso:</label>
                    <textarea
                        id="processDescription"
                        value={processDescription}
                        onChange={(e) => setProcessDescription(e.target.value)}
                        placeholder="Ingresa una descripción del proceso"
                        required
                    ></textarea>

                    <label htmlFor="processFile">Documento:</label>
                    <input
                        type="file"
                        id="processFile"
                        onChange={handleFileChange}
                        required
                    />

                    <label htmlFor="systemSelect">Seleccionar Sistema:</label>
                    <select
                        id="systemSelect"
                        value={selectedSystem}
                        onChange={handleSystemChange}
                        required
                    >
                        <option value="" disabled>
                            Selecciona un sistema
                        </option>
                        {systems.map((system, index) => (
                            <option key={index} value={system.name}>
                                {system.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit" className="submit-button">
                        Cargar Proceso
                    </button>
                </form>
            )}

            <button className="back-to-home" onClick={() => navigate("/datos-org")}>
                Volver
            </button>
        </div>
    );
}

export default ProcesosPage;