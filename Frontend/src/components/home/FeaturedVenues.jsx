import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ArrowRight, Heart } from 'lucide-react'

export default function FeaturedVenues({ venues = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Sân nổi bật</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Top sân đặt nhiều nhất</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          Xem tất cả
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {venues.map((venue, index) => {
          const venuePrice = Number(venue.price || 0)
          const venueRating = venue.avgRating || Number(venue.rating) || 4.5
          const venueBookings = venue.booking_count || venue.bookings || 0
          return (
            <motion.article
              key={venue.venue_id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="group overflow-hidden rounded-[32px] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
            >
              <div className="relative overflow-hidden">
                <img src={venue.image || ''} alt={venue.name || venue.venue_name} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className={`absolute left-4 top-4 rounded-full border border-white/50 bg-white/80 px-4 py-2 text-xs font-semibold ${venue.badge === 'HOT' ? 'text-rose-600' : venue.badge === 'Mới' ? 'text-sky-600' : 'text-emerald-600'}`}>
                  {venue.badge || 'Đề cử'}
                </span>
                <button className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-lg shadow-slate-950/10 transition group-hover:scale-105">
                  <Heart size={18} />
                </button>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{venue.name || venue.venue_name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{venue.location || venue.city || venue.address || 'Chưa rõ địa điểm'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/5 px-3 py-1 text-sm font-semibold text-slate-900">{venuePrice.toLocaleString()}₫/giờ</div>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2 text-emerald-600">
                    <Star size={16} /> {venueRating}
                  </span>
                  <span>{venueBookings}+ đặt</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link to={`/venue/${venue.venue_id}`} className="rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 text-center">
                    Xem chi tiết
                  </Link>
                  <Link to={`/booking?venue_id=${venue.venue_id}`} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50 text-center">
                    Đặt sân
                  </Link>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
