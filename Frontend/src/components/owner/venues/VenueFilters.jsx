import React from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List } from 'lucide-react'

const VenueFilters = React.memo(function VenueFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onReset,
}) {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Search className="h-4 w-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên sân hoặc địa chỉ"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent outline-none">
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="paused">Tạm ngưng</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <ArrowUpDown className="h-4 w-4" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent outline-none">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="revenue">Doanh thu cao nhất</option>
              <option value="bookings">Booking nhiều nhất</option>
            </select>
          </label>
          <div className="flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button onClick={() => setViewMode('table')} className={`rounded-xl p-2 ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
              <List className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode('card')} className={`rounded-xl p-2 ${viewMode === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <button onClick={onReset} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  )
})

export default VenueFilters
