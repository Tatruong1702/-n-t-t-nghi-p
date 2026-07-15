import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const createTimeOptions = () => {
  return Array.from({ length: 17 }, (_, index) => {
    const hour = 6 + index
    const value = `${hour.toString().padStart(2, '0')}:00`
    return value
  })
}

const timeOptions = createTimeOptions()

function isOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA
}

function timeToNumber(time = '00:00') {
  const [hours, minutes] = time.split(':').map(Number)
  return hours + minutes / 60
}

export default React.memo(function TimeSelector({ selectedDate, startTime, endTime, onStartChange, onEndChange, bookings = [] }) {
  const blockedIntervals = useMemo(
    () =>
      bookings.map((booking) => ({
        start: timeToNumber(booking.start_time),
        end: timeToNumber(booking.end_time),
      })),
    [bookings],
  )

  const startOptions = useMemo(
    () =>
      timeOptions.map((time) => {
        const currentValue = timeToNumber(time)
        const isBlocked = blockedIntervals.some((interval) => isOverlap(currentValue, currentValue + 1, interval.start, interval.end))
        return { time, disabled: isBlocked }
      }),
    [blockedIntervals],
  )

  const endOptions = useMemo(() => {
    if (!startTime) return []
    const startNumber = timeToNumber(startTime)
    return timeOptions
      .filter((time) => timeToNumber(time) > startNumber)
      .map((time) => {
        const endNumber = timeToNumber(time)
        const isBlocked = blockedIntervals.some((interval) => isOverlap(startNumber, endNumber, interval.start, interval.end))
        return { time, disabled: isBlocked }
      })
  }, [blockedIntervals, startTime])

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Chọn giờ</p>
          <p className="mt-2 text-sm text-slate-600">Kiểm tra khung giờ trống và tránh trùng lịch.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
          Từ 06:00 đến 22:00
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Giờ bắt đầu
          <select
            value={startTime}
            onChange={(event) => onStartChange(event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-emerald-400"
          >
            <option value="">Chọn giờ bắt đầu</option>
            {startOptions.map((option) => (
              <option key={option.time} value={option.time} disabled={option.disabled}>
                {option.time} {option.disabled ? '– Đã được đặt' : ''}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Giờ kết thúc
          <select
            value={endTime}
            onChange={(event) => onEndChange(event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 transition focus:border-emerald-400"
            disabled={!startTime}
          >
            <option value="">Chọn giờ kết thúc</option>
            {endOptions.map((option) => (
              <option key={option.time} value={option.time} disabled={option.disabled}>
                {option.time} {option.disabled ? '– Trùng lịch' : ''}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Trùng lịch</p>
        {bookings.length ? (
          bookings.map((booking) => (
            <div key={`${booking.booking_id}-${booking.start_time}`} className="rounded-3xl border border-rose-100 bg-rose-50 p-3">
              <p className="text-sm font-semibold text-rose-700">{booking.start_time} - {booking.end_time}</p>
              <p>{booking.booking_date}</p>
            </div>
          ))
        ) : (
          <p>Không có booking nào trùng vào ngày đã chọn.</p>
        )}
      </div>
    </div>
  )
})
