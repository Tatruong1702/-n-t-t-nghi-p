import React from 'react'
import CourtCard from './CourtCard'

export default function CourtList({ courts = [] }) {
  if (!courts.length) return <p>No courts available.</p>

  return (
    <div>
      {courts.map((c) => (
        <CourtCard key={c.court_id || c.id} court={c} />
      ))}
    </div>
  )
}
