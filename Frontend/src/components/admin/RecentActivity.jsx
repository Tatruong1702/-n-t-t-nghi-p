import React from 'react'

const eventIconMap = {
  booked: 'ti ti-calendar-check',
  complete: 'ti ti-circle-check',
  canceled: 'ti ti-ban',
  new_user: 'ti ti-user-plus',
}

export default function RecentActivity({ events }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Hoạt động gần nhất để theo dõi xu hướng vận hành.</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-900 text-white">
              <i className={`ti ${eventIconMap[event.type] || 'ti ti-activity'} text-lg`} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{event.title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{event.description}</p>
            </div>
            <div className="text-right text-sm text-slate-500 dark:text-slate-400">
              <p>{event.timeLabel}</p>
              <p className="mt-1">{event.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
