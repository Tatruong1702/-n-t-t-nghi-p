import React from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react'

const CourtFilters = React.memo(function CourtFilters({
  search,
  onSearchChange,
  sportFilter,
  onSportFilterChange,
  statusFilter,
  onStatusFilterChange,
  priceFilter,
  onPriceFilterChange,
  venueFilter,
  onVenueFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  venues,
  onReset,
}) {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Search className="h-4 w-4" />
            <input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Tìm tên sân, loại sân hoặc sân chính" className="w-full bg-transparent outline-none" />
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            <select value={sportFilter} onChange={(e) => onSportFilterChange(e.target.value)} className="bg-transparent outline-none">
              <option value="all">Tất cả loại sân</option>
              <option value="5v5">5v5</option>
              <option value="7v7">7v7</option>
              <option value="11v11">11v11</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className="bg-transparent outline-none">
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            <select value={priceFilter} onChange={(e) => onPriceFilterChange(e.target.value)} className="bg-transparent outline-none">
              <option value="all">Tất cả giá</option>
              <option value="lt100">Dưới 100k</option>
              <option value="100_300">100k - 300k</option>
              <option value="gt300">Trên 300k</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <SlidersHorizontal className="h-4 w-4" />
            <select value={venueFilter} onChange={(e) => onVenueFilterChange(e.target.value)} className="bg-transparent outline-none">
              <option value="all">Tất cả sân chính</option>
              {venues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>{venue.venue_name}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <ArrowUpDown className="h-4 w-4" />
            <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} className="bg-transparent outline-none">
              <option value="court_name">Tên</option>
              <option value="price_per_hour">Giá</option>
              <option value="booking_count">Booking</option>
              <option value="created_at">Ngày tạo</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <ArrowUpDown className="h-4 w-4" />
            <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value)} className="bg-transparent outline-none">
              <option value="asc">ASC</option>
              <option value="desc">DESC</option>
            </select>
          </label>
          <button onClick={onReset} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <RotateCcw className="h-4 w-4" /> Đặt lại
          </button>
        </div>
      </div>
    </div>
  )
})

export default CourtFilters
