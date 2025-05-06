import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Asegúrate de que este archivo apunte a tu configuración de API
import "../styles/DataProblemPage.css"; // Opcional: agrega estilos personalizados

function IdentificaciondeDataProblems() {
    const [dataProblems, setDataProblems] = useState([]); // Estado para almacenar la lista de DataProblems
    const navigate = useNavigate();

    // Función para obtener los DataProblems desde el backend
    const fetchDataProblems = () => {
        api.get("/api/dataproblems/")
            .then((response) => {
                setDataProblems(response.data); // Actualiza el estado con los datos recibidos
            })
            .catch((error) => {
                console.error("Error al obtener los DataProblems:", error);
            });
    };

    // useEffect para cargar los datos al montar el componente
    useEffect(() => {
        fetchDataProblems();
    }, []);

    return (
        <div className="data-problems-container">
            <h1>Identificación de Data Problems</h1>
            <button
                className="add-button"
                onClick={() => navigate("/cargardataproblems")} // Navega a la página de carga
            >
                Cargar Nuevo Data Problem
            </button>

            <div className="data-problems-list">
                <h2>Lista de Data Problems</h2>
                {dataProblems.length > 0 ? (
                    <ul>
                        {dataProblems.map((problem) => (
                            <li key={problem.id} className="data-problem-item">
                                <strong>{problem.nombre}</strong>
                                <p>{problem.descripcion}</p>
                                <p>Source: {problem.source}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay Data Problems cargados.</p>
                )}
            </div>
        </div>
    );
}

export default IdentificaciondeDataProblems;