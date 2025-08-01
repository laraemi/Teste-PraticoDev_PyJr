import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: true
}

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true }
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.access,
                loading: false
            }
        case 'LOGIN_FAILURE':
            return { ...state, loading: false }
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                loading: false
            }
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload
            }
        default:
            return state
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const user = await authService.getProfile()
                    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, access: token } })
                } catch (error) {
                    localStorage.removeItem('token')
                    dispatch({ type: 'LOGOUT' })
                }
            } else {
                dispatch({ type: 'LOGOUT' })
            }
        }

        initializeAuth()
    }, [])

    const login = async (email, password) => {
        dispatch({ type: 'LOGIN_START' })
        try {
            const response = await authService.login(email, password)
            localStorage.setItem('token', response.access)
            dispatch({ type: 'LOGIN_SUCCESS', payload: response })
            toast.success('Login realizado com sucesso!')
            return true
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE' })
            toast.error(error.response?.data?.error || 'Erro ao fazer login')
            return false
        }
    }

    const register = async (userData) => {
        try {
            await authService.register(userData)
            toast.success('Conta criada com sucesso! Faça login para continuar.')
            return true
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao criar conta')
            return false
        }
    }

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
                await authService.logout(refreshToken)
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            dispatch({ type: 'LOGOUT' })
            toast.success('Logout realizado com sucesso!')
        }
    }

    const updateProfile = async (userData) => {
        try {
            const updatedUser = await authService.updateProfile(userData)
            dispatch({ type: 'UPDATE_USER', payload: updatedUser })
            toast.success('Perfil atualizado com sucesso!')
            return true
        } catch (error) {
            toast.error(error.response?.data?.error || 'Erro ao atualizar perfil')
            return false
        }
    }

    const value = {
        user: state.user,
        token: state.token,
        loading: state.loading,
        login,
        register,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
} 