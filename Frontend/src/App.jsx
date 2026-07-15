import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookingProvider } from './context/BookingContext'
import ClientRoutes from './routes/ClientRoutes'
import OwnerRoutes from './routes/OwnerRoutes'
import AdminRoutes from './routes/AdminRoutes'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/owner/*"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerRoutes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />

          <Route path="/*" element={<ClientRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BookingProvider>
    </AuthProvider>
  )
}
