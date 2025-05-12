import { useState } from "react";
import "../styles/FormPage.css";
import "../styles/Botones.css";
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import { useEffect } from "react";

function ProcesosPage() {
    const [systems, setSistemas] = useState([]); 
    const [process, setProcess] = useState([]); 
    const [selectedSystem, setSelectedSystem] = useState([]); 
    const [processName, setProcessName] = useState(""); // Nombre del proceso
    const [processDescription, setProcessDescription] = useState(""); // Descripción del proceso
    // const [processFile, setProcessFile] = useState(null); // Archivo del proceso
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación
    const [org, setUsuario] = useState([{}]); // Lista de controles cargados

    const handlegetSistemas = () => {
        api
            .get("/api/sistemas/")
            .then((response) => {
                console.log("Respuesta del backend:", response.data); // Verifica la estructura de los datos
                setSistemas(response.data); // Asegúrate de que sea un array
            })
            .catch((error) => {
                console.error("Error fetching controls:", error);
            });
    };

    useEffect(() => {
        handlegetSistemas();
    }, []);

    const handlegetProcesos = () => {
        api
            .get("/api/procesos/")
            .then((response) => {
                console.log("Respuesta del backend:", response.data); // Verifica la estructura de los datos
                setProcess(response.data); // Asegúrate de que sea un array
            })
            .catch((error) => {
                console.error("Error fetching controls:", error);
            });
    };

    useEffect(() => {
        handlegetProcesos();
    }, []);

        const handlegetOrg = () => {
        api
            .get("/api/usuarios/")
            .then((response) => {
                console.log("Respuesta del backend usuario:", response.data);
                setUsuario(response.data); // Actualiza el estado con los datos del backend
            })
            .catch((error) => {
                console.error("Error al obtener los usuarios:", error.response?.data || error.message);
            });
    };

    useEffect(() => {
        handlegetOrg();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (processName && processDescription ) { //&& repoFile
            const newProcess = {
                nombre: processName,
                tipo: "Proceso de negocio",
                descripcion: processDescription,
                sistema_ids: selectedSystem,
                organizacion: org[0].id  
            };
            console.log("Datos enviados:", newProcess);
            
            api
                .post("/api/procesos/", newProcess).then((response) => {
                     if (response.status === 201) {
                        setProcessName("");
                        setProcessDescription("");
                        setSelectedSystem([]); // Limpia el estado de selectedRepo
                        handlegetProcesos();
                        alert("Sistemas y archivo cargados correctamente.");
                        
                    } else {
                        alert(error);
                    }
                })
        } else {
            alert("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="page-container">
            <h1>Gestión de Procesos Organizacionales</h1>

            <div className="items-list">
                <h2>Procesos Cargados</h2>
                {process.length > 0 ? (
                    <ul>
                        {process.map((proces, index) => (
                            <li key={index} className="item">
                                <div>
                                    <strong>{proces.nombre}</strong>
                                    <p>{proces.descripcion}</p>
                                    <p>
                                        Sistemas:{" "}
                                        {proces.sistema.map((sistema) => sistema.nombre).join(", ")}
                                    </p>
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay Procesos cargados.</p>
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

                    {/* <label htmlFor="processFile">Documento:</label>
                    <input
                        type="file"
                        id="processFile"
                        onChange={handleFileChange}
                        required
                    /> */}

                    <label>Seleccionar Repositorios:</label>
                    <div className="checkbox-group">
                        {systems.map((system) => (
                            <div key={system.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`sistema-${system.id}`}
                                    value={system.id}
                                    checked={selectedSystem.includes(system.id)} // Marca el checkbox si el ID está en selectedRepo
                                    onChange={(e) => {
                                        if (e.target.checked) { 
                                            setSelectedSystem([...selectedSystem, system.id]);
                                        } else {
                                            setSelectedSystem(selectedSystem.filter((id) => id !== system.id));
                                        }
                                    }}
                                />
                                <label htmlFor={`sistema-${system.id}`}>{system.nombre}</label>
                            </div>
                        ))}
                    </div>

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