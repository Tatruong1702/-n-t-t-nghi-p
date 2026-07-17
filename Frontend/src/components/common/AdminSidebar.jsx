import React from 'react'
import { NavLink } from 'react-router-dom'

const defaultMenuItems = [
  { to: '/admin', icon: 'ti ti-layout-dashboard', label: 'Tổng quan' },
  { to: '/admin/users', icon: 'ti ti-users', label: 'Người dùng' },
  { to: '/admin/venues', icon: 'ti ti-building-castle', label: 'Địa điểm' },
  { to: '/admin/bookings', icon: 'ti ti-ball-football', label: 'Bookings' },
  { to: '/admin/reports', icon: 'ti ti-chart-bar', label: 'Báo cáo' },
]

const defaultFeatureItems = [
  { to: '/admin', icon: 'ti ti-file', label: 'Pages' },
  { to: '/admin', icon: 'ti ti-apps', label: 'Apps' },
]

export default function AdminSidebar({ menuItems = defaultMenuItems, featureItems = defaultFeatureItems, title = 'Dashboard' }) {
  return (
    <aside className="flex min-h-screen w-[280px] shrink-0 flex-col self-stretch border-r border-slate-700 bg-slate-900 text-white">
      <div className="px-6 py-6 text-sm font-semibold">{title}</div>

      <nav className="flex-1 space-y-1 px-4 pb-6 text-sm text-slate-300">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-3xl px-4 py-3 ${
                isActive ? 'bg-white/10 text-white shadow-sm' : 'text-slate-300 hover:bg-white/10'
              }`
            }
          >
            <i className={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {featureItems.length ? (
        <>
          <div className="px-6 pb-1 pt-4 text-[10px] uppercase tracking-widest text-slate-400">Features</div>
          <nav className="flex flex-col gap-0.5 px-2 pb-6">
            {featureItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className="flex items-center gap-2 rounded px-3 py-2 text-slate-400 hover:bg-white/5"
              >
                <i className={item.icon} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </>
      ) : null}
    </aside>
  )
}
