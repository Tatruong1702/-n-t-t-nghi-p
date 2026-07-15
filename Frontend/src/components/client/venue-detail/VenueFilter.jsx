import React from 'react'

export default function VenueFilter({ onChange }) {
  return (
    <div>
      <label>
        Search: <input onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  )
}
