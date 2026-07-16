import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getRoleRedirectPath } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Đang kiểm tra quyền truy cập...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }

  const role = String(user.role || user.user_role || user.Role || 'user').toLowerCase()

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getRoleRedirectPath(role)} replace state={{ from: location }} />
  }

  return children
}
