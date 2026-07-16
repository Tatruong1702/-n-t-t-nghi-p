import React, { useMemo, useState } from 'react'
import { Bell, Search, SunMedium, UserCircle2 } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/common/AdminSidebar'
import HeaderUserMenu from '../components/common/HeaderUserMenu'
import UserHomeButton from '../components/common/UserHomeButton'
import useAuth from '../hooks/useAuth'

export default function DashboardLayout({ menuItems = [], title = 'Dashboard', subtitle = 'Workspace' }) {
  const location = useLocation()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const currentTitle = useMemo(() => {
    const activeItem = menuItems.find((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`))
    return activeItem?.label || title
  }, [location.pathname, menuItems, title])

  return (
    <div className="relative isolate min-h-screen bg-slate-100">
      <div className="flex min-h-screen items-stretch overflow-hidden">
        <div className="relative z-20 flex w-[280px] shrink-0 items-stretch">
          <AdminSidebar menuItems={menuItems} title={title} featureItems={[]} />
        </div>

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <header className="relative z-50 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{subtitle}</p>
                <div className="mt-2 flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-slate-950">{currentTitle}</h1>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                    {location.pathname.replace(/^\//, '').replace(/\//g, ' / ')}
                  </span>
                </div>
              </div>

              <div className="relative z-[100] flex items-center gap-2">
                <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <Search size={18} />
                </button>
                <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <Bell size={18} />
                </button>
                <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <SunMedium size={18} />
                </button>
                <UserHomeButton />
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <UserCircle2 size={18} />
                  {user?.full_name || user?.username || 'User'}
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-full z-[140] mt-3 w-72">
                    <HeaderUserMenu onClose={() => setMenuOpen(false)} />
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
