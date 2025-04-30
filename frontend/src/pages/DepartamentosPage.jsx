import { useState } from "react";
import "../styles/FormPage.css";
import "../styles/Botones.css";
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import { useEffect } from "react";

function DepartamentosPage() {
    const [departamentos, setDepartamentos] = useState([]); // Lista de procesos cargados
    const [processes, setProcess] = useState([]); // Lista de procesos cargados
    const [stakeholders, setStakeholders] = useState([]); // Lista de stakeholders cargados
    const [selectedProcess, setSelectedProcess] = useState([]); // Proceso seleccionado
    const [selectedStakeholder, setSelectedStakeholder] = useState([]); // Stakeholder seleccionado
    const [departmentName, setDepartmentName] = useState(""); // Nombre del departamento
    const [departmentDescription, setDepartmentDescription] = useState(""); // Descripción del departamento
    const [departmentFile, setDepartmentFile] = useState(null); // Archivo del departamento
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación

    const handlegetStakeholder = () => {
        api
            .get("/api/stakeholders/")
            .then((response) => {
                console.log("Respuesta del backend:", response.data); // Verifica la estructura de los datos
                setStakeholders(response.data); // Asegúrate de que sea un array
            })
            .catch((error) => {
                console.error("Error fetching controls:", error);
            });
    };

    useEffect(() => {
        handlegetStakeholder();
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

    const handlegetDepartamentos = () => {
        api
            .get("/api/departamentos/")
            .then((response) => {
                console.log("Respuesta del backend:", response.data); // Verifica la estructura de los datos
                setDepartamentos(response.data); // Asegúrate de que sea un array
            })
            .catch((error) => {
                console.error("Error fetching controls:", error);
            });
    };

    useEffect(() => {
        handlegetDepartamentos();
    }, []);
    

    const handleFileChange = (event) => {
        setDepartmentFile(event.target.files[0]); // Actualiza el archivo seleccionado
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (departmentName && departmentDescription ) { //&& repoFile
            const newDepartamento = {
                nombre: departmentName,
                tipo: "Departamento",
                descripcion: departmentDescription,
                procesos_ids: selectedProcess,
                stakeholder_ids: selectedStakeholder,  
            };
            console.log("Datos enviados:", newDepartamento);
            
            api
                .post("/api/departamentos/", newDepartamento).then((response) => {
                     if (response.status === 201) {
                        setDepartmentName("");
                        setDepartmentDescription("");
                        setSelectedProcess([]); 
                        setSelectedStakeholder([]);
                        handlegetDepartamentos();
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
            <h1>Gestión de Departamentos Organizacionales</h1>

            <div className="items-list">
                <h2>Departamentos Cargados</h2>
                {departamentos.length > 0 ? (
                    <ul>
                        {departamentos.map((departamento, index) => (
                            <li key={index} className="item">
                                <div>
                                    <strong>{departamento.nombre}</strong>
                                    <p>{departamento.descripcion}</p>
                                    <p>
                                        Sistemas:{" "}
                                        {departamento.procesos.map((proceso) => proceso.nombre).join(", ")} 
                                        , 
                                        Stakeholders:{" "}
                                        {departamento.stakeholder.map((role) => role.nombre).join(", ")}
                                    </p>
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay Departamentos cargados.</p>
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

                    {/* <label htmlFor="departmentFile">Documento:</label>
                    <input
                        type="file"
                        id="departmentFile"
                        onChange={handleFileChange}
                        required
                    /> */}

                    <label>Seleccionar los Proceos que realiza el Departamento:</label>
                    <div className="checkbox-group">
                        {processes.map((proceso) => (
                            <div key={proceso.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`proceso-${proceso.id}`}
                                    value={proceso.id}
                                    checked={selectedProcess.includes(proceso.id)} // Marca el checkbox si el ID está en selectedRepo
                                    onChange={(e) => {
                                        if (e.target.checked) { 
                                            setSelectedProcess([...selectedProcess, proceso.id]);
                                        } else {
                                            setSelectedProcess(selectedProcess.filter((id) => id !== proceso.id));
                                        }
                                    }}
                                />
                                <label htmlFor={`proceso-${proceso.id}`}>{proceso.nombre}</label>
                            </div>
                        ))}
                    </div>

                    <label>Seleccionar los stakeholder que pertenecen al Departamento:</label>
                    <div className="checkbox-group">
                        {stakeholders.map((stakeholder) => (
                            <div key={stakeholder.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`stakeholder-${stakeholder.id}`}
                                    value={stakeholder.id}
                                    checked={selectedStakeholder.includes(stakeholder.id)} // Marca el checkbox si el ID está en selectedRepo
                                    onChange={(e) => {
                                        if (e.target.checked) { 
                                            setSelectedStakeholder([...selectedStakeholder, stakeholder.id]);
                                        } else {
                                            selectedStakeholder(selectedStakeholder.filter((id) => id !== stakeholder.id));
                                        }
                                    }}
                                />
                                <label htmlFor={`stakeholder-${stakeholder.id}`}>{stakeholder.nombre}</label>
                            </div>
                        ))}
                    </div>

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