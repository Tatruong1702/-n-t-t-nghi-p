import React from 'react'

export default React.memo(function BookingStats({ stats = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((item) => (
        <div key={item.label} className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
          {item.meta && <p className="mt-2 text-sm text-slate-500">{item.meta}</p>}
        </div>
      ))}
    </div>
  )
})
