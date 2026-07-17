import React, { useMemo } from 'react'
import formatMoney from '../../../utils/formatMoney'

const VenueStats = React.memo(({ venue, bookingCount = 0 }) => {
  const stats = useMemo(() => {
    return [
      {
        icon: '📅',
        label: 'Tổng lượt đặt',
        value: venue?.booking_count || bookingCount,
        color: 'bg-blue-50 text-blue-700 border-blue-200',
      },
      {
        icon: '📊',
        label: 'Booking tháng này',
        value: venue?.month_booking_count || 0,
        color: 'bg-green-50 text-green-700 border-green-200',
      },
      {
        icon: '💰',
        label: 'Doanh thu',
        value: formatMoney(venue?.revenue || 0),
        color: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        icon: '🎯',
        label: 'Doanh thu tháng',
        value: formatMoney(venue?.month_revenue || 0),
        color: 'bg-purple-50 text-purple-700 border-purple-200',
      },
    ]
  }, [venue, bookingCount])

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm border border-slate-200">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Thống kê</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Hiệu suất</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-[20px] border p-6 ${stat.color}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold opacity-75">{stat.label}</p>
                <p className="mt-3 text-2xl font-bold">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

VenueStats.displayName = 'VenueStats'

export default VenueStats
