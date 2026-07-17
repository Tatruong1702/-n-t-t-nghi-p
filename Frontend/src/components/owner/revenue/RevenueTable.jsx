import React from 'react'
import { CircleDollarSign } from 'lucide-react'
import formatMoney from '../../../utils/formatMoney'
import DataTable from '../../common/DataTable'
import StatusBadge from '../../common/StatusBadge'

const RevenueTable = React.memo(function RevenueTable({ bookings }) {
  const headers = ['Booking', 'Khách hàng', 'Sân', 'Ngày', 'Tổng', 'Trạng thái']
  const rows = bookings.map((booking) => [
    <span key={`booking-${booking.booking_id}`} className="text-sm font-semibold text-slate-900">#{booking.booking_id}</span>,
    <span key={`customer-${booking.booking_id}`} className="text-sm text-slate-600">{booking.customerName || `User ${booking.user_id}`}</span>,
    <span key={`venue-${booking.booking_id}`} className="text-sm text-slate-600">{booking.venueName} · {booking.courtName}</span>,
    <span key={`date-${booking.booking_id}`} className="text-sm text-slate-600">{booking.booking_date}</span>,
    <span key={`amount-${booking.booking_id}`} className="text-sm font-semibold text-slate-900">{formatMoney(booking.total_price)}</span>,
    <StatusBadge key={`status-${booking.booking_id}`} label={booking.status} tone={booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'} />,
  ])

  return (
    <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-2 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-lg font-semibold text-slate-950">Lịch sử doanh thu</p>
          <p className="text-sm text-slate-500">Các booking có giá trị thanh toán gần đây</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
          {bookings.length} mục
        </div>
      </div>
      <DataTable headers={headers} rows={rows} />
    </div>
  )
})

export default RevenueTable
