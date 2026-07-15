import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import formatMoney from '../../../utils/formatMoney'

const TAX_RATE = 0.1
const SERVICE_FEE = 15000

export default React.memo(function BookingSummary({ venue, court, bookingDate, startTime, endTime, promoCode, onPromoChange, paymentMethod, onPaymentChange, isSubmitting, onSubmit }) {
  const hours = useMemo(() => {
    if (!startTime || !endTime) return 0
    const [startH] = startTime.split(':').map(Number)
    const [endH] = endTime.split(':').map(Number)
    return Math.max(0, endH - startH)
  }, [startTime, endTime])

  const basePrice = useMemo(() => (court?.price_per_hour ? Number(court.price_per_hour) * hours : 0), [court, hours])
  const fee = useMemo(() => (hours ? SERVICE_FEE : 0), [hours])
  const discount = useMemo(() => {
    if (!promoCode?.trim()) return 0
    return Math.min(0.15 * basePrice, 50000)
  }, [basePrice, promoCode])
  const tax = useMemo(() => (basePrice + fee - discount) * TAX_RATE, [basePrice, fee, discount])
  const total = useMemo(() => basePrice + fee - discount + tax, [basePrice, fee, discount, tax])

  return (
    <motion.aside
      layout
      className="sticky top-6 rounded-[32px] border border-slate-200 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/10 text-slate-100"
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Booking Summary</p>
          <h2 className="mt-2 text-2xl font-semibold">Thanh toán nhanh</h2>
        </div>

        <div className="space-y-3 rounded-[28px] bg-slate-900/80 p-5">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Sân</span>
            <span>{venue?.venue_name || 'Chưa chọn'}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Sân con</span>
            <span>{court?.court_name || 'Chưa chọn'}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Ngày</span>
            <span>{bookingDate || 'Chưa chọn'}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Giờ</span>
            <span>{startTime && endTime ? `${startTime} - ${endTime}` : 'Chưa chọn'}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Số giờ</span>
            <span>{hours}</span>
          </div>
        </div>

        <div className="rounded-[28px] bg-slate-900/80 p-5 text-sm text-slate-300">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Tiền sân</span>
              <span>{formatMoney(basePrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phụ phí</span>
              <span>{formatMoney(fee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Giảm giá</span>
              <span>-{formatMoney(discount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>VAT {TAX_RATE * 100}%</span>
              <span>{formatMoney(tax)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-emerald-500/10 p-5 text-slate-100">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.24em] text-emerald-100">Tổng</div>
          <p className="mt-2 text-3xl font-semibold text-white">{formatMoney(total)}</p>
        </div>

        <div className="space-y-4 rounded-[28px] bg-slate-900/80 p-5">
          <label className="block text-sm font-semibold text-slate-100">Mã giảm giá</label>
          <input
            value={promoCode}
            onChange={(event) => onPromoChange(event.target.value)}
            placeholder="Nhập coupon"
            className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400"
          />

          <div>
            <p className="text-sm font-semibold text-slate-100">Phương thức thanh toán</p>
            <div className="mt-3 grid gap-3">
              {['cash', 'bank', 'vnpay'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => onPaymentChange(method)}
                  className={`w-full rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                    paymentMethod === method
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-200'
                      : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {method === 'cash' ? 'Thanh toán tại sân' : method === 'bank' ? 'Chuyển khoản' : 'VNPay'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!bookingDate || !startTime || !endTime || !court || !venue || isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {isSubmitting ? 'Đang đặt sân...' : 'Xác nhận đặt sân'}
          </button>
        </div>
      </div>
    </motion.aside>
  )
})
