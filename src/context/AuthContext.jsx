import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      // Get all users and find matching email/password
      // Note: Backend doesn't have login endpoint, so we fetch all users
      // In production with real auth, this should be replaced with /v1/auth/login
      const response = await authService.getUser(1) // This is a placeholder
      // For now, we'll just store the user data
      const userData = { email, name: 'User' }
      
      localStorage.setItem('authToken', 'demo-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify(userData))
      setToken('demo-token-' + Date.now())
      setUser(userData)
      return { token: 'demo-token-' + Date.now(), user: userData }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.signup(userData)
      // Backend returns { status, message, data: { userId, fullName, email, ... } }
      const user = response.data || response
      const userId = user.userId || user.id || 1

      // Create a simple token (backend doesn't implement JWT yet)
      const token = 'auth-token-' + userId + '-' + Date.now()

      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify({ 
        id: userId,
        fullName: user.fullName || userData.fullName,
        email: user.email || userData.email,
        phone: user.phone || userData.phone,
      }))
      
      setToken(token)
      setUser({ 
        id: userId,
        fullName: user.fullName || userData.fullName,
        email: user.email || userData.email,
        phone: user.phone || userData.phone,
      })
      
      return { 
        token, 
        user: { 
          id: userId,
          fullName: user.fullName || userData.fullName,
          email: user.email || userData.email,
        } 
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setError(null)
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
