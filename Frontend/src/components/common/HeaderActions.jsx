import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Heart, CalendarDays, Search } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

const actionItems = [
  { to: '/favorites', icon: Heart, label: 'Yêu thích' },
  { to: '/notifications', icon: Bell, label: 'Thông báo' },
  { to: '/my-bookings', icon: CalendarDays, label: 'Booking' },
]

export default React.memo(function HeaderActions({ onAction }) {
  const { user } = useAuth()
  const displayName = useMemo(() => user?.full_name || user?.username || 'Tài khoản', [user])

  return (
    <div className="flex items-center gap-3">
      <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
        <Search size={18} />
      </button>
      {actionItems.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.to} to={item.to} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            <Icon size={18} />
          </Link>
        )
      })}
      <button type="button" onClick={onAction} className="hidden lg:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
        <span>{displayName}</span>
      </button>
    </div>
  )
})
