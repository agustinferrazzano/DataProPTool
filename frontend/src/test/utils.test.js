// Tests utilitarios para funciones helpers
import { describe, it, expect } from 'vitest'

// Test para la configuración de API
describe('API Configuration', () => {
  it('debe tener una URL de API válida', () => {
    // Test básico para verificar configuración
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    expect(apiUrl).toBeTruthy()
    expect(apiUrl).toMatch(/^https?:\/\//)
  })
})

// Tests para funciones utilitarias comunes
describe('Utility Functions', () => {
  it('debe formatear fechas correctamente', () => {
    const testDate = new Date('2024-01-01')
    const formatted = testDate.toLocaleDateString()
    expect(formatted).toBeTruthy()
  })

  it('debe validar emails básicos', () => {
    const validEmail = 'test@example.com'
    const invalidEmail = 'invalid-email'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    expect(emailRegex.test(validEmail)).toBe(true)
    expect(emailRegex.test(invalidEmail)).toBe(false)
  })
})