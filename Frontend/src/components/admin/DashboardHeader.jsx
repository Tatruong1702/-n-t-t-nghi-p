import React from 'react'

const actions = [
  { label: 'Tạo báo cáo', icon: 'ti ti-file-text' },
  { label: 'Tạo sự kiện', icon: 'ti ti-calendar-event' },
  { label: 'Thêm sân', icon: 'ti ti-building-castle' },
]

export default function DashboardHeader({ currentTime, onRefresh }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Football Venue Admin</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Bảng điều khiển</h1>
              <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Tổng quan doanh thu, bookings và hiệu suất hệ thống sân bóng.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm" />
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:auto-cols-max lg:grid-flow-col">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <i className="ti ti-refresh text-base" />
            Refresh
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900">
            <i className="ti ti-bell text-base" />
            Thông báo
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">3</span>
          </button>
          <div className="inline-flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <i className="ti ti-clock text-base" />
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Bây giờ</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{currentTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <i className={`${action.icon} text-lg`} />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
