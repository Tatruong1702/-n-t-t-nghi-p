import React, { useMemo } from 'react'

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

export default function VenuePerformance({ venues }) {
  const topRevenue = useMemo(() => [...venues].sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0)).slice(0, 3), [venues])
  const topBookings = useMemo(() => [...venues].sort((a, b) => Number(b.booking_count || 0) - Number(a.booking_count || 0)).slice(0, 3), [venues])
  const underutilized = useMemo(() => [...venues].sort((a, b) => Number(a.occupancy_rate || 0) - Number(b.occupancy_rate || 0)).slice(0, 3), [venues])
  const growth = useMemo(() => [...venues].sort((a, b) => Number(b.month_growth || 0) - Number(a.month_growth || 0)).slice(0, 3), [venues])

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Top sân doanh thu</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Những sân mang lại doanh thu cao nhất.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {topRevenue.map((venue) => (
            <div key={venue.venue_id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{venue.venue_name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{venue.city || 'Chưa có khu vực'}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatCurrency(venue.revenue)}</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm text-slate-500 dark:text-slate-400">
                <span>Booking: {venue.booking_count || 0}</span>
                <span>Fill rate: {venue.occupancy_rate ? `${venue.occupancy_rate}%` : 'Chưa có'}</span>
                <span>Growth: {venue.month_growth ? `${venue.month_growth}%` : '0%'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Sân ít khách</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Những sân cần ưu tiên marketing hoặc giảm giá.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {underutilized.map((venue) => (
            <div key={venue.venue_id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{venue.venue_name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{venue.city || 'Chưa có khu vực'}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{venue.occupancy_rate ? `${venue.occupancy_rate}%` : '—'}</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-500 dark:text-slate-400">
                <span>Doanh thu: {formatCurrency(venue.revenue)}</span>
                <span>Booking: {venue.booking_count || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
