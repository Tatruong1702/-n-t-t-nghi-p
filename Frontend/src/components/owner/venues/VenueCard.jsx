import React from 'react'
import { Eye, PencilLine, Trash2, Copy, MapPin, Sparkles } from 'lucide-react'

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const VenueCard = React.memo(function VenueCard({ venue, onOpenDrawer, onEdit, onDelete, onCopyAddress }) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/80 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.2)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_26px_70px_-24px_rgba(15,23,42,0.28)]">
      <div className="relative h-44">
        <img src={venue.image || '/placeholder.jpg'} alt={venue.venue_name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur">
          {venue.status === 1 ? 'Đang hoạt động' : 'Tạm ngưng'}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{venue.venue_name}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-2">{venue.address}</span>
            </div>
          </div>
          <button onClick={() => onCopyAddress(venue.address)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="text-slate-500">Booking</div>
            <div className="mt-1 font-semibold text-slate-900">{venue.booking_count || 0}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="text-slate-500">Doanh thu</div>
            <div className="mt-1 font-semibold text-slate-900">{formatCurrency(venue.revenue || 0)}</div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-600">
            <Sparkles className="h-4 w-4" />
            {venue.courts_count || 0} sân con
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onOpenDrawer(venue)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><Eye className="h-4 w-4" /></button>
            <button onClick={() => onEdit(venue)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><PencilLine className="h-4 w-4" /></button>
            <button onClick={() => onDelete(venue)} className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
})

export default VenueCard
