import React from 'react'

export const VenueCardSkeleton = () => (
  <div className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-lg shadow-slate-200/20 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/30">
    {/* Image Skeleton */}
    <div className="relative h-56 w-full overflow-hidden bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />

    {/* Content Skeleton */}
    <div className="p-5 space-y-3">
      {/* Title Skeleton */}
      <div className="h-5 w-3/4 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />

      {/* Address Skeleton */}
      <div className="h-4 w-full rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />

      {/* Stats Skeleton */}
      <div className="flex gap-2 pt-2">
        <div className="h-4 w-1/3 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />
        <div className="h-4 w-1/3 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />
      </div>

      {/* Button Skeleton */}
      <div className="h-10 w-full rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer mt-4" />
    </div>
  </div>
)

export default function VenueSkeleton({ count = 16 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <VenueCardSkeleton key={i} />
      ))}
    </div>
  )
}
