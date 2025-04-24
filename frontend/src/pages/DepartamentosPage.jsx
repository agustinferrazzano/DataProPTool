import { useState } from "react";
import "../styles/FormPage.css";
import "../styles/Botones.css";
import { useNavigate } from "react-router-dom";

function DepartamentosPage() {
    const [processes, setProcesses] = useState([]); // Lista de procesos cargados
    const [stakeholders, setStakeholders] = useState([]); // Lista de stakeholders cargados
    const [selectedProcess, setSelectedProcess] = useState(""); // Proceso seleccionado
    const [selectedStakeholder, setSelectedStakeholder] = useState(""); // Stakeholder seleccionado
    const [departmentName, setDepartmentName] = useState(""); // Nombre del departamento
    const [departmentDescription, setDepartmentDescription] = useState(""); // Descripción del departamento
    const [departmentFile, setDepartmentFile] = useState(null); // Archivo del departamento
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación

    const handleProcessChange = (event) => {
        setSelectedProcess(event.target.value); // Actualiza el proceso seleccionado
    };

    const handleStakeholderChange = (event) => {
        setSelectedStakeholder(event.target.value); // Actualiza el stakeholder seleccionado
    };

    const handleFileChange = (event) => {
        setDepartmentFile(event.target.files[0]); // Actualiza el archivo seleccionado
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedProcess && selectedStakeholder && departmentName && departmentDescription && departmentFile) {
            alert(`Departamento cargado correctamente:\nNombre: ${departmentName}\nDescripción: ${departmentDescription}\nProceso: ${selectedProcess}\nStakeholder: ${selectedStakeholder}`);
            setDepartmentName(""); // Limpia el campo de nombre
            setDepartmentDescription(""); // Limpia el campo de descripción
            setSelectedProcess(""); // Limpia el proceso seleccionado
            setSelectedStakeholder(""); // Limpia el stakeholder seleccionado
            setDepartmentFile(null); // Limpia el archivo seleccionado
            setShowForm(false); // Oculta el formulario después de cargar
        } else {
            alert("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="page-container">
            <h1>Gestión de Departamentos Organizacionales</h1>

            <div className="items-list">
                <h2>Departamentos Cargados</h2>
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
                    {showForm ? "Ocultar Formulario" : "Cargar Nuevo Departamento"}
                </button>
            </div>

            {showForm && (
                <form className="form-container" onSubmit={handleSubmit}>
                    <h3>Cargar Nuevo Departamento</h3>
                    <label htmlFor="departmentName">Nombre del Departamento:</label>
                    <input
                        type="text"
                        id="departmentName"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        placeholder="Ingresa el nombre del departamento"
                        required
                    />

                    <label htmlFor="departmentDescription">Descripción del Departamento:</label>
                    <textarea
                        id="departmentDescription"
                        value={departmentDescription}
                        onChange={(e) => setDepartmentDescription(e.target.value)}
                        placeholder="Ingresa una descripción del departamento"
                        required
                    ></textarea>

                    <label htmlFor="departmentFile">Documento:</label>
                    <input
                        type="file"
                        id="departmentFile"
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

                    <label htmlFor="stakeholderSelect">Seleccionar Stakeholder:</label>
                    <select
                        id="stakeholderSelect"
                        value={selectedStakeholder}
                        onChange={handleStakeholderChange}
                        required
                    >
                        <option value="" disabled>
                            Selecciona un stakeholder
                        </option>
                        {stakeholders.map((stakeholder, index) => (
                            <option key={index} value={stakeholder.name}>
                                {stakeholder.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit" className="submit-button">
                        Cargar Departamento
                    </button>
                </form>
            )}

            <button className="back-to-home" onClick={() => navigate("/datos-org")}>
                Volver
            </button>
        </div>
    );
}

export default DepartamentosPage;