import { useState } from "react";
import "../styles/FormPage.css";
import { useNavigate } from "react-router-dom";
import "../styles/Botones.css";
import api from "../api"; 
import { useEffect } from "react";

function RepositorioPage() {
    const [repositories, setRepositories] = useState([]); // Lista de repositorios cargados
    const [repoName, setRepoName] = useState("");
    const [repoDescription, setRepoDescription] = useState("");
    // const [repoFile, setRepoFile] = useState(null);
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación
    const [org, setUsuario] = useState([{}]); // Lista de controles cargados

    const handleFileChange = (event) => {
        setRepoFile(event.target.files[0]);
    };

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
        if (repoName && repoDescription ) { //&& repoFile
            const newRepository = {
                nombre: repoName,
                tipo: "repositorio",
                descripcion: repoDescription,
                organizacion: org[0].id
            };
            api
                .post("/api/repositorios/", newRepository).then((response) => {
                     if (response.status === 201) {
                        setRepoName("");
                        setRepoDescription("");
                        handlegetRepos();
                        alert("Repositorio y archivo cargados correctamente.");
                        
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
            <h1>Gestión de Repositorios</h1>

            <div className="items-list">
                <h2>Repositorios Cargados</h2>
                {repositories.length > 0 ? (
                    <ul>
                        {repositories.map((repo, index) => (
                            <li key={index} className="item">
                                <div>
                                    <strong>{repo.nombre}</strong>
                                    <p>{repo.id} {repo.descripcion}</p>
                                    
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
                    {showForm ? "Ocultar Formulario" : "Cargar Nuevo Repositorio"}
                </button>
            </div>

            {showForm && (
                <form className="form-container" onSubmit={handleSubmit}>
                    <h3>Cargar Nuevo Repositorio</h3>
                    <label htmlFor="repoName">Nombre del Repositorio:</label>
                    <input
                        type="text"
                        id="repoName"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        placeholder="Ingresa el nombre del repositorio"
                        required
                    />

                    <label htmlFor="repoDescription">Descripción:</label>
                    <textarea
                        id="repoDescription"
                        value={repoDescription}
                        onChange={(e) => setRepoDescription(e.target.value)}
                        placeholder="Ingresa una descripción"
                        required
                    ></textarea>

                    {/* <label htmlFor="repoFile">Documento:</label>
                    <input
                        type="file"
                        id="repoFile"
                        onChange={handleFileChange}
                        required
                    /> */}

                    <button type="submit" className="submit-button">
                        Cargar
                    </button>
                </form>
            )}

            <button className="back-to-home" onClick={() => navigate("/datos-org")}>
                Volver
            </button>
        </div>
    );
}

export default RepositorioPage;