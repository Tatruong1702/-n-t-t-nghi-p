import React from 'react'
import { Link } from 'react-router-dom'
import formatMoney from '../../utils/formatMoney'

export default function CourtCard({ court }) {
  return (
    <div>
      <h4>{court?.court_name || 'Court'}</h4>
      <p>{court?.sport_type || 'Type'}</p>
      <p>Price per hour: {formatMoney(court?.price_per_hour)}</p>
      <Link to={`/booking?court_id=${court?.court_id}`}>Book court</Link>
    </div>
  )
}
