import React, { useMemo } from 'react'
import formatDate from '../../../utils/formatDate'
import formatMoney from '../../../utils/formatMoney'

export default React.memo(function BookingHistory({ items = [] }) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date) || a.start_time.localeCompare(b.start_time)),
    [items],
  )

  if (!sortedItems.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
        <p className="text-lg font-semibold text-slate-900">Bạn chưa có lịch sử đặt sân</p>
        <p className="mt-2 text-sm leading-6">Mọi booking của bạn sẽ được hiển thị ở đây sau khi xác nhận.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[28px] bg-slate-950/95 p-5 text-slate-100 shadow-sm">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Lịch sử đặt sân</p>
        <p className="mt-2 text-sm text-slate-300">Xem lại các booking gần nhất và trạng thái thanh toán.</p>
      </div>
      <ul className="space-y-4">
        {sortedItems.map((booking) => (
          <li key={booking.booking_id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">{booking.Court?.court_name || 'Sân bóng'} · {booking.Court?.Venue?.venue_name || 'Địa điểm'}</p>
                <p className="mt-2 text-sm text-slate-600">{formatDate(booking.booking_date)} · {booking.start_time} - {booking.end_time}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {booking.status || 'pending'}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <p>Giá: {formatMoney(booking.total_price)}</p>
              <p>Thanh toán: {booking.Payment?.status || 'unpaid'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
})
