import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Mock the AuthContext
const mockAuthContext = {
    user: null,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn()
}

// Mock the AuthProvider
vi.mock('./contexts/AuthContext', () => ({
    useAuth: () => mockAuthContext,
    AuthProvider: ({ children }) => children
}))

describe('App', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        )
    })

    it('redirects to login when user is not authenticated', () => {
        mockAuthContext.user = null
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        )

        // Should redirect to login page
        expect(window.location.pathname).toBe('/login')
    })
}) 