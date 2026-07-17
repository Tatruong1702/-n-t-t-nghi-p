import React from 'react'
import { X, CalendarRange, CircleDollarSign, Sparkles, Layers3 } from 'lucide-react'

const statusStyles = {
  available: 'bg-emerald-50 text-emerald-700',
  maintenance: 'bg-amber-50 text-amber-700',
  closed: 'bg-rose-50 text-rose-700',
}

const statusText = {
  available: 'Available',
  maintenance: 'Maintenance',
  closed: 'Closed',
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const CourtDrawer = React.memo(function CourtDrawer({ isOpen, court, onClose }) {
  if (!isOpen || !court) return null

  const statusKey = court.status === 1 ? 'available' : court.status === 2 ? 'maintenance' : 'closed'

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white/95 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
              <Sparkles className="h-4 w-4" /> Chi tiết sân con
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">{court.court_name}</h3>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><X className="h-5 w-5" /></button>
        </div>

        <img src={court.image || '/placeholder.jpg'} alt={court.court_name} className="mt-6 h-56 w-full rounded-[24px] object-cover" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500"><Layers3 className="h-4 w-4" /> Sân chính</div>
            <p className="mt-2 text-sm font-medium text-slate-900">{court.Venue?.venue_name || '—'}</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500"><CalendarRange className="h-4 w-4" /> Booking</div>
            <p className="mt-2 text-sm font-medium text-slate-900">{court.booking_count || 0} lượt</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500"><CircleDollarSign className="h-4 w-4" /> Giá/giờ</div>
            <p className="mt-2 text-sm font-medium text-slate-900">{formatCurrency(court.price_per_hour || 0)}</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-500"><Sparkles className="h-4 w-4" /> Trạng thái</div>
            <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[statusKey]}`}>{statusText[statusKey]}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <h4 className="text-lg font-semibold text-slate-900">Mô tả</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">{court.description || 'Chưa có mô tả'}</p>
        </div>
      </div>
    </div>
  )
})

export default CourtDrawer
