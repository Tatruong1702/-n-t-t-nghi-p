import React from 'react'

const flow = ['pending', 'confirmed', 'completed']

export default React.memo(function BookingTimeline({ status }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tiến trình booking</p>
      <div className="mt-5 space-y-4">
        {flow.map((item, index) => {
          const active = item === status || (status === 'completed' && item !== 'pending') || (status === 'confirmed' && item === 'pending')
          const isDone = flow.indexOf(item) <= flow.indexOf(status)
          return (
            <div key={item} className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {index + 1}
              </div>
              <div>
                <p className={`text-sm font-semibold ${isDone ? 'text-slate-950' : 'text-slate-500'}`}>{item.charAt(0).toUpperCase() + item.slice(1)}</p>
                <p className="text-xs text-slate-500">{active ? 'Đang thực hiện' : 'Chưa hoàn thành'}</p>
              </div>
            </div>
          )
        })}
        {status === 'cancelled' && (
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white">×</div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Cancelled</p>
              <p className="text-xs text-slate-500">Booking đã bị hủy</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
