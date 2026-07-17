import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Heart, MapPin, Search, CalendarDays, Settings2, LogOut, User2, Ticket, Sparkles } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import { getAvatarUrl, getInitials } from './avatarUtils'

const baseNavItems = [
  { label: 'Hồ sơ cá nhân', to: '/profile', icon: User2 },
  { label: 'Lịch đặt sân', to: '/my-bookings', icon: CalendarDays },
  { label: 'Sân yêu thích', to: '/favorites', icon: Heart },
  { label: 'Khuyến mãi của tôi', to: '/promotions', icon: Ticket },
  { label: 'Thông báo', to: '/notifications', icon: Bell },
  { label: 'Cài đặt', to: '/settings', icon: Settings2 },
]

const ownerNavItems = [
  { label: 'Dashboard', to: '/owner/dashboard', icon: Sparkles },
  { label: 'Quản lý sân', to: '/owner/venues', icon: MapPin },
  { label: 'Booking', to: '/owner/bookings', icon: CalendarDays },
  { label: 'Hồ sơ', to: '/profile', icon: User2 },
]

export default React.memo(function HeaderUserMenu({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = useMemo(() => user?.full_name || user?.username || user?.name || 'Người dùng', [user])
  const initials = useMemo(() => getInitials(displayName), [displayName])
  const avatarUrl = useMemo(() => getAvatarUrl(user), [user])
  const role = String(user?.role || user?.user_role || 'user').toLowerCase()
  const navItems = role === 'owner' ? ownerNavItems : baseNavItems

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="relative z-[130] w-full rounded-[32px] border border-slate-200 bg-white/95 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="h-14 w-14 rounded-3xl object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-lg font-semibold text-white">{initials}</div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{displayName}</p>
          <p className="truncate text-xs text-slate-500">{user?.email || 'Không có email'}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <Icon size={18} className="text-slate-500" />
              {item.label}
            </Link>
          )
        })}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
      >
        <LogOut size={18} /> Đăng xuất
      </button>
    </div>
  )
})
