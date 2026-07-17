import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { vi },
})

const BookingCalendar = React.memo(function BookingCalendar({ bookings, onSelectBooking }) {
  const events = bookings.map((booking) => ({
    id: booking.booking_id,
    title: `${booking.courtName || 'Sân'} · ${booking.customerName || `User ${booking.user_id}`}`,
    start: new Date(`${booking.booking_date}T${booking.start_time}`),
    end: new Date(`${booking.booking_date}T${booking.end_time}`),
    booking,
  }))

  return (
    <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-3 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-5">
      <Calendar
        localizer={localizer}
        culture="vi"
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 620 }}
        onSelectEvent={(event) => onSelectBooking(event.booking)}
        views={['month', 'week', 'day']}
        defaultView="month"
        popup
        tooltip
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.booking?.status === 'cancelled' ? '#ef4444' : event.booking?.status === 'confirmed' ? '#22c55e' : event.booking?.status === 'completed' ? '#8b5cf6' : '#f59e0b',
            color: 'white',
            borderRadius: '12px',
            border: 'none',
            padding: '2px 6px',
          },
        })}
      />
    </div>
  )
})

export default BookingCalendar
