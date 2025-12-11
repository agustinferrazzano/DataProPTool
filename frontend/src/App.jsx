import react from 'react';
import { BrowserRouter, Router, Route, Routes, Navigate } from 'react-router-dom';
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
import IdentificaciondeDataProblems from './pages/IdentificaciondeDataProblems';
import CargarDataProblem from './pages/CargarDataProblem';
import Tecnicas from './pages/Tecnicas';
import AnalisisdeDataProblems from './pages/AnalisisdeDataProblems';
import AnalizarDataProblems from './pages/AnalizarDataProblems';
import Information from './pages/Information';
import EvaluacionDataProblems from './pages/EvaluacionDataProblems';
import HerramientasDeAnalisis from './pages/HerramientasAnalisis';
import ResultadosClasificacionDataProblems from './pages/ResuladosClasificacion';
import ClassificacionDataProblems from './pages/ClasificacionDataProblems';
import PriorizacionProcesos from './pages/PriorizacionProcesos';
import PersonasPage from './pages/PersonasPage';

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
      <BrowserRouter basename="/DataProPTool">
      <Routes>
        <Route path="/" element={<ProtectedRoute> <HomeUser /></ProtectedRoute>}/>
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/datos-org" element={<ProtectedRoute><DatosOrgPage /></ProtectedRoute>} />
        <Route path="/controles" element={<ProtectedRoute><ControlesPage /></ProtectedRoute>} />
        <Route path="/repositorio" element={<ProtectedRoute><RepositorioPage /></ProtectedRoute>} />
        <Route path="/sistemas" element={<ProtectedRoute><SistemasPage/></ProtectedRoute>} />
        <Route path="/procesos" element={<ProtectedRoute><ProcesosPage/></ProtectedRoute>} />
        <Route path="/stakeholders" element={<ProtectedRoute><StakeholderPage/></ProtectedRoute>} />
        <Route path="/departamentos" element={<ProtectedRoute><DepartamentosPage/></ProtectedRoute>} />
        <Route path="/dataproblems" element={<ProtectedRoute><IdentificaciondeDataProblems /></ProtectedRoute>} />
        <Route path="/cargardataproblems" element={<ProtectedRoute><CargarDataProblem /></ProtectedRoute>} />
        <Route path="/tecnicas" element={<ProtectedRoute><Tecnicas /></ProtectedRoute>} />
        <Route path="/herramientas" element={<ProtectedRoute><HerramientasDeAnalisis /></ProtectedRoute>} />
        <Route path="/analisis" element={<ProtectedRoute><AnalisisdeDataProblems /></ProtectedRoute>} />
        <Route path="/analizar/:id" element={<ProtectedRoute><AnalizarDataProblems /></ProtectedRoute>} />
        <Route path="/information" element={<ProtectedRoute><Information /></ProtectedRoute>} />
        <Route path="/evaluacion" element={<ProtectedRoute><EvaluacionDataProblems /></ProtectedRoute>} />
        <Route path="/resultadosclasificacion" element={<ProtectedRoute><ResultadosClasificacionDataProblems /></ProtectedRoute>} />
        <Route path="/clasificaciondataproblems" element={<ProtectedRoute><ClassificacionDataProblems /></ProtectedRoute>} />
        <Route path="/priorizacionprocesos" element={<ProtectedRoute><PriorizacionProcesos /></ProtectedRoute>} />
        <Route path="/persons" element={<ProtectedRoute><PersonasPage/></ProtectedRoute>} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}
  
export default App
