import React from 'react'
import { Eye, PencilLine, Trash2, Copy, Sparkles } from 'lucide-react'

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

const CourtCard = React.memo(function CourtCard({ court, onOpenDrawer, onEdit, onDelete, onCopy }) {
  const statusKey = court.status === 1 ? 'available' : court.status === 2 ? 'maintenance' : 'closed'
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/80 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.2)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_24px_70px_-24px_rgba(15,23,42,0.28)]">
      <div className="relative h-44">
        <img src={court.image || '/placeholder.jpg'} alt={court.court_name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[statusKey]}`}>
          {statusText[statusKey]}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{court.court_name}</h3>
            <p className="mt-1 text-sm text-slate-500">{court.Venue?.venue_name || '—'}</p>
          </div>
          <button onClick={() => onCopy(court.image)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><Copy className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="text-slate-500">Loại sân</div>
            <div className="mt-1 font-semibold text-slate-900">{court.sport_type || '—'}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="text-slate-500">Giá/giờ</div>
            <div className="mt-1 font-semibold text-slate-900">{formatCurrency(court.price_per_hour || 0)}</div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-600">
            <Sparkles className="h-4 w-4" /> {court.booking_count || 0} booking
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onOpenDrawer(court)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><Eye className="h-4 w-4" /></button>
            <button onClick={() => onEdit(court)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><PencilLine className="h-4 w-4" /></button>
            <button onClick={() => onDelete(court)} className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CourtCard
