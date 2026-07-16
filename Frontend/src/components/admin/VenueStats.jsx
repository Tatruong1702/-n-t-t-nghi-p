import React from 'react'

const statsConfig = [
  {
    key: 'totalVenues',
    title: 'Tổng số sân',
    icon: 'ti ti-building-castle',
    gradient: 'from-indigo-500 via-sky-500 to-cyan-500',
  },
  {
    key: 'activeVenues',
    title: 'Sân đang hoạt động',
    icon: 'ti ti-checkup-list',
    gradient: 'from-emerald-500 to-emerald-400',
  },
  {
    key: 'pausedVenues',
    title: 'Sân tạm ngừng',
    icon: 'ti ti-pause',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    key: 'totalCourts',
    title: 'Tổng số sân con',
    icon: 'ti ti-soccer-field',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    key: 'totalRevenue',
    title: 'Tổng doanh thu',
    icon: 'ti ti-currency-dollar',
    gradient: 'from-cyan-500 to-sky-500',
  },
  {
    key: 'monthRevenue',
    title: 'Doanh thu tháng',
    icon: 'ti ti-calendar-event',
    gradient: 'from-slate-500 to-slate-400',
  },
  {
    key: 'newVenuesThisMonth',
    title: 'Sân mới tháng',
    icon: 'ti ti-star',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'topCityLabel',
    title: 'Khu vực hàng đầu',
    icon: 'ti ti-map-pin',
    gradient: 'from-blue-500 to-indigo-500',
  },
]

function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

export default function VenueStats({ stats }) {
  return (
    <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-2">
      {statsConfig.map((item) => {
        const value = item.key === 'topCityLabel' ? stats.topCityLabel : item.key === 'monthRevenue' || item.key === 'totalRevenue' ? formatMoney(stats[item.key]) : stats[item.key]
        return (
          <div
            key={item.key}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-[0_25px_90px_-45px_rgba(15,23,42,0.85)]"
          >
            <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${item.gradient}`} />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{item.title}</p>
                <p className="mt-4 text-3xl font-semibold text-white">{value ?? '—'}</p>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-white shadow-md shadow-slate-900/20`}>
                <i className={`${item.icon} text-xl`} />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
              <span>{item.key === 'topCityLabel' ? stats.topCityCount + ' sân' : item.key === 'pausedVenues' ? `${stats[item.key]} sân` : ''}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                <i className="ti ti-arrow-narrow-up" />
                {stats.trendPercent ?? '0%'}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
