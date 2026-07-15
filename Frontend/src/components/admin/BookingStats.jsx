import React from 'react'

const metrics = [
  { key: 'totalBookings', label: 'Tổng booking', icon: 'ti ti-calendar-check', color: 'from-sky-500 to-indigo-500', small: false },
  { key: 'todayBookings', label: 'Booking hôm nay', icon: 'ti ti-sun', color: 'from-emerald-500 to-teal-500', small: false },
  { key: 'weekBookings', label: 'Booking tuần', icon: 'ti ti-calendar-week', color: 'from-violet-500 to-fuchsia-500', small: false },
  { key: 'monthBookings', label: 'Booking tháng', icon: 'ti ti-calendar-month', color: 'from-cyan-500 to-sky-500', small: false },
  { key: 'pendingCount', label: 'Đang chờ', icon: 'ti ti-clock', color: 'from-amber-500 to-orange-500', small: true },
  { key: 'confirmedCount', label: 'Đã xác nhận', icon: 'ti ti-check', color: 'from-blue-500 to-indigo-500', small: true },
  { key: 'completedCount', label: 'Hoàn thành', icon: 'ti ti-activity', color: 'from-emerald-500 to-green-500', small: true },
  { key: 'cancelledCount', label: 'Đã hủy', icon: 'ti ti-ban', color: 'from-rose-500 to-red-500', small: true },
  { key: 'revenueToday', label: 'Doanh thu hôm nay', icon: 'ti ti-currency-dollar', color: 'from-emerald-600 to-cyan-600', small: true },
  { key: 'revenueMonth', label: 'Doanh thu tháng', icon: 'ti ti-chart-arcs', color: 'from-slate-700 to-slate-500', small: true },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))
}

export default function BookingStats({ stats = {}, loading }) {
  return (
    <div className="grid gap-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2">
      {metrics.map((metric) => {
        const value = metric.key.startsWith('revenue') ? formatCurrency(stats[metric.key]) : stats[metric.key] ?? 0
        const trend = loading ? null : stats[`${metric.key}Trend`]
        const showTrend = trend !== undefined && trend !== null && trend !== ''

        return (
          <div
            key={metric.key}
            className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.9)] transition hover:-translate-y-1"
          >
            <div className={`absolute right-0 top-0 h-full w-2 rounded-l-full bg-gradient-to-b ${metric.color}`} />
            <div className="absolute right-8 top-6 h-12 w-12 rounded-full bg-white/5 ring-1 ring-slate-700" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.38em] text-slate-400">{metric.label}</p>
                <p className="mt-5 text-4xl font-semibold tracking-tight text-white">{loading ? <span className="inline-block h-12 w-24 animate-pulse rounded-xl bg-slate-800" /> : value}</p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="rounded-3xl bg-slate-900/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  {metric.small ? 'Chi tiết nhanh' : 'Hiệu suất hiện tại'}
                </span>
                {loading ? (
                  <span className="rounded-full bg-slate-800 px-3 py-2 text-[11px] font-semibold text-slate-400">...</span>
                ) : (
                  showTrend && (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-500/20">
                      {trend}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
