import { useState } from "react";
import "../styles/FormPage.css";
import { useNavigate } from "react-router-dom";
import "../styles/Botones.css";

function RepositorioPage() {
    const [repositories, setRepositories] = useState([]); // Lista de repositorios cargados
    const [repoName, setRepoName] = useState("");
    const [repoDescription, setRepoDescription] = useState("");
    const [repoFile, setRepoFile] = useState(null);
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const navigate = useNavigate(); // Hook para manejar la navegación

    const handleFileChange = (event) => {
        setRepoFile(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (repoName && repoDescription && repoFile) {
            const newRepository = {
                name: repoName,
                description: repoDescription,
                fileName: repoFile.name,
            };
            setRepositories([...repositories, newRepository]); // Agrega el nuevo repositorio a la lista
            setRepoName(""); // Limpia el campo de nombre
            setRepoDescription(""); // Limpia el campo de descripción
            setRepoFile(null); // Limpia el archivo seleccionado
            setShowForm(false); // Oculta el formulario después de cargar
            alert("Repositorio cargado correctamente.");
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

                    <label htmlFor="repoFile">Documento:</label>
                    <input
                        type="file"
                        id="repoFile"
                        onChange={handleFileChange}
                        required
                    />

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