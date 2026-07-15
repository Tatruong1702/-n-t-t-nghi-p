import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-rose-100 text-rose-700',
}

function formatTimeRange(start, end) {
  try {
    return `${format(new Date(start), 'HH:mm')} - ${format(new Date(end), 'HH:mm')}`
  } catch {
    return `${start} - ${end}`
  }
}

export default React.memo(function BookingCard({ booking, onView, onAction }) {
  const courtName = booking.court?.name || booking.court?.court_name || 'Sân'
  const venueName = booking.venue?.name || booking.venue?.venue_name || 'Địa điểm'
  const status = booking.status || 'pending'

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>{status.toUpperCase()}</span>
            <span className="text-xs text-slate-500">#{booking.booking_code || booking.booking_id}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">{venueName}</h3>
            <p className="text-sm text-slate-500">{courtName}</p>
          </div>
        </div>
        <div className="space-y-2 text-right">
          <p className="text-sm text-slate-500">{new Date(booking.booking_date).toLocaleDateString('vi-VN')}</p>
          <p className="text-2xl font-semibold text-slate-950">{formatTimeRange(booking.start_time, booking.end_time)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold">Giá</p>
          <p className="mt-2 text-lg">{booking.total_price?.toLocaleString('vi-VN')}₫</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold">Người chơi</p>
          <p className="mt-2 text-lg">{booking.player_count || '—'}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold">Thanh toán</p>
          <p className="mt-2 text-lg">{booking.payment_status?.toUpperCase() || 'CHƯA'}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onView(booking)}
          className="rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Xem chi tiết
        </button>
        {status !== 'cancelled' && (
          <button
            type="button"
            onClick={() => onAction('cancel', booking)}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Hủy booking
          </button>
        )}
        {status === 'cancelled' && (
          <Link
            to={`/booking?venue_id=${booking.venue?.venue_id || booking.venue_id}`}
            className="rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Đặt lại
          </Link>
        )}
      </div>
    </div>
  )
})
