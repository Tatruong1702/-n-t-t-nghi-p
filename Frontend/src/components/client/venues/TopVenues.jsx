import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Star, Flame, Clock } from 'lucide-react'
import VenueCard from './VenueCard'
import getImageUrl from '../../../utils/getImageUrl'

const placeholderImage = 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80'

export default function TopVenues({ venues = [] }) {
  const topByBookings = useMemo(() => {
    return [...venues]
      .sort((a, b) => (b.booking_count || 0) - (a.booking_count || 0))
      .slice(0, 4)
  }, [venues])

  const topByRating = useMemo(() => {
    return [...venues]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4)
  }, [venues])

  const topNewest = useMemo(() => {
    return [...venues]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4)
  }, [venues])

  if (venues.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="space-y-12">
        {/* Top by Bookings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Flame size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Sân được đặt nhiều nhất</h2>
                <p className="text-sm text-slate-600">Những sân được yêu thích bởi khách hàng</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topByBookings.map((venue) => (
              <VenueCard key={venue.venue_id} venue={venue} viewType="grid" />
            ))}
          </div>
        </div>

        {/* Top by Rating */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <Star size={20} className="fill-yellow-500 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Sân rating cao nhất</h2>
                <p className="text-sm text-slate-600">Các sân được đánh giá tốt nhất</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topByRating.map((venue) => (
              <VenueCard key={venue.venue_id} venue={venue} viewType="grid" />
            ))}
          </div>
        </div>

        {/* Top Newest */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                <Clock size={20} className="text-cyan-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Sân mới nhất</h2>
                <p className="text-sm text-slate-600">Các sân được thêm gần đây</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topNewest.map((venue) => (
              <VenueCard key={venue.venue_id} venue={venue} viewType="grid" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
