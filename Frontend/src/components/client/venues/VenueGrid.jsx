import React from 'react'
import VenueCard from './VenueCard'

export default function VenueGrid({ venues = [], viewType = 'grid', isLoading = false }) {
  if (viewType === 'list') {
    return (
      <div className="space-y-4">
        {venues.map((venue) => (
          <VenueCard key={venue.venue_id} venue={venue} viewType="list" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {venues.map((venue) => (
        <VenueCard key={venue.venue_id} venue={venue} viewType="grid" />
      ))}
    </div>
  )
}
