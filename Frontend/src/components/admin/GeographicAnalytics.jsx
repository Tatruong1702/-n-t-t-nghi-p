import React from 'react'

export default function GeographicAnalytics({ bookings, venues }) {
  const regionCounts = bookings.reduce((acc, booking) => {
    const venue = venues.find((item) => item.venue_id === booking.venue_id)
    const region = venue?.city || 'Khác'
    acc[region] = (acc[region] || 0) + 1
    return acc
  }, {})

  const regionList = Object.entries(regionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Geographic Insights</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Phân bổ booking theo khu vực thành phố.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {regionList.map(([region, count]) => (
          <div key={region} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{region}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{count}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Booking trong khoảng chọn</p>
          </div>
        ))}
      </div>
    </div>
  )
}
