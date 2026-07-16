import React from 'react'

const cardData = [
  {
    key: 'totalUsers',
    title: 'Tổng người dùng',
    icon: 'ti ti-users',
    color: 'from-sky-500 to-cyan-500',
  },
  {
    key: 'activeUsers',
    title: 'Người dùng hoạt động',
    icon: 'ti ti-lock-open',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    key: 'newUsers',
    title: 'Người dùng mới',
    icon: 'ti ti-trending-up',
    color: 'from-amber-500 to-orange-500',
  },
  {
    key: 'adminCount',
    title: 'Quản trị viên',
    icon: 'ti ti-crown',
    color: 'from-violet-500 to-fuchsia-500',
  },
]

export default function UserStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cardData.map((card) => (
        <div
          key={card.key}
          className="group overflow-hidden rounded-3xl border border-slate-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-center justify-between gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg shadow-slate-200/70`}>
              <i className={`${card.icon} text-xl`} />
            </div>
            <span className="rounded-full border border-slate-border bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {card.title}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-3xl font-semibold text-slate-900">
              {stats[card.key]?.toLocaleString() || '0'}
            </p>
            <p className="mt-2 text-sm text-slate-500">Số liệu cập nhật theo lượt tải.</p>
          </div>
        </div>
      ))}
    </div>
  )
}
