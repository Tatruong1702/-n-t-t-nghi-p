import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Heart, Bell, CalendarDays, Search, UserCircle2, LogIn, UserPlus, Home } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import HeaderUserMenu from './HeaderUserMenu'
import { getAvatarUrl, getInitials } from './avatarUtils'

const navItems = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Danh sách sân', to: '/venues' },
  { label: 'Đặt sân', to: '/booking' },
  { label: 'Khuyến mãi', to: '/promotions' },
  { label: 'Tin tức', to: '/news' },
  { label: 'Liên hệ', to: '/contact' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = useMemo(() => user?.full_name || user?.username || user?.name || 'Người dùng', [user])
  const initials = useMemo(() => getInitials(displayName), [displayName])
  const avatarUrl = useMemo(() => getAvatarUrl(user), [user])
    const role = String(user?.role || user?.user_role || 'user').toLowerCase()
  const homePath = role === 'admin' ? '/admin/dashboard' : role === 'owner' ? '/owner/dashboard' : '/'
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (role === 'admin') {
      navigate('/admin/dashboard')
    } else if (role === 'owner') {
      navigate('/owner/dashboard')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/75 backdrop-blur-xl shadow-sm shadow-slate-900/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={homePath} className="inline-flex items-center gap-3 text-lg font-semibold text-slate-950 transition hover:text-slate-900">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg shadow-slate-900/10">SB</span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm uppercase tracking-[0.28em] text-slate-500">San Bóng</span>
            <span className="text-base font-semibold text-slate-950">Booking Center</span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            <Search size={18} />
          </button>
          <Link to="/favorites" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            <Heart size={18} />
          </Link>
          <Link to="/notifications" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            <Bell size={18} />
          </Link>
          <Link to="/my-bookings" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            <CalendarDays size={18} />
          </Link>
          {user && (role === 'admin' || role === 'owner') ? (
            <button
              type="button"
              onClick={handleGoBack}
              title="Quay lại Admin/Owner"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition duration-300 hover:scale-[1.03] hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
            >
              <Home size={18} />
              <span className="hidden lg:inline">Quay lại</span>
            </button>
          ) : null}
          {user ? (
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">{initials}</div>
              )}
              <span className="hidden sm:inline-block">{displayName}</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-3">
              <Link to="/auth/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <LogIn size={18} /> Đăng nhập
              </Link>
              <Link to="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                <UserPlus size={18} /> Đăng ký
              </Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          Menu
        </button>
      </div>

      {menuOpen && user && (
        <div className="absolute right-4 top-20 z-40">
          <HeaderUserMenu onClose={() => setMenuOpen(false)} />
        </div>
      )}

      {open && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-5 shadow-[0_20px_80px_rgba(15,23,42,0.12)] md:hidden">
          <nav className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-3xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 space-y-3">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="block rounded-3xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Hồ sơ của tôi
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="w-full rounded-3xl border border-rose-200 bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" onClick={() => setOpen(false)} className="block rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  Đăng nhập
                </Link>
                <Link to="/auth/register" onClick={() => setOpen(false)} className="block rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
