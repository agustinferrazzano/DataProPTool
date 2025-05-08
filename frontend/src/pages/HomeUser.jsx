import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../styles/HomeUser.css";

function HomeUser() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loggedOut, setLoggedOut] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        setLoggedOut(true);
    };

    if (loggedOut) {
        return <Navigate to="/home" />;
    }

    return (
        <div>
            {/* Encabezado */}
            <header className="homeuser-header">
                <h1>Home User</h1>
                <div className="dropdown">
                    <button className="dropdown-button" onClick={toggleDropdown}>
                        Menu
                    </button>
                    {dropdownOpen && (
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
            <main className="homeuser-main">
                <div className="main-buttons-grid">
                    <button className="main-button" onClick={() => navigate("/dataproblems")}>
                        A1. Identificación de Data Problems
                    </button>
                    <button className="main-button" onClick={() => navigate("/pageA2")}>
                        A2. Análisis de Data Problems específicos
                    </button>
                    <button className="main-button" onClick={() => navigate("/pageA3")}>
                        A3. Evaluación de Data Problems específicos
                    </button>
                    <button className="main-button" onClick={() => navigate("/pageA4")}>
                        A4. Evaluación de Data Problems específicos
                    </button>
                    <button className="main-button" onClick={() => navigate("/pageA5")}>
                        A5. Priorización de Data Problems específicos
                    </button>
                </div>
                <button className="user-button" onClick={() => navigate("/datos-org")}>
                    Carga de datos
                </button>
            </main>
        </div>
    );
}

export default HomeUser;