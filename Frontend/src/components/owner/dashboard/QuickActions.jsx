import React, { memo } from 'react'
import { PlusCircle, CalendarRange, BadgeDollarSign, BarChart3, Settings2 } from 'lucide-react'

const actions = [
  { label: 'Thêm sân', icon: PlusCircle },
  { label: 'Thêm sân con', icon: PlusCircle },
  { label: 'Xem booking', icon: CalendarRange },
  { label: 'Quản lý giá', icon: BadgeDollarSign },
  { label: 'Xem báo cáo', icon: BarChart3 },
]

const QuickActions = memo(function QuickActions() {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-2 text-white">
          <Settings2 size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-600">Quick actions</p>
          <h3 className="text-xl font-semibold text-slate-900">Thao tác nhanh</h3>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button key={action.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50">
              <span className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <Icon size={16} className="text-emerald-600" /> {action.label}
              </span>
              <span className="text-slate-400">→</span>
            </button>
          )
        })}
      </div>
    </div>
  )
})

export default QuickActions
