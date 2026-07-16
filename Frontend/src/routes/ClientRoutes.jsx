import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ClientLayout from '../layouts/ClientLayout'
import Home from '../pages/client/Home'
import Venues from '../pages/client/Venues'
import VenueDetail from '../pages/client/VenueDetail'
import Booking from '../pages/client/Booking'
import Profile from '../pages/client/Profile'
import MyBookings from '../pages/client/MyBookings'

export default function ClientRoutes() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="venues" element={<Venues />} />
        <Route path="venue/:id" element={<VenueDetail />} />
        <Route path="booking" element={<Booking />} />
        <Route path="profile" element={<Profile />} />
        <Route path="my-bookings" element={<MyBookings />} />
      </Routes>
    </ClientLayout>
  )
}
