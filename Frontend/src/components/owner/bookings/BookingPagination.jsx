import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BookingPagination = React.memo(function BookingPagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-500">Trang {currentPage} / {totalPages}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="rounded-2xl border border-slate-200 p-2 text-slate-600 disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map((page) => (
          <button key={page} onClick={() => onPageChange(page)} className={`rounded-2xl px-3 py-2 text-sm font-semibold ${currentPage === page ? 'bg-slate-950 text-white' : 'border border-slate-200 text-slate-600'}`}>
            {page}
          </button>
        ))}
        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="rounded-2xl border border-slate-200 p-2 text-slate-600 disabled:opacity-40">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
})

export default BookingPagination
