import React from 'react'
import { Search, SlidersHorizontal, RotateCcw, CalendarDays, ArrowUpDown } from 'lucide-react'

const BookingFilters = React.memo(function BookingFilters({
  search,
  onSearchChange,
  bookingStatus,
  onBookingStatusChange,
  paymentStatus,
  onPaymentStatusChange,
  venueFilter,
  onVenueFilterChange,
  courtFilter,
  onCourtFilterChange,
  dateFilter,
  onDateFilterChange,
  monthFilter,
  onMonthFilterChange,
  priceFilter,
  onPriceFilterChange,
  venues,
  courts,
  onReset,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <SlidersHorizontal className="h-4 w-4" /> Bộ lọc nâng cao
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <Search className="h-3.5 w-3.5" /> Tìm kiếm
              </span>
              <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Tên khách, email, mã booking..." className="w-full bg-transparent text-sm text-slate-900 outline-none" />
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trạng thái booking</span>
              <select value={bookingStatus} onChange={(event) => onBookingStatusChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Tất cả</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trạng thái thanh toán</span>
              <select value={paymentStatus} onChange={(event) => onPaymentStatusChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Tất cả</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sân chính</span>
              <select value={venueFilter} onChange={(event) => onVenueFilterChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Tất cả</option>
                {venues.map((venue) => (
                  <option key={venue.venue_id} value={venue.venue_id}>{venue.venue_name}</option>
                ))}
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sân con</span>
              <select value={courtFilter} onChange={(event) => onCourtFilterChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Tất cả</option>
                {courts.map((court) => (
                  <option key={court.court_id} value={court.court_id}>{court.court_name}</option>
                ))}
              </select>
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" /> Ngày
              </span>
              <input type="date" value={dateFilter} onChange={(event) => onDateFilterChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none" />
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tháng</span>
              <input type="month" value={monthFilter} onChange={(event) => onMonthFilterChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none" />
            </label>
            <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Khoảng giá</span>
              <select value={priceFilter} onChange={(event) => onPriceFilterChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
                <option value="all">Tất cả</option>
                <option value="lt100">Dưới 100k</option>
                <option value="100_300">100k - 300k</option>
                <option value="gt300">Trên 300k</option>
              </select>
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <ArrowUpDown className="h-3.5 w-3.5" /> Sắp xếp
            </span>
            <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
              <option value="booking_date">Ngày đặt</option>
              <option value="total_price">Tổng tiền</option>
              <option value="customerName">Tên khách</option>
              <option value="status">Trạng thái</option>
            </select>
          </label>
          <label className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Hướng</span>
            <select value={sortOrder} onChange={(event) => onSortOrderChange(event.target.value)} className="w-full bg-transparent text-sm text-slate-900 outline-none">
              <option value="desc">DESC</option>
              <option value="asc">ASC</option>
            </select>
          </label>
          <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1">
            <button onClick={() => onViewModeChange('table')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${viewMode === 'table' ? 'bg-slate-950 text-white' : 'text-slate-600'}`}>Table</button>
            <button onClick={() => onViewModeChange('calendar')} className={`rounded-xl px-3 py-2 text-sm font-semibold ${viewMode === 'calendar' ? 'bg-slate-950 text-white' : 'text-slate-600'}`}>Calendar</button>
          </div>
          <button onClick={onReset} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <RotateCcw className="h-4 w-4" /> Reset Filter
          </button>
        </div>
      </div>
    </div>
  )
})

export default BookingFilters
