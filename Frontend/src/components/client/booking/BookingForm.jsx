import React, { useEffect, useState } from 'react'

export default function BookingForm({ courts = [], courtId, onCourtChange, onSubmit, onDateChange, bookingDate }) {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    if (!courtId && courts.length) {
      onCourtChange(courts[0].court_id)
    }
  }, [courts, courtId, onCourtChange])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ court_id: courtId, booking_date: bookingDate, start_time: startTime, end_time: endTime })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Court
          <select
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            value={courtId}
            onChange={(e) => onCourtChange(e.target.value)}
          >
            {courts.map((court) => (
              <option key={court.court_id} value={court.court_id}>
                {court.court_name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Date
          <input
            type="date"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            value={bookingDate}
            onChange={(e) => onDateChange(e.target.value)}
            required
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Start time
          <input
            type="time"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          End time
          <input
            type="time"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full rounded-3xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Book court
      </button>
    </form>
  )
}
