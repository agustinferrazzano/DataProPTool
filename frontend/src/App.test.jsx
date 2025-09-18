// Test de ejemplo para App.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renderiza sin errores', () => {
    render(<App />)
    // Verifica que el componente se renderice
    expect(document.body).toBeTruthy()
  })

  it('debe tener el contenido principal', () => {
    render(<App />)
    // Busca elementos comunes que probablemente tengas
    // Ajusta estos selectores según tu aplicación real
    const appElement = document.querySelector('#root')
    expect(appElement).toBeInTheDocument()
  })
})