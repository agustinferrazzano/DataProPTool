import { useState } from "react";
import "../styles/FormPage.css";
import "../styles/Botones.css";
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import { useEffect } from "react";

function StakeholderPage() {
    const [processes, setProcess] = useState([]); // Lista de procesos cargados
    const [stakeholders, setStakeholder] = useState([]); // Lista de procesos cargados
    const [selectedProcess, setSelectedProcess] = useState([]); // Proceso seleccionado
    const [roleName, setRoleName] = useState(""); // Nombre del cargo
    const [roleDescription, setRoleDescription] = useState(""); // Descripción del cargo
    const [roleFile, setRoleFile] = useState(null); // Archivo del cargo
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación
    const [org, setUsuario] = useState([{}]); // Lista de controles cargados

    const handlegetStakeholder = () => {
        api
            .get("/api/stakeholders/")
            .then((response) => {
                console.log("Respuesta del backend:", response.data); // Verifica la estructura de los datos
                setStakeholder(response.data); // Asegúrate de que sea un array
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
    
    // const handleFileChange = (event) => {
    //     setRoleFile(event.target.files[0]); // Actualiza el archivo seleccionado
    // };

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
        if (roleName && roleDescription ) { //&& repoFile
            const newRole = {
                nombre: roleName,
                tipo: "stakeholder",
                descripcion_rol: roleDescription,
                procesos_ids: selectedProcess,
                organizacion: org[0].id  
            };
            console.log("Datos enviados:", newRole);
            
            api
                .post("/api/stakeholders/", newRole).then((response) => {
                     if (response.status === 201) {
                        setRoleName("");
                        setRoleDescription("");
                        setSelectedProcess([]); // Limpia el estado de selectedRepo
                        handlegetStakeholder();
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
            <h1>Gestión de Cargos Organizacionales</h1>

            <div className="items-list">
                <h2>Stakeholder Cargados</h2>
                {stakeholders.length > 0 ? (
                    <ul>
                        {stakeholders.map((role, index) => (
                            <li key={index} className="item">
                                <div>
                                    <strong>{role.nombre}</strong>
                                    <p>{role.descripcion}</p>
                                    <p>
                                        Sistemas:{" "}
                                        {role.procesos.map((proceso) => proceso.nombre).join(", ")}
                                    </p>
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay Stakehodlers cargados.</p>
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

                    {/* <label htmlFor="roleFile">Documento:</label>
                    <input
                        type="file"
                        id="roleFile"
                        onChange={handleFileChange}
                        required
                    /> */}

                    <label>Seleccionar Proceos que realiza el Stakeholder:</label>
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