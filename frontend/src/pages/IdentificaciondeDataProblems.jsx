import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Asegúrate de que este archivo apunte a tu configuración de API
import "../styles/DataProblemPage.css"; // Opcional: agrega estilos personalizados
import "../styles/Botones.css";

function IdentificaciondeDataProblems() {
    const [dataProblems, setDataProblems] = useState([]); // Estado para almacenar la lista de DataProblems
    const [fuentes, setFuentes] = useState([]); // Estado para almacenar las fuentes
    const navigate = useNavigate();

    // Función para obtener los DataProblems desde el backend
    const fetchDataProblems = () => {
        api.get("/api/dataproblem/")
            .then((response) => {
                const problems = response.data;

                // Machea los IDs de las fuentes con sus nombres
                const updatedProblems = problems.map((problem) => ({
                    ...problem,
                    fuente_identificacion: fuentes.find((fuente) => fuente.id === problem.fuente_identificacion)?.nombre || "N/A",
                    fuente_confirmacion: fuentes.find((fuente) => fuente.id === problem.fuente_confirmacion)?.nombre || "N/A",
                }));

                setDataProblems(updatedProblems); // Actualiza el estado con los datos procesados
            })
            .catch((error) => {
                console.error("Error al obtener los DataProblems:", error);
            });
    };

    // Función para obtener las fuentes desde el backend
    const fetchFuentes = () => {
        api.get("/api/fuentes/")
            .then((response) => {
                setFuentes(response.data); // Actualiza el estado con las fuentes
            })
            .catch((error) => {
                console.error("Error al obtener las fuentes:", error);
            });
    };

    // useEffect para cargar los datos al montar el componente
    useEffect(() => {
        fetchFuentes(); // Carga las fuentes primero
    }, []);

    useEffect(() => {
        if (fuentes.length > 0) {
            fetchDataProblems(); // Carga los DataProblems después de obtener las fuentes
        }
    }, [fuentes]);

    return (
        <div className="data-problems-container">
            <h1>Identificación de Data Problems</h1>
            <button
                className="add-button"
                onClick={() => navigate("/cargardataproblems")} // Navega a la página de carga
            >
                Cargar Nuevo Data Problem
            </button>

            <div className="data-problems-table-container">
                <h2>Lista de Data Problems</h2>
                {dataProblems.length > 0 ? (
                    <table className="data-problems-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Fuente de Identificación</th>
                                <th>Fuente de Confirmación</th>
                                <th>Descripción de la Fuente</th>
                                <th>Stakeholder</th>
                                <th>Departamentos</th>
                                <th>Procesos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataProblems.map((problem) => (
                                <tr key={problem.id}>
                                    <td>{problem.nombre}</td>
                                    <td>{problem.descripcion}</td>
                                    <td>{problem.fuente_identificacion}</td>
                                    <td>{problem.fuente_confirmacion}</td>
                                    <td>{problem.descripcion_fuente}</td>
                                    <td>{problem.stakeholder?.nombre || "N/A"}</td>
                                    <td>
                                        {problem.departamentos?.length > 0
                                            ? problem.departamentos.map((dep) => dep.nombre).join(", ")
                                            : "N/A"}
                                    </td>
                                    <td>
                                        {problem.procesos_negocio?.length > 0
                                            ? problem.procesos_negocio.map((proc) => proc.nombre).join(", ")
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay Data Problems cargados.</p>
                )}
            </div>
            <button className="back-to-home" onClick={() => navigate("/")}>
                Volver
            </button>
        </div>
    );
}

export default IdentificaciondeDataProblems;