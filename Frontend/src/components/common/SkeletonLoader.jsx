import React from 'react'

export default function SkeletonLoader({ count = 4, className = '' }) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-[0_12px_32px_-20px_rgba(15,23,42,0.25)]">
          <div className="h-4 w-24 rounded-full bg-slate-200" />
          <div className="mt-4 h-8 w-32 rounded-full bg-slate-200" />
          <div className="mt-3 h-3 w-40 rounded-full bg-slate-200" />
          <div className="mt-6 h-24 rounded-[18px] bg-slate-100" />
        </div>
      ))}
    </div>
  )
}
