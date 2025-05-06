import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import api from "../api"; // Asegúrate de que este archivo apunte a tu configuración de API
import "../styles/CargaDataProblem.css"; // Opcional: agrega estilos personalizados

function CargarDataProblem() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sourceDescription, setSourceDescription] = useState("");
    const [identificationSources, setIdentificationSources] = useState([]);
    const [confirmationSources, setConfirmationSources] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [businessProcesses, setBusinessProcesses] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedProcesses, setSelectedProcesses] = useState([]);
    const [selectedIdentificationSource, setSelectedIdentificationSource] = useState("");
    const [selectedConfirmationSource, setSelectedConfirmationSource] = useState("");
    const navigate = useNavigate();

    // Función para obtener departamentos y procesos de negocio
    const fetchData = () => {
        api.get("/api/departamentos/")
            .then((response) => setDepartments(response.data))
            .catch((error) => console.error("Error al obtener departamentos:", error));

        api.get("/api/procesos/")
            .then((response) => setBusinessProcesses(response.data))
            .catch((error) => console.error("Error al obtener procesos de negocio:", error));

        api.get("/api/fuentes/")
            .then((response) => {
                setIdentificationSources(response.data);
                setConfirmationSources(response.data);
            })
            .catch((error) => console.error("Error al obtener fuentes:", error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const newDataProblem = {
            nombre: name,
            descripcion: description,
            fuente_identificacion: selectedIdentificationSource,
            fuente_confirmacion: selectedConfirmationSource,
            descripcion_fuente: sourceDescription,
            departamentos_ids: selectedDepartments,
            procesos_ids: selectedProcesses,
        };

        console.log("Datos enviados:", newDataProblem);

        api.post("/api/dataproblems/", newDataProblem)
            .then((response) => {
                if (response.status === 201) {
                    alert("Data Problem creado correctamente.");
                    navigate("/dataproblems");
                }
            })
            .catch((error) => {
                console.error("Error al crear el Data Problem:", error.response?.data || error.message);
                alert("Hubo un error al crear el Data Problem.");
            });
    };

    return (
        <div className="data-problem-form-container">
            <h1>Cargar Nuevo Data Problem</h1>
            <form className="data-problem-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ingresa el nombre del Data Problem"
                    required
                />

                <label htmlFor="description">Descripción:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ingresa una descripción"
                    required
                ></textarea>

                <label htmlFor="identificationSource">Fuente de Identificación:</label>
                <select
                    id="identificationSource"
                    value={selectedIdentificationSource}
                    onChange={(e) => setSelectedIdentificationSource(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Selecciona una fuente
                    </option>
                    {identificationSources.map((source) => (
                        <option key={source.id} value={source.id}>
                            {source.nombre}
                        </option>
                    ))}
                </select>

                <label htmlFor="confirmationSource">Fuente de Confirmación:</label>
                <select
                    id="confirmationSource"
                    value={selectedConfirmationSource}
                    onChange={(e) => setSelectedConfirmationSource(e.target.value)}
                    required
                >
                    <option value="" disabled>
                        Selecciona una fuente
                    </option>
                    {confirmationSources.map((source) => (
                        <option key={source.id} value={source.id}>
                            {source.nombre}
                        </option>
                    ))}
                </select>

                <label htmlFor="sourceDescription">Descripción de la Fuente:</label>
                <textarea
                    id="sourceDescription"
                    value={sourceDescription}
                    onChange={(e) => setSourceDescription(e.target.value)}
                    placeholder="Ingresa una descripción de la fuente"
                    required
                ></textarea>

                <label htmlFor="departments">Seleccionar Departamentos:</label>
                <Select
                    id="departments"
                    isMulti
                    options={departments.map((department) => ({
                        value: department.id,
                        label: department.nombre,
                    }))}
                    onChange={(selectedOptions) => {
                        setSelectedDepartments(selectedOptions.map((option) => option.value)); // Actualiza el estado con los IDs seleccionados
                    }}
                    placeholder="Selecciona uno o más departamentos"
                    className="multi-select"
                    classNamePrefix="select"
                    value={departments
                        .filter((department) => selectedDepartments.includes(department.id))
                        .map((department) => ({ value: department.id, label: department.nombre }))}
                    required
                />

                <label htmlFor="processes">Seleccionar Procesos de Negocio:</label>
                <Select
                    id="processes"
                    isMulti
                    options={businessProcesses.map((process) => ({
                        value: process.id,
                        label: process.nombre,
                    }))}
                    onChange={(selectedOptions) => {
                        setSelectedProcesses(selectedOptions.map((option) => option.value)); // Actualiza el estado con los IDs seleccionados
                    }}
                    placeholder="Selecciona uno o más procesos"
                    className="multi-select"
                    classNamePrefix="select"
                    value={businessProcesses
                        .filter((process) => selectedProcesses.includes(process.id))
                        .map((process) => ({ value: process.id, label: process.nombre }))}
                    required
                />

                <button type="submit" className="submit-button">
                    Crear Data Problem
                </button>
            </form>
        </div>
    );
}

export default CargarDataProblem;