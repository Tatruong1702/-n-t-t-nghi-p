import React from 'react'
import { X, UserRound, Building2, MapPin, CalendarDays, Clock3, CreditCard, BadgeCheck } from 'lucide-react'
import formatMoney from '../../../utils/formatMoney'
import formatDate from '../../../utils/formatDate'

const BookingDrawer = React.memo(function BookingDrawer({ isOpen, booking, onClose }) {
  if (!isOpen || !booking) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Booking detail</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">#{booking.booking_id}</h2>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <section className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{booking.customerName || `User ${booking.user_id}`}</p>
                <p className="text-sm text-slate-500">{booking.customerEmail || '—'}</p>
                <p className="text-sm text-slate-500">{booking.customerPhone || '—'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Building2 className="h-4 w-4" /> Thông tin sân
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Sân chính</span><span className="font-semibold text-slate-900">{booking.venueName}</span></div>
              <div className="flex items-center justify-between"><span>Sân con</span><span className="font-semibold text-slate-900">{booking.courtName}</span></div>
              <div className="flex items-center justify-between"><span>Địa chỉ</span><span className="max-w-[220px] text-right font-semibold text-slate-900">{booking.address || '—'}</span></div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <CalendarDays className="h-4 w-4" /> Thông tin đặt sân
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Ngày</span><span className="font-semibold text-slate-900">{formatDate(booking.booking_date)}</span></div>
              <div className="flex items-center justify-between"><span>Giờ bắt đầu</span><span className="font-semibold text-slate-900">{booking.start_time}</span></div>
              <div className="flex items-center justify-between"><span>Giờ kết thúc</span><span className="font-semibold text-slate-900">{booking.end_time}</span></div>
              <div className="flex items-center justify-between"><span>Tổng giờ</span><span className="font-semibold text-slate-900">{booking.durationHours || '—'}</span></div>
              <div className="flex items-center justify-between"><span>Tổng tiền</span><span className="font-semibold text-slate-900">{formatMoney(booking.total_price)}</span></div>
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <CreditCard className="h-4 w-4" /> Thông tin thanh toán
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Phương thức</span><span className="font-semibold text-slate-900">{booking.paymentMethod || '—'}</span></div>
              <div className="flex items-center justify-between"><span>Trạng thái</span><span className="font-semibold text-slate-900">{booking.paymentStatus || 'unpaid'}</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
})

export default BookingDrawer
