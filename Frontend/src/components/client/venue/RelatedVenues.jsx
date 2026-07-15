import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import formatMoney from '../../../utils/formatMoney'
import getImageUrl from '../../../utils/getImageUrl'

const placeholderImage =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=500&q=80'

const RelatedVenues = React.memo(({ venues = [], currentVenueCity, currentVenueId }) => {
  const relatedVenues = useMemo(() => {
    return venues
      .filter(
        (v) => v.city === currentVenueCity && v.venue_id !== currentVenueId
      )
      .slice(0, 4)
  }, [venues, currentVenueCity, currentVenueId])

  if (!relatedVenues.length) return null

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm border border-slate-200">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">
          Sân liên quan
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">
          Khám phá thêm sân khác
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedVenues.map((venue) => (
          <Link
            key={venue.venue_id}
            to={`/venue/${venue.venue_id}`}
            className="group overflow-hidden rounded-[20px] bg-slate-100 shadow-md hover:shadow-lg transition"
          >
            <div className="relative h-40 overflow-hidden bg-slate-200">
              <img
                src={getImageUrl(venue.image) || placeholderImage}
                alt={venue.venue_name}
                className="h-full w-full object-cover transition group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-slate-900 line-clamp-1">
                {venue.venue_name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-1">{venue.city}</p>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">
                    {formatMoney(venue.min_price)}/h
                  </span>
                  {venue.booking_count > 0 && (
                    <span className="text-xs text-slate-600">
                      {venue.booking_count} booking
                    </span>
                  )}
                </div>

                {venue.courts_count > 0 && (
                  <p className="text-xs text-slate-600">
                    {venue.courts_count} sân con
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
})

RelatedVenues.displayName = 'RelatedVenues'

export default RelatedVenues
