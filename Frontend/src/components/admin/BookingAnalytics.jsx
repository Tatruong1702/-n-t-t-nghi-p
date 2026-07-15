import React, { useMemo } from 'react'
import { Line, Bar } from 'react-chartjs-2'

function buildChart(data, labels) {
  return {
    labels,
    datasets: [
      {
        label: 'Booking volume',
        data,
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.16)',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  }
}

export default function BookingAnalytics({ bookings, venueMap }) {
  const byHour = useMemo(() => {
    const buckets = Array.from({ length: 16 }, (_, i) => ({ hour: 6 + i, count: 0 }))
    bookings.forEach((booking) => {
      const hour = Number(booking.start_time?.split(':')[0])
      const bucket = buckets.find((item) => item.hour === hour)
      if (bucket) bucket.count += 1
    })
    return buckets
  }, [bookings])

  const byDay = useMemo(() => {
    const counts = {}
    bookings.forEach((booking) => {
      const key = new Date(booking.booking_date).toLocaleDateString('vi-VN', { weekday: 'short' })
      counts[key] = (counts[key] || 0) + 1
    })
    const labels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return labels.map((label) => ({ label, count: counts[label] || 0 }))
  }, [bookings])

  const byMonth = useMemo(() => {
    const counts = {}
    bookings.forEach((booking) => {
      const date = new Date(booking.booking_date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      counts[key] = (counts[key] || 0) + 1
    })
    const labels = Object.keys(counts).sort()
    return labels.map((label) => ({ label, count: counts[label] }))
  }, [bookings])

  const byRegion = useMemo(() => {
    const counts = {}
    bookings.forEach((booking) => {
      const region = booking.city || venueMap[booking.venue_id]?.city || 'Khác'
      counts[region] = (counts[region] || 0) + 1
    })
    return Object.entries(counts).map(([region, count]) => ({ region, count })).sort((a, b) => b.count - a.count).slice(0, 6)
  }, [bookings, venueMap])

  const popularHour = useMemo(() => byHour.reduce((best, item) => (item.count > best.count ? item : best), { hour: 6, count: 0 }), [byHour])
  const popularDay = useMemo(() => byDay.reduce((best, item) => (item.count > best.count ? item : best), { label: '-', count: 0 }), [byDay])
  const popularMonth = useMemo(() => byMonth.reduce((best, item) => (item.count > best.count ? item : best), { label: '-', count: 0 }), [byMonth])

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Booking Analytics</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Theo dõi số lượng booking theo giờ, ngày và khu vực.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Peak hour</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{popularHour.hour}:00</p>
          <p className="mt-2 text-sm text-slate-500">{popularHour.count} booking</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Peak day</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{popularDay.label}</p>
          <p className="mt-2 text-sm text-slate-500">{popularDay.count} booking</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Peak month</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">{popularMonth.label}</p>
          <p className="mt-2 text-sm text-slate-500">{popularMonth.count} booking</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-slate-900 dark:text-white">Booking theo giờ</p>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Giờ</span>
          </div>
          <div className="h-52">
            <Line
              data={buildChart(byHour.map((item) => item.count), byHour.map((item) => `${item.hour}:00`))}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-slate-900 dark:text-white">Booking theo khu vực</p>
            <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Region</span>
          </div>
          <div className="h-52">
            <Bar
              data={{ labels: byRegion.map((item) => item.region), datasets: [{ label: 'Booking', data: byRegion.map((item) => item.count), backgroundColor: '#3b82f6' }] }}
              options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
