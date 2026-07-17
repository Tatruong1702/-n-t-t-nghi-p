import React, { memo } from 'react'
import { BellRing, CircleAlert, CheckCircle2, XCircle } from 'lucide-react'

const Notifications = memo(function Notifications({ notifications }) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-2 text-white">
          <BellRing size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-600">Thông báo</p>
          <h3 className="text-xl font-semibold text-slate-900">Hoạt động gần đây</h3>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {notifications.map((item) => {
          const Icon = item.type === 'canceled' ? XCircle : item.type === 'success' ? CheckCircle2 : CircleAlert
          return (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
              <div className={`rounded-xl p-2 ${item.type === 'canceled' ? 'bg-rose-50 text-rose-600' : item.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500">{item.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default Notifications
