import React, { createContext, useState } from 'react'

export const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [bookingDetails, setBookingDetails] = useState({})

  return (
    <BookingContext.Provider value={{ selectedCourt, setSelectedCourt, bookingDetails, setBookingDetails }}>
      {children}
    </BookingContext.Provider>
  )
}
