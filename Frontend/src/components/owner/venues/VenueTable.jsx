import React from 'react'
import { Eye, PencilLine, Trash2, Copy, ChevronRight } from 'lucide-react'
import DataTable from '../../common/DataTable'
import StatusBadge from '../../common/StatusBadge'

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const VenueTable = React.memo(function VenueTable({ venues, selectedIds, onToggleSelect, onOpenDrawer, onEdit, onDelete, onCopyAddress }) {
  const headers = ['Sân', 'Địa chỉ', 'Chủ sân', 'Sân con', 'Booking', 'Doanh thu', 'Trạng thái', 'Hành động']
  const rows = venues.map((venue) => {
    const isSelected = selectedIds.includes(venue.venue_id)
    return [
      <div key={`name-${venue.venue_id}`} className="flex items-center gap-3">
        <input type="checkbox" checked={isSelected} onChange={() => onToggleSelect(venue.venue_id)} className="h-4 w-4 rounded border-slate-300" />
        <button onClick={() => onOpenDrawer(venue)} className="flex items-center gap-3 text-left">
          <img src={venue.image || '/placeholder.jpg'} alt={venue.venue_name} className="h-12 w-12 rounded-2xl object-cover" />
          <div>
            <div className="font-semibold text-slate-900">{venue.venue_name}</div>
            <div className="text-xs text-slate-500">{venue.city || 'Chưa có thành phố'}</div>
          </div>
        </button>
      </div>,
      <div key={`address-${venue.venue_id}`} className="max-w-xs">
        <div className="text-sm text-slate-600">{venue.address}</div>
        <button onClick={() => onCopyAddress(venue.address)} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-cyan-600">
          <Copy className="h-3.5 w-3.5" /> Sao chép
        </button>
      </div>,
      <span key={`owner-${venue.venue_id}`} className="text-sm text-slate-600">{venue.owner_name || '—'}</span>,
      <span key={`courts-${venue.venue_id}`} className="text-sm text-slate-600">{venue.courts_count || 0}</span>,
      <span key={`bookings-${venue.venue_id}`} className="text-sm text-slate-600">{venue.booking_count || 0}</span>,
      <span key={`revenue-${venue.venue_id}`} className="text-sm font-medium text-slate-900">{formatCurrency(venue.revenue || 0)}</span>,
      <StatusBadge key={`status-${venue.venue_id}`} label={venue.status === 1 ? 'Đang hoạt động' : 'Tạm ngưng'} tone={venue.status === 1 ? 'success' : 'warning'} />,
      <div key={`actions-${venue.venue_id}`} className="flex items-center gap-2">
        <button onClick={() => onOpenDrawer(venue)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><Eye className="h-4 w-4" /></button>
        <button onClick={() => onEdit(venue)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><PencilLine className="h-4 w-4" /></button>
        <button onClick={() => onDelete(venue)} className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
        <button onClick={() => onOpenDrawer(venue)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><ChevronRight className="h-4 w-4" /></button>
      </div>,
    ]
  })

  return <DataTable headers={headers} rows={rows} />
})

export default VenueTable
