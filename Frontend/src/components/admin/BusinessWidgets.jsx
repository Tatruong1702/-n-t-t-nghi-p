import React from 'react'

const iconMap = {
  topVenue: 'ti ti-star',
  peakHour: 'ti ti-clock',
  revenueToday: 'ti ti-currency-dollar',
  revenueMonth: 'ti ti-chart-arcs',
  fillRate: 'ti ti-layout-grid',
  activeVenues: 'ti ti-building',
  topOwner: 'ti ti-crown',
  topCustomer: 'ti ti-user-circle',
}

export default function BusinessWidgets({ items = [], loading }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {loading ? (
        Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="h-12 w-12 rounded-3xl bg-slate-100 dark:bg-slate-900" />
            <div className="mt-6 space-y-3">
              <div className="h-4 w-2/5 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-3/5 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))
      ) : (
        items.map((widget) => (
          <div
            key={widget.key}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                <i className={`${iconMap[widget.key] || 'ti ti-chart-line'} text-lg`} />
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                {widget.title}
              </span>
            </div>
            <div className="mt-6">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{widget.value}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{widget.subtitle}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
