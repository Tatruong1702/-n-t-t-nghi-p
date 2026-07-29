import React from 'react'

const BookingSkeleton = React.memo(function BookingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-[28px] bg-slate-200" />
      <div className="grid gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-[24px] bg-slate-200" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-[28px] bg-slate-200" />
    </div>
  )
})

export default BookingSkeleton
