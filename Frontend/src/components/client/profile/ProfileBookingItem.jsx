import React from 'react'
import { ChevronRight } from 'lucide-react'
import formatDate from '../../../utils/formatDate'
import formatMoney from '../../../utils/formatMoney'

export default React.memo(function ProfileBookingItem({ booking }) {
  const venueName = booking.venue?.venue_name || booking.Court?.Venue?.venue_name || 'Sân bóng'
  const courtName = booking.court?.name || booking.court?.court_name || booking.Court?.court_name || 'Sân'

  return (
    <div className="group flex items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white/95 px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-semibold text-slate-950">{venueName}</p>
        <p className="truncate text-sm text-slate-500">{courtName}</p>
        <p className="text-sm text-slate-500">{formatDate(booking.booking_date)} · {booking.start_time} - {booking.end_time}</p>
      </div>
      <div className="flex flex-col items-end gap-2 text-right">
        <p className="text-sm font-semibold text-slate-950">{formatMoney(booking.total_price)}</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">{booking.status || 'pending'}</span>
      </div>
      <ChevronRight size={20} className="text-slate-400 transition group-hover:text-slate-600" />
    </div>
  )
})
