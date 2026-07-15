import React, { useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function VenuePagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 16,
  onPageChange,
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }, [currentPage, onPageChange])

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }, [currentPage, totalPages, onPageChange])

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-12 flex flex-col gap-6 items-center">
      {/* Info */}
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Hiển thị <span className="font-semibold text-slate-900">{startItem}–{endItem}</span> trên tổng <span className="font-semibold text-slate-900">{totalItems}</span> sân
        </p>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
          <span className="hidden sm:inline">Trước</span>
        </button>

        {/* Page Numbers - Desktop Only */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, i) => (
            <button
              key={i}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`w-10 h-10 rounded-[8px] text-sm font-semibold transition ${
                page === currentPage
                  ? 'bg-emerald-600 text-white'
                  : page === '...'
                  ? 'cursor-default text-slate-600'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-400'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Mobile Page Info */}
        <div className="sm:hidden px-4 py-2.5 text-sm font-semibold text-slate-900">
          {currentPage} / {totalPages}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Tiếp</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
