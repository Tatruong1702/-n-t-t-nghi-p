import React from 'react'

const CourtPagination = React.memo(function CourtPagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="text-sm text-slate-500">Trang {currentPage} / {totalPages}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => onPageChange(index + 1)} className={`rounded-2xl px-4 py-2 text-sm font-medium ${currentPage === index + 1 ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {index + 1}
          </button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Next</button>
      </div>
    </div>
  )
})

export default CourtPagination
