import React from 'react'
import VenueCard from './VenueCard'

export default function VenueList({ venues = [] }) {
  if (!venues.length)
    return <p className="py-12 text-center text-base text-slate-600">Không tìm thấy sân nào.</p>

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard key={venue.venue_id || venue.id} venue={venue} />
      ))}
    </div>
  )
}
