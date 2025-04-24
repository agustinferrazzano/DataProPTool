import react from 'react';
import { BrowserRouter, Router, Route, Routes } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeUser from './pages/HomeUser';
import DatosOrgPage from './pages/DatosOrgPage';
import ControlesPage from './pages/Controlespage';
import RepositorioPage from './pages/RepositorioPage';
import SistemasPage from './pages/SistemasPage';
import ProcesosPage from './pages/ProcesosPage';
import StakeholderPage from './pages/StakeholderPage';
import DepartamentosPage from './pages/DepartamentosPage';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <>   
      <BrowserRouter>
      <Routes>
        {/* <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeUser />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/HomeUser" element={<HomeUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/datos-org" element={<DatosOrgPage />} />
        <Route path="/controles" element={<ControlesPage />} />
        <Route path="/repositorio" element={<RepositorioPage />} />
        <Route path="/sistemas" element={<SistemasPage/>} />
        <Route path="/procesos" element={<ProcesosPage/>} />
        <Route path="/stakeholders" element={<StakeholderPage/>} />
        <Route path="/departamentos" element={<DepartamentosPage/>} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
