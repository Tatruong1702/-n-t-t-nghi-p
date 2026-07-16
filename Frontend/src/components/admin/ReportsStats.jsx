import React, { useEffect, useMemo, useState } from 'react'

function Counter({ value }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 600
    const stepTime = Math.max(Math.floor(duration / Math.max(value, 1)), 16)
    const startTime = Date.now()

    const update = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplay(Math.round(progress * value))
      if (progress < 1) window.requestAnimationFrame(update)
    }

    update()
    return () => setDisplay(value)
  }, [value])

  return <span>{display.toLocaleString()}</span>
}

const statsConfig = [
  { key: 'totalRevenue', label: 'Tổng doanh thu', icon: 'ti ti-currency-dollar', color: 'from-emerald-500 to-cyan-500', prefix: true },
  { key: 'todayRevenue', label: 'Doanh thu hôm nay', icon: 'ti ti-sun', color: 'from-yellow-400 to-orange-500', prefix: true },
  { key: 'monthRevenue', label: 'Doanh thu tháng', icon: 'ti ti-calendar-event', color: 'from-sky-500 to-indigo-500', prefix: true },
  { key: 'totalBookings', label: 'Tổng booking', icon: 'ti ti-calendar-check', color: 'from-violet-500 to-fuchsia-500' },
  { key: 'todayBookings', label: 'Booking hôm nay', icon: 'ti ti-clock', color: 'from-amber-500 to-orange-500' },
  { key: 'weekBookings', label: 'Booking tuần', icon: 'ti ti-activity', color: 'from-cyan-500 to-sky-500' },
  { key: 'monthBookings', label: 'Booking tháng', icon: 'ti ti-calendar-month', color: 'from-indigo-500 to-violet-500' },
  { key: 'totalCustomers', label: 'Tổng khách hàng', icon: 'ti ti-users', color: 'from-slate-500 to-slate-400' },
  { key: 'newCustomers', label: 'Khách hàng mới', icon: 'ti ti-user-plus', color: 'from-emerald-500 to-teal-500' },
  { key: 'totalVenues', label: 'Tổng sân', icon: 'ti ti-building-castle', color: 'from-slate-600 to-slate-400' },
  { key: 'activeVenues', label: 'Sân đang hoạt động', icon: 'ti ti-check', color: 'from-emerald-500 to-green-500' },
  { key: 'cancelRate', label: 'Tỷ lệ hủy', icon: 'ti ti-ban', color: 'from-rose-500 to-pink-500', suffix: '%' },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

export default function ReportsStats({ stats }) {
  const metrics = useMemo(
    () => statsConfig.map((item) => ({
      ...item,
      value: item.prefix ? item.value : item.value,
    })),
    [stats]
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const rawValue = stats[metric.key] ?? 0
        const valueLabel = metric.key === 'cancelRate' ? rawValue.toFixed(1) : rawValue
        return (
          <div key={metric.key} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950/95 p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.75)] transition hover:-translate-y-1 hover:shadow-[0_25px_90px_-45px_rgba(15,23,42,0.85)] dark:border-slate-800">
            <div className={`absolute right-0 top-0 h-full w-2 rounded-l-full bg-gradient-to-b ${metric.color}`} />
            <div className="relative z-10 flex h-full flex-col justify-between gap-5">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white/10 text-white shadow-sm ring-1 ring-white/10">
                    <i className={`ti ${metric.icon} text-lg`} />
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">{metric.label}</span>
                </div>
                <p className="mt-6 text-3xl font-semibold text-white">
                  {metric.key === 'cancelRate' ? `${valueLabel}${metric.suffix}` : metric.prefix ? formatCurrency(valueLabel) : <Counter value={Number(valueLabel)} />}
                </p>
              </div>
              <p className="text-sm text-slate-400">Dữ liệu chỉ tính từ booking đã xác nhận và hoàn thành.</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
