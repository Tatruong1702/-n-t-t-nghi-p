import React from 'react'

export default React.memo(function BookingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse rounded-[28px] bg-slate-200/70 p-8 shadow-sm" />
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="animate-pulse rounded-[28px] bg-slate-200/70 p-8" />
          <div className="animate-pulse rounded-[28px] bg-slate-200/70 p-8" />
        </div>
        <div className="space-y-6">
          <div className="animate-pulse rounded-[28px] bg-slate-200/70 p-8" />
          <div className="animate-pulse rounded-[28px] bg-slate-200/70 p-8" />
        </div>
      </div>
    </div>
  )
})
