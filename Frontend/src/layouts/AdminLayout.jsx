import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/common/AdminSidebar'

const adminMenuItems = [
  { to: '/admin/dashboard', icon: 'ti ti-layout-dashboard', label: 'Dashboard' },
  { to: '/admin/users', icon: 'ti ti-users', label: 'Users' },
  { to: '/admin/venues', icon: 'ti ti-building-castle', label: 'Venues' },
  { to: '/admin/bookings', icon: 'ti ti-ball-football', label: 'Bookings' },
  { to: '/admin/reports', icon: 'ti ti-chart-bar', label: 'Reports' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen items-stretch overflow-hidden bg-slate-100">
      <AdminSidebar menuItems={adminMenuItems} title="Admin Console" featureItems={[]} />

      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="min-h-full p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
