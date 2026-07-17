import React from 'react'
import { Search, SlidersHorizontal, RotateCcw, CalendarDays, Sparkles } from 'lucide-react'

const RevenueFilters = React.memo(function RevenueFilters({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  period,
  onPeriodChange,
  venueFilter,
  onVenueFilterChange,
  courtFilter,
  onCourtFilterChange,
  statusFilter,
  onStatusFilterChange,
  venues,
  courts,
  onReset,
  onQuickFilter,
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <SlidersHorizontal className="h-4 w-4" /> Bộ lọc doanh thu
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"><Search className="h-3.5 w-3.5" /> Tìm kiếm</span>
              <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Tên khách, mã booking..." className="w-full bg-transparent text-sm text-slate-900 outline-none" />
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Khoảng thời gian</span>
              <select value={period} onChange={(event) => onPeriodChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Toàn thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="7d">7 ngày</option>
                <option value="30d">30 ngày</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"><CalendarDays className="h-3.5 w-3.5" /> Ngày</span>
              <input type="date" value={dateRange} onChange={(event) => onDateRangeChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none" />
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sân chính</span>
              <select value={venueFilter} onChange={(event) => onVenueFilterChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Tất cả</option>
                {venues.map((venue) => <option key={venue.venue_id} value={venue.venue_id}>{venue.venue_name}</option>)}
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sân con</span>
              <select value={courtFilter} onChange={(event) => onCourtFilterChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Tất cả</option>
                {courts.map((court) => <option key={court.court_id} value={court.court_id}>{court.court_name}</option>)}
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trạng thái</span>
              <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Tất cả</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 text-sm">
            <button onClick={() => onQuickFilter('today')} className="rounded-xl px-3 py-2 font-semibold text-slate-600">Hôm nay</button>
            <button onClick={() => onQuickFilter('7d')} className="rounded-xl px-3 py-2 font-semibold text-slate-600">7 ngày</button>
            <button onClick={() => onQuickFilter('30d')} className="rounded-xl px-3 py-2 font-semibold text-slate-600">30 ngày</button>
            <button onClick={() => onQuickFilter('quarter')} className="rounded-xl px-3 py-2 font-semibold text-slate-600">Quý</button>
          </div>
          <button onClick={onReset} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <RotateCcw className="h-4 w-4" /> Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
})

export default RevenueFilters
