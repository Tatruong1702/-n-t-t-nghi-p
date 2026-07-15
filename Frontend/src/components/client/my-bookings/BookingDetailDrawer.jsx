import React from 'react'
import { format } from 'date-fns'
import BookingTimeline from './BookingTimeline'

function formatDateTime(value) {
  if (!value) return '—'
  try {
    return format(new Date(value), 'dd/MM/yyyy HH:mm')
  } catch {
    return value
  }
}

const row = (label, value) => (
  <div className="flex justify-between gap-4 border-b border-slate-200/70 py-4 text-sm text-slate-700 last:border-b-0">
    <span className="font-medium text-slate-900">{label}</span>
    <span className="text-right text-slate-600">{value}</span>
  </div>
)

export default React.memo(function BookingDetailDrawer({ booking, open, onClose }) {
  if (!booking) return null

  return (
    <div className={`${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-0 z-50 flex`}>
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" />
      <div className={`relative ml-auto h-full w-full max-w-3xl overflow-y-auto bg-white p-8 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Booking của tôi</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">Chi tiết đặt sân</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200">
            Đóng
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            {row('Mã booking', booking.booking_code || booking.booking_id)}
            {row('Sân đấu', booking.court?.name || booking.court?.court_name || 'Không xác định')}
            {row('Địa điểm', booking.venue?.name || booking.venue?.venue_name || 'Không xác định')}
            {row('Ngày', new Date(booking.booking_date).toLocaleDateString('vi-VN'))}
            {row('Giờ', `${booking.start_time || '—'} - ${booking.end_time || '—'}`)}
            {row('Số lượng người', booking.player_count || '—')}
            {row('Trạng thái', booking.status?.toUpperCase() || 'PENDING')}
            {row('Thanh toán', booking.payment_status?.toUpperCase() || 'CHƯA')}
            {row('Tổng giá', `${booking.total_price?.toLocaleString('vi-VN') || 0}₫`)}
            {row('Created at', formatDateTime(booking.created_at || booking.createdAt))}
            {row('Updated at', formatDateTime(booking.updated_at || booking.updatedAt))}
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Thông tin thanh toán</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {row('Phương thức', booking.payment_method || 'Chưa cung cấp')}
                {row('Trạng thái', booking.payment_status?.toUpperCase() || 'CHƯA')}
                {row('Invoice', booking.invoice_url ? <a href={booking.invoice_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Xem hóa đơn</a> : 'Chưa có')}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Ghi chú khách hàng</h3>
              <p className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{booking.notes || 'Không có ghi chú.'}</p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tiến trình booking</h3>
              <div className="mt-5">
                <BookingTimeline status={booking.status || 'pending'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
