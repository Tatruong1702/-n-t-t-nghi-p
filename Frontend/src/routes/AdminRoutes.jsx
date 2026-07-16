import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import AdminDashboard from '../pages/admin/Dashboard'
import AdminUsers from '../pages/admin/Users'
import AdminVenues from '../pages/admin/Venues'
import AdminBookings from '../pages/admin/Bookings'
import AdminReports from '../pages/admin/Reports'

const adminMenuItems = [
  { to: '/admin/dashboard', icon: 'ti ti-layout-dashboard', label: 'Dashboard' },
  { to: '/admin/users', icon: 'ti ti-users', label: 'Users' },
  { to: '/admin/venues', icon: 'ti ti-building-castle', label: 'Venues' },
  { to: '/admin/bookings', icon: 'ti ti-ball-football', label: 'Bookings' },
  { to: '/admin/reports', icon: 'ti ti-chart-bar', label: 'Reports' },
]

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout menuItems={adminMenuItems} title="Admin Workspace" subtitle="Admin Console" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="venues" element={<AdminVenues />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </Routes>
  )
}
