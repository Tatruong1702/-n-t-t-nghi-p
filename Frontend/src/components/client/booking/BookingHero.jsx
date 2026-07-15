import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import getImageUrl from '../../../utils/getImageUrl'
import formatMoney from '../../../utils/formatMoney'

export default function BookingHero({ venue, selectedCourt, averageRating = 0, onViewVenue, onDirections }) {
  const imageUrl = getImageUrl(venue?.image)
  const priceFrom = selectedCourt?.price_per_hour || venue?.min_price || 0
  const ratingLabel = averageRating ? averageRating.toFixed(1) : 'N/A'

  const heroSubtitle = useMemo(() => {
    if (!venue) return ''
    return `${venue.address || ''}${venue.city ? ', ' + venue.city : ''}`.trim()
  }, [venue])

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr] items-center">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-900/5">
            <img src={imageUrl} alt={venue?.venue_name || 'Venue image'} className="h-72 w-full object-cover transition duration-500 hover:scale-105" />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Đặt sân</p>
            <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">{venue?.venue_name || 'Venue booking'}</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">{heroSubtitle || 'Chọn sân, ngày và giờ để đặt sân bóng yêu thích của bạn.'}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Rating</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{ratingLabel} / 5</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Tổng lượt đặt</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{venue?.booking_count || 0}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Giá từ</p>
              <p className="mt-2 text-xl font-semibold text-emerald-600">{formatMoney(priceFrom)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-950/95 p-6 text-slate-100 shadow-lg shadow-slate-950/10">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Tìm đến sân</p>
            <h2 className="text-xl font-semibold">Bắt đầu hành trình của bạn</h2>
            <p className="text-sm leading-6 text-slate-300">Xem chi tiết sân và nhanh chóng điều hướng đến địa điểm.</p>
          </div>

          <div className="grid gap-3">
            <button
              type="button"
              onClick={onViewVenue}
              className="rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Xem sân
            </button>
            <button
              type="button"
              onClick={onDirections}
              className="rounded-3xl border border-emerald-500 bg-slate-950/0 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
            >
              Chỉ đường
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
