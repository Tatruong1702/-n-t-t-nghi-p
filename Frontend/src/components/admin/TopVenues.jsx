import React from 'react'

const progressColor = ['bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500']

export default function TopVenues({ venues, loading }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Top Venues</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Top 5 sân có doanh thu cao nhất.</p>
        </div>
        <span className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
          Ranking Performance
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="space-y-3 rounded-[1.75rem] bg-slate-100 p-5 dark:bg-slate-900">
              <div className="h-5 w-2/5 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          ))
        ) : venues.length > 0 ? (
          venues.map((venue, index) => {
            const progress = Math.min(100, Math.max(10, Math.round(venue.revenueShare * 100)))
            const percentage = venue.revenueShare ? `${(venue.revenueShare * 100).toFixed(1)}%` : '0%'
            return (
              <div key={venue.venue_name} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{index + 1}. {venue.venue_name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{venue.bookings} booking • {venue.revenue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    {percentage}
                  </span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className={`h-full rounded-full ${progressColor[index]} transition-all`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-[1.75rem] bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            Không có dữ liệu top venues.
          </div>
        )}
      </div>
    </div>
  )
}
