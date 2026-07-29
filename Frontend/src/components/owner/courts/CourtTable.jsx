import React from 'react'
import { Eye, PencilLine, Trash2, Copy } from 'lucide-react'
import DataTable from '../../common/DataTable'
import StatusBadge from '../../common/StatusBadge'

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

const CourtTable = React.memo(function CourtTable({ courts, selectedIds, onToggleSelect, onOpenDrawer, onEdit, onDelete, onCopy }) {
  const headers = ['Sân con', 'Sân chính', 'Loại sân', 'Giá/giờ', 'Trạng thái', 'Booking', 'Ngày tạo', 'Hành động']
  const rows = courts.map((court) => {
    const statusKey = court.status === 1 ? 'available' : court.status === 2 ? 'maintenance' : 'closed'
    return [
      <div key={`court-${court.court_id}`} className="flex items-center gap-3">
        <input type="checkbox" checked={selectedIds.includes(court.court_id)} onChange={() => onToggleSelect(court.court_id)} className="h-4 w-4 rounded border-slate-300" />
        <button onClick={() => onOpenDrawer(court)} className="flex items-center gap-3 text-left">
          <img src={court.image || '/placeholder.jpg'} alt={court.court_name} className="h-12 w-12 rounded-2xl object-cover" />
          <div>
            <div className="font-semibold text-slate-900">{court.court_name}</div>
            <div className="text-xs text-slate-500">{court.sport_type || '—'}</div>
          </div>
        </button>
      </div>,
      <span key={`venue-${court.court_id}`} className="text-sm text-slate-600">{court.Venue?.venue_name || '—'}</span>,
      <span key={`sport-${court.court_id}`} className="text-sm text-slate-600">{court.sport_type || '—'}</span>,
      <span key={`price-${court.court_id}`} className="text-sm font-semibold text-slate-900">{formatCurrency(court.price_per_hour || 0)}</span>,
      <StatusBadge key={`status-${court.court_id}`} label={statusText[statusKey]} tone={statusKey === 'available' ? 'success' : statusKey === 'maintenance' ? 'warning' : 'danger'} />,
      <span key={`bookings-${court.court_id}`} className="text-sm text-slate-600">{court.booking_count || 0}</span>,
      <span key={`date-${court.court_id}`} className="text-sm text-slate-600">{court.created_at ? new Date(court.created_at).toLocaleDateString('vi-VN') : '—'}</span>,
      <div key={`actions-${court.court_id}`} className="flex items-center gap-2">
        <button onClick={() => onOpenDrawer(court)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><Eye className="h-4 w-4" /></button>
        <button onClick={() => onEdit(court)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><PencilLine className="h-4 w-4" /></button>
        <button onClick={() => onDelete(court)} className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
        <button onClick={() => onCopy(court.image)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><Copy className="h-4 w-4" /></button>
      </div>,
    ]
  })

  return <DataTable headers={headers} rows={rows} />
})

export default CourtTable
