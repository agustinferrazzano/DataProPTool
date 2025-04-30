import { useState } from "react";
import "../styles/FormPage.css";
import "../styles/Botones.css";
import { useNavigate } from "react-router-dom";
import api from "../api"; 
import { useEffect } from "react";

function SistemasPage() {
    const [repositories, setRepositories] = useState([]); // Lista de repositorios cargados
    const [selectedRepo, setSelectedRepo] = useState([]); // Cambia de string a array
    const [systemName, setSystemName] = useState(""); // Nombre del sistema
    const [systemDescription, setSystemDescription] = useState(""); // Descripción del sistema
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación
    const [system, setSistemas] = useState([]);

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

    const handlegetRepos = () => {
        api
            .get("/api/repositorios/")
            .then((response) => {
                console.log("Respuesta del backend:", response.data); // Verifica la estructura de los datos
                setRepositories(response.data); // Asegúrate de que sea un array
            })
            .catch((error) => {
                console.error("Error fetching controls:", error);
            });
    };

    useEffect(() => {
        handlegetRepos();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (systemName && systemDescription ) { //&& repoFile
            const newSystem = {
                nombre: systemName,
                tipo: "Sistema",
                descripcion: systemDescription,
                repositorio_ids: selectedRepo,  
            };
            console.log("Datos enviados:", newSystem);
            
            api
                .post("/api/sistemas/", newSystem).then((response) => {
                     if (response.status === 201) {
                        setSystemName("");
                        setSystemDescription("");
                        setSelectedRepo([]); // Limpia el estado de selectedRepo
                        handlegetSistemas();
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
            <h1>Gestión de Sistemas</h1>

            <div className="items-list">
                <h2>Sistemas Cargados</h2>
                {system.length > 0 ? (
                    <ul>
                        {system.map((sistema, index) => (
                            <li key={index} className="item">
                                <div>
                                    <strong>{sistema.nombre}</strong>
                                    <p>{sistema.descripcion}</p>
                                    <p>
                                        Repositorios:{" "}
                                        {sistema.repositorio.map((repo) => repo.nombre).join(", ")}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay repositorios cargados.</p>
                )}
                <button
                    className="show-form-button"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Ocultar Formulario" : "Cargar Nuevo Sistema"}
                </button>
            </div>

            {showForm && (
                <form className="form-container" onSubmit={handleSubmit}>
                    <h3>Cargar Nuevo Sistema</h3>
                    <label htmlFor="systemName">Nombre del Sistema:</label>
                    <input
                        type="text"
                        id="systemName"
                        value={systemName}
                        onChange={(e) => setSystemName(e.target.value)}
                        placeholder="Ingresa el nombre del sistema"
                        required
                    />

                    <label htmlFor="systemDescription">Descripción del Sistema:</label>
                    <textarea
                        id="systemDescription"
                        value={systemDescription}
                        onChange={(e) => setSystemDescription(e.target.value)}
                        placeholder="Ingresa una descripción del sistema"
                        required
                    ></textarea>

                    <label>Seleccionar Repositorios:</label>
                    <div className="checkbox-group">
                        {repositories.map((repo) => (
                            <div key={repo.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={`repo-${repo.id}`}
                                    value={repo.id}
                                    checked={selectedRepo.includes(repo.id)} // Marca el checkbox si el ID está en selectedRepo
                                    onChange={(e) => {
                                        if (e.target.checked) { 
                                            setSelectedRepo([...selectedRepo, repo.id]);
                                        } else {
                                            setSelectedRepo(selectedRepo.filter((id) => id !== repo.id));
                                        }
                                    }}
                                />
                                <label htmlFor={`repo-${repo.id}`}>{repo.nombre}</label>
                            </div>
                        ))}
                    </div>

                    <button type="submit" className="submit-button">
                        Cargar Sistema
                    </button>
                </form>
            )}

            <button className="back-to-home" onClick={() => navigate("/datos-org")}>
                Volver
            </button>
        </div>
    );
}

export default SistemasPage;