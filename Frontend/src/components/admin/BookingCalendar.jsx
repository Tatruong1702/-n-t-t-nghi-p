import React, { useMemo } from 'react'

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
}

const hours = Array.from({ length: 12 }, (_, idx) => 8 + idx)

function formatHour(hour) {
  return `${hour.toString().padStart(2, '0')}:00`
}

export default function BookingCalendar({ bookings, loading }) {
  const weekDates = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(today)
      date.setDate(today.getDate() + idx)
      return date
    })
  }, [])

  const calendarMap = useMemo(() => {
    const map = {}
    bookings.forEach((booking) => {
      const date = booking.booking_date
      const hour = Number(booking.start_time?.split(':')[0])
      if (!date || Number.isNaN(hour)) return
      const key = `${date}-${hour}`
      map[key] = map[key] || []
      map[key].push(booking)
    })
    return map
  }, [bookings])

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Calendar View</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Lịch đặt sân theo giờ</h2>
        </div>
        <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-600">
          {bookings.length} booking được lọc
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-[4rem_repeat(7,minmax(12rem,1fr))] gap-px bg-slate-200 text-xs uppercase text-slate-500">
            <div className="bg-white px-3 py-3">Giờ</div>
            {weekDates.map((date) => (
              <div key={date.toISOString()} className="bg-white px-3 py-3">
                <div className="font-semibold text-slate-900">{date.toLocaleDateString('vi-VN', { weekday: 'short' })}</div>
                <div className="text-slate-500">{date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[4rem_repeat(7,minmax(12rem,1fr))] gap-px">
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <div className="bg-slate-50 px-3 py-4 text-xs text-slate-500">{formatHour(hour)}</div>
                {weekDates.map((date) => {
                  const dateKey = date.toISOString().slice(0, 10)
                  const cellKey = `${dateKey}-${hour}`
                  const items = calendarMap[cellKey] || []
                  return (
                    <div key={cellKey} className="min-h-[5rem] bg-white p-2">
                      {loading ? (
                        <div className="h-12 animate-pulse rounded-2xl bg-slate-200" />
                      ) : items.length > 0 ? (
                        items.map((booking) => (
                          <div key={booking.booking_id} className={`mb-2 rounded-3xl border px-3 py-2 text-[11px] font-semibold ${statusColors[booking.status] || 'bg-slate-100 text-slate-700'}`}>
                            <div>{booking.court_name || booking.Court?.court_name || 'Sân'}</div>
                            <div className="mt-1 text-slate-500">#{booking.booking_id}</div>
                          </div>
                        ))
                      ) : (
                        <div className="h-12 rounded-3xl bg-slate-50" />
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">● Chờ xác nhận</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">● Đã xác nhận</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">● Hoàn thành</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 font-semibold text-rose-700">● Đã hủy</span>
      </div>
    </div>
  )
}
