import { useState } from "react";
import "../styles/FormPage.css";
import "../styles/Botones.css";
import { useNavigate } from "react-router-dom";

function SistemasPage() {
    const [repositories, setRepositories] = useState([]); // Lista de repositorios cargados
    const [selectedRepo, setSelectedRepo] = useState(""); // Repositorio seleccionado
    const [systemName, setSystemName] = useState(""); // Nombre del sistema
    const [systemDescription, setSystemDescription] = useState(""); // Descripción del sistema
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación

    const handleRepoChange = (event) => {
        setSelectedRepo(event.target.value); // Actualiza el repositorio seleccionado
    };

    const handleFileChange = (event) => {
        setRepoFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedRepo && systemName && systemDescription) {
            alert(`Sistema cargado correctamente:\nNombre: ${systemName}\nDescripción: ${systemDescription}\nRepositorio: ${selectedRepo}`);
            setSystemName(""); // Limpia el campo de nombre
            setSystemDescription(""); // Limpia el campo de descripción
            setSelectedRepo(""); // Limpia el repositorio seleccionado
            setShowForm(false); // Oculta el formulario después de cargar
        } else {
            alert("Por favor, completa todos los campos.");
        }
    };

    return (
        <div className="page-container">
            <h1>Gestión de Sistemas</h1>

            <div className="items-list">
                <h2>Sistemas Cargados</h2>
                {repositories.length > 0 ? (
                    <ul>
                        {repositories.map((repo, index) => (
                            <li key={index} className="item">
                                <div>
                                    <strong>{repo.name}</strong>
                                    <p>{repo.description}</p>
                                </div>
                                <span>{repo.fileName}</span>
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

                    <label htmlFor="repoFile">Documento:</label>
                    <input
                        type="file"
                        id="repoFile"
                        onChange={handleFileChange}
                        required
                    />

                    <label htmlFor="repoSelect">Seleccionar Repositorio:</label>
                    <select
                        id="repoSelect"
                        value={selectedRepo}
                        onChange={handleRepoChange}
                        required
                    >
                        <option value="" disabled>
                            Selecciona un repositorio
                        </option>
                        {repositories.map((repo, index) => (
                            <option key={index} value={repo.name}>
                                {repo.name}
                            </option>
                        ))}
                    </select>

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