import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
        <div>
            {/* Encabezado */}
            <header style={{ display: "flex", justifyContent: "space-between", padding: "10px"}}>
                <h1>Welcome</h1>
                <nav>
                    <Link to="/login" style={{ }}>Login</Link>
                    <Link to="/register">Register</Link>
                </nav>
            </header>

            {/* Cuerpo */}
            <main style={{ padding: "20px" }}>
                <h2>About This Page</h2>
                <p>
                    This is the home page of our application. From here, you can navigate to the login page to access your account or to the register page to create a new account.
                </p>
            </main>
        </div>
    );
}

export default Home;