import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DatosPage.css";

function DatosOrgPage() {
    const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para manejar el menú desplegable
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen); // Alterna entre abrir y cerrar el menú
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/home");
    };

    return (
        <div className="datosorg-container">
            {/* Encabezado */}
            <header className="homeuser-header">
                <h1>Datos Organizacionales</h1>
                <div className="dropdown">
                    <button className="dropdown-button" onClick={toggleDropdown}>
                        Menu
                    </button>
                    {dropdownOpen && ( /* Muestra el menú solo si dropdownOpen es true */
                        <div className="dropdown-menu">
                            <button className="dropdown-item" onClick={() => navigate("/page1")}>Page 1</button>
                            <button className="dropdown-item" onClick={() => navigate("/page2")}>Page 2</button>
                            <button className="dropdown-item" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Cuerpo */}
            <main className="datosorg-main">
                <button className="main-button" onClick={() => navigate("/pageB1")}>
                    Generales
                </button>
                <button className="main-button" onClick={() => navigate("/Controles")}>
                    Controles
                </button>
                <button className="main-button" onClick={() => navigate("/repositorio")}>
                    Repositorios de Datos
                </button>
                <button className="main-button" onClick={() => navigate("/sistemas")}>
                    Sistemas de Informacion
                </button>
                <button className="main-button" onClick={() => navigate("/procesos")}>
                    Procesos de Negocio
                </button>
                <button className="main-button" onClick={() => navigate("/stakeholders")}>
                    Stakeholders
                </button>
                <button className="main-button" onClick={() => navigate("/departamentos")}>
                    Departamentos Organizacionales
                </button>
            </main>

            {/* Botón para volver */}
            <button className="back-to-home" onClick={() => navigate("/")}>
                Volver
            </button>
        </div>
    );
}

export default DatosOrgPage;