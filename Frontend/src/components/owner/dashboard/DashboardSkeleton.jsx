import React, { memo } from 'react'

const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse rounded-[24px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)]">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="mt-4 h-4 w-40 rounded bg-slate-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-[24px] border border-slate-200 bg-white/80 p-5">
            <div className="h-12 w-12 rounded-2xl bg-slate-200" />
            <div className="mt-4 h-4 w-24 rounded bg-slate-200" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="animate-pulse rounded-[24px] border border-slate-200 bg-white/80 p-6 h-80" />
        <div className="animate-pulse rounded-[24px] border border-slate-200 bg-white/80 p-6 h-80" />
      </div>
    </div>
  )
})

export default DashboardSkeleton
