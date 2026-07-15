import React from 'react'

export default function BookingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse rounded-[28px] bg-slate-200/80 p-8"></div>
      <div className="grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="space-y-6">
          <div className="animate-pulse rounded-[28px] bg-slate-200/80 p-8"></div>
          <div className="animate-pulse rounded-[28px] bg-slate-200/80 p-8"></div>
          <div className="animate-pulse rounded-[28px] bg-slate-200/80 p-8"></div>
        </div>
        <div className="animate-pulse rounded-[28px] bg-slate-200/80 p-8"></div>
      </div>
    </div>
  )
}
