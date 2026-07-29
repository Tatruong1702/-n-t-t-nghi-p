import React from 'react'
import { Eye, CheckCircle2, XCircle, CircleDashed, Copy } from 'lucide-react'
import DataTable from '../../common/DataTable'
import StatusBadge from '../../common/StatusBadge'
import formatMoney from '../../../utils/formatMoney'
import formatDate from '../../../utils/formatDate'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  completed: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  cancelled: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
}

const paymentStyles = {
  paid: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  unpaid: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  refunded: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
}

const BookingTable = React.memo(function BookingTable({ bookings, selectedIds, onToggleSelect, onOpenDrawer, onStatusChange, onCopy }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/80 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            <tr>
              <th className="px-4 py-4">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
              </th>
              <th className="px-4 py-4">Booking</th>
              <th className="px-4 py-4">Khách</th>
              <th className="px-4 py-4">Sân</th>
              <th className="px-4 py-4">Ngày</th>
              <th className="px-4 py-4">Giờ</th>
              <th className="px-4 py-4">Tổng tiền</th>
              <th className="px-4 py-4">Thanh toán</th>
              <th className="px-4 py-4">Booking</th>
              <th className="px-4 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/60">
            {bookings.map((booking) => (
              <tr key={booking.booking_id} className="transition hover:bg-slate-50/70">
                <td className="px-4 py-4">
                  <input checked={selectedIds.includes(booking.booking_id)} onChange={() => onToggleSelect(booking.booking_id)} type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">#{booking.booking_id}</div>
                  <div className="mt-1 text-xs text-slate-500">{booking.booking_date}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">{booking.customerName || `User ${booking.user_id}`}</div>
                  <div className="mt-1 text-xs text-slate-500">{booking.customerEmail || '—'}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">{booking.courtName}</div>
                  <div className="mt-1 text-xs text-slate-500">{booking.venueName}</div>
                </td>
                <td className="px-4 py-4">{formatDate(booking.booking_date)}</td>
                <td className="px-4 py-4">{booking.start_time} - {booking.end_time}</td>
                <td className="px-4 py-4 font-semibold text-slate-900">{formatMoney(booking.total_price)}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStyles[booking.paymentStatus] || paymentStyles.unpaid}`}>{booking.paymentStatus || 'unpaid'}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status] || statusStyles.pending}`}>{booking.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onOpenDrawer(booking)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => onCopy(booking.booking_id)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
                      <Copy className="h-4 w-4" />
                    </button>
                    {booking.status !== 'confirmed' && (
                      <button onClick={() => onStatusChange(booking, 'confirmed')} className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-emerald-700 transition hover:bg-emerald-100">
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button onClick={() => onStatusChange(booking, 'cancelled')} className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-700 transition hover:bg-rose-100">
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                    {booking.status !== 'completed' && (
                      <button onClick={() => onStatusChange(booking, 'completed')} className="rounded-xl border border-violet-200 bg-violet-50 p-2 text-violet-700 transition hover:bg-violet-100">
                        <CircleDashed className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

export default BookingTable
