import React, { memo } from 'react'
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('vi-VN')
}

const RecentBookings = memo(function RecentBookings({ bookings }) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">Booking gần đây</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">10 booking mới nhất</h3>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600">
          Xem chi tiết <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Mã booking</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Khách hàng</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Sân</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Ngày</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Giờ</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Giá</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {bookings.map((booking) => (
                <tr key={booking.booking_id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">#{booking.booking_id}</td>
                  <td className="px-4 py-3 text-slate-600">{booking.user_name || booking.user?.full_name || booking.user?.username || 'Khách hàng'}</td>
                  <td className="px-4 py-3 text-slate-600">{booking.Court?.Venue?.venue_name || booking.court_name || '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(booking.booking_date)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock3 size={14} /> {booking.start_time} - {booking.end_time}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(booking.total_price)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : booking.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
})

export default RecentBookings
