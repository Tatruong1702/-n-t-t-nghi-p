import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import OwnerDashboard from '../pages/owner/Dashboard'
import OwnerVenues from '../pages/owner/Venues'
import OwnerCourts from '../pages/owner/Courts'
import OwnerBookings from '../pages/owner/Bookings'
import OwnerRevenue from '../pages/owner/Revenue'

const ownerMenuItems = [
  { to: '/owner/dashboard', icon: 'ti ti-layout-dashboard', label: 'Dashboard' },
  { to: '/owner/venues', icon: 'ti ti-building-castle', label: 'Venues' },
  { to: '/owner/courts', icon: 'ti ti-ball-football', label: 'Courts' },
  { to: '/owner/bookings', icon: 'ti ti-calendar', label: 'Bookings' },
  { to: '/owner/revenue', icon: 'ti ti-chart-bar', label: 'Revenue' },
]

export default function OwnerRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout menuItems={ownerMenuItems} title="Owner Workspace" subtitle="Owner Console" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="venues" element={<OwnerVenues />} />
        <Route path="courts" element={<OwnerCourts />} />
        <Route path="bookings" element={<OwnerBookings />} />
        <Route path="revenue" element={<OwnerRevenue />} />
      </Route>
    </Routes>
  )
}
