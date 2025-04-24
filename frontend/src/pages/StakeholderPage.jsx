import { useState } from "react";
import "../styles/FormPage.css";
import "../styles/Botones.css";
import { useNavigate } from "react-router-dom";

function StakeholderPage() {
    const [processes, setProcesses] = useState([]); // Lista de procesos cargados
    const [selectedProcess, setSelectedProcess] = useState(""); // Proceso seleccionado
    const [roleName, setRoleName] = useState(""); // Nombre del cargo
    const [roleDescription, setRoleDescription] = useState(""); // Descripción del cargo
    const [roleFile, setRoleFile] = useState(null); // Archivo del cargo
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación

    const handleProcessChange = (event) => {
        setSelectedProcess(event.target.value); // Actualiza el proceso seleccionado
    };

    const handleFileChange = (event) => {
        setRoleFile(event.target.files[0]); // Actualiza el archivo seleccionado
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedProcess && roleName && roleDescription && roleFile) {
            alert(`Cargo cargado correctamente:\nNombre: ${roleName}\nDescripción: ${roleDescription}\nProceso: ${selectedProcess}`);
            setRoleName(""); // Limpia el campo de nombre
            setRoleDescription(""); // Limpia el campo de descripción
            setSelectedProcess(""); // Limpia el proceso seleccionado
            setRoleFile(null); // Limpia el archivo seleccionado
            setShowForm(false); // Oculta el formulario después de cargar
        } else {
            alert("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="page-container">
            <h1>Gestión de Cargos Organizacionales</h1>

            <div className="items-list">
                <h2>Stakeholders Cargados</h2>
                {processes.length > 0 ? (
                    <ul>
                        {processes.map((process, index) => (
                            <li key={index} className="item">
                                <div>
                                    <strong>{process.name}</strong>
                                    <p>{process.description}</p>
                                </div>
                                <span>{process.fileName}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay procesos cargados.</p>
                )}
                <button
                    className="show-form-button"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Ocultar Formulario" : "Cargar Nuevo Cargo"}
                </button>
            </div>

            {showForm && (
                <form className="form-container" onSubmit={handleSubmit}>
                    <h3>Cargar Nuevo Cargo</h3>
                    <label htmlFor="roleName">Nombre del Cargo:</label>
                    <input
                        type="text"
                        id="roleName"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        placeholder="Ingresa el nombre del cargo"
                        required
                    />

                    <label htmlFor="roleDescription">Descripción del Cargo:</label>
                    <textarea
                        id="roleDescription"
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)}
                        placeholder="Ingresa una descripción del cargo"
                        required
                    ></textarea>

                    <label htmlFor="roleFile">Documento:</label>
                    <input
                        type="file"
                        id="roleFile"
                        onChange={handleFileChange}
                        required
                    />

                    <label htmlFor="processSelect">Seleccionar Proceso:</label>
                    <select
                        id="processSelect"
                        value={selectedProcess}
                        onChange={handleProcessChange}
                        required
                    >
                        <option value="" disabled>
                            Selecciona un proceso
                        </option>
                        {processes.map((process, index) => (
                            <option key={index} value={process.name}>
                                {process.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit" className="submit-button">
                        Cargar Cargo
                    </button>
                </form>
            )}

            <button className="back-to-home" onClick={() => navigate("/datos-org")}>
                Volver
            </button>
        </div>
    );
}

export default StakeholderPage;