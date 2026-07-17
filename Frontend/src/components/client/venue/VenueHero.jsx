import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import getImageUrl from '../../../utils/getImageUrl'
import ShareButton from './ShareButton'
import FavoriteButton from './FavoriteButton'

const placeholderImage =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80'

const VenueHero = React.memo(({ venue, courts, reviews }) => {
  const heroImage = useMemo(
    () => getImageUrl(venue?.image) || placeholderImage,
    [venue?.image]
  )

  const averageRating = useMemo(() => {
    if (!reviews?.length) return null
    const total = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0)
    return (total / reviews.length).toFixed(1)
  }, [reviews])

  const stats = [
    { label: 'Sân con', value: courts?.length || 0 },
    { label: 'Đánh giá', value: reviews?.length || 0 },
    { label: 'Rating', value: averageRating ? `${averageRating}⭐` : 'N/A' },
  ]

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden rounded-[28px] bg-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
      <img
        src={heroImage}
        alt={venue?.venue_name}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Chi tiết sân bóng</p>
              <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                {venue?.venue_name}
              </h1>
              <p className="mt-2 text-white/80 flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {venue?.address}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-white"
                >
                  <p className="text-xs uppercase tracking-widest text-white/70">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                to={`/booking?venue_id=${venue?.venue_id}`}
                className="inline-flex rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
              >
                Đặt sân ngay
              </Link>
              <ShareButton venueId={venue?.venue_id} venueName={venue?.venue_name} />
              <FavoriteButton venueId={venue?.venue_id} venueName={venue?.venue_name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

VenueHero.displayName = 'VenueHero'

export default VenueHero
