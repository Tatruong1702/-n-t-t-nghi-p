import React from 'react'

const CourtSkeleton = React.memo(function CourtSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div className="h-40 animate-pulse rounded-[20px] bg-slate-200" />
          <div className="mt-4 space-y-3">
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  )
})

export default CourtSkeleton
