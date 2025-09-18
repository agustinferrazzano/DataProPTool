// Test básico para App.jsx
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// Mock de React Router para evitar errores en testing
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => <div data-testid="route">{element}</div>,
  Navigate: ({ to }) => <div data-testid="navigate">Redirecting to {to}</div>
}))

// Mock global de Navigate para que esté disponible
global.Navigate = ({ to }) => <div data-testid="navigate">Redirecting to {to}</div>

// Mock de todos los componentes de páginas
vi.mock('./pages/Login', () => ({ default: () => <div>Login</div> }))
vi.mock('./pages/Register', () => ({ default: () => <div>Register</div> }))
vi.mock('./pages/Home', () => ({ default: () => <div>Home</div> }))
vi.mock('./pages/NotFound', () => ({ default: () => <div>NotFound</div> }))
vi.mock('./pages/HomeUser', () => ({ default: () => <div>HomeUser</div> }))
vi.mock('./pages/DatosOrgPage', () => ({ default: () => <div>DatosOrgPage</div> }))
vi.mock('./pages/Controlespage', () => ({ default: () => <div>Controlespage</div> }))
vi.mock('./pages/RepositorioPage', () => ({ default: () => <div>RepositorioPage</div> }))
vi.mock('./pages/SistemasPage', () => ({ default: () => <div>SistemasPage</div> }))
vi.mock('./pages/ProcesosPage', () => ({ default: () => <div>ProcesosPage</div> }))
vi.mock('./pages/StakeholderPage', () => ({ default: () => <div>StakeholderPage</div> }))
vi.mock('./pages/DepartamentosPage', () => ({ default: () => <div>DepartamentosPage</div> }))
vi.mock('./pages/IdentificaciondeDataProblems', () => ({ default: () => <div>IdentificaciondeDataProblems</div> }))
vi.mock('./pages/CargarDataProblem', () => ({ default: () => <div>CargarDataProblem</div> }))
vi.mock('./pages/Tecnicas', () => ({ default: () => <div>Tecnicas</div> }))
vi.mock('./pages/AnalisisdeDataProblems', () => ({ default: () => <div>AnalisisdeDataProblems</div> }))
vi.mock('./pages/AnalizarDataProblems', () => ({ default: () => <div>AnalizarDataProblems</div> }))
vi.mock('./pages/Information', () => ({ default: () => <div>Information</div> }))
vi.mock('./pages/EvaluacionDataProblems', () => ({ default: () => <div>EvaluacionDataProblems</div> }))
vi.mock('./pages/HerramientasAnalisis', () => ({ default: () => <div>HerramientasAnalisis</div> }))
vi.mock('./pages/ResuladosClasificacion', () => ({ default: () => <div>ResuladosClasificacion</div> }))
vi.mock('./pages/ClasificacionDataProblems', () => ({ default: () => <div>ClasificacionDataProblems</div> }))
vi.mock('./pages/PriorizacionProcesos', () => ({ default: () => <div>PriorizacionProcesos</div> }))

// Mock de ProtectedRoute
vi.mock('./components/ProtectedRoute', () => ({
  default: ({ children }) => <div data-testid="protected-route">{children}</div>
}))

import App from './App'

describe('App Component', () => {
  it('renderiza sin errores', () => {
    // Test básico para verificar que el componente se renderiza
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  it('contiene el router principal', () => {
    // Verifica que el router esté presente en el DOM
    const { getByTestId } = render(<App />)
    expect(getByTestId('router')).toBeInTheDocument()
  })

  it('renderiza las rutas correctamente', () => {
    // Verifica que el componente Routes esté presente
    const { getByTestId } = render(<App />)
    expect(getByTestId('routes')).toBeInTheDocument()
  })
})