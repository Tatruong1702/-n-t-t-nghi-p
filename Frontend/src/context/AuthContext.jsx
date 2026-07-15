import React, { createContext, useState, useEffect } from 'react'
import authApi from '../api/authApi'
import userApi from '../api/userApi'

export const AuthContext = createContext(null)

export const normalizeRole = (role) => String(role || 'user').toLowerCase()

export const getRoleRedirectPath = (role = 'user') => {
  const normalizedRole = normalizeRole(role)
  if (normalizedRole === 'admin') return '/admin/dashboard'
  if (normalizedRole === 'owner') return '/owner/dashboard'
  return '/'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authApi.profile()
        const profileUser = res?.data?.data?.user || null
        setUser(profileUser)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const login = async (values) => {
    const res = await authApi.login(values)
    const token = res?.data?.data?.token
    const authUser = res?.data?.data?.user || null

    if (token) localStorage.setItem('token', token)
    if (authUser) setUser(authUser)

    return res
  }

  const register = async (values) => {
    const res = await authApi.register(values)
    const token = res?.data?.data?.token
    const authUser = res?.data?.data?.user || null

    if (token) localStorage.setItem('token', token)
    if (authUser) setUser(authUser)

    return res
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateProfile = async (profile) => {
    const res = await userApi.updateProfile(profile)
    setUser(res?.data?.data?.user || null)
    return res
  }

  const saveUser = (userData) => {
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, saveUser, getRoleRedirectPath }}>
      {children}
    </AuthContext.Provider>
  )
}
