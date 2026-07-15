import React, { useMemo } from 'react'

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
]

const dateRanges = [
  { value: '7', label: '7 ngày' },
  { value: '30', label: '30 ngày' },
  { value: '90', label: '90 ngày' },
  { value: '365', label: '12 tháng' },
]

export default function BookingFilters({
  filters,
  onFilterChange,
  onReset,
  onSaveFilter,
  savedFilters,
  onApplySavedFilter,
  onToggleView,
  viewMode,
  searchValue,
  onSearchChange,
  sortBy,
  sortDirection,
  onSort,
  selectedCount,
  filterOptions,
  loading,
}) {
  const venueOptions = useMemo(() => filterOptions.venues || [], [filterOptions.venues])
  const courtOptions = useMemo(() => filterOptions.courts || [], [filterOptions.courts])
  const customerOptions = useMemo(() => filterOptions.customers || [], [filterOptions.customers])

  const sortButton = (field, label) => (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
        sortBy === field ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900'
      }`}
    >
      {label} {sortBy === field && (sortDirection === 'asc' ? '↑' : '↓')}
    </button>
  )

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex-1 space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm kiếm khách hàng, sân, mã booking"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filters.venue}
                onChange={(e) => onFilterChange('venue', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Tất cả venue</option>
                {venueOptions.map((venue) => (
                  <option key={venue.value} value={venue.value}>
                    {venue.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filters.court}
                onChange={(e) => onFilterChange('court', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Tất cả sân</option>
                {courtOptions.map((court) => (
                  <option key={court.value} value={court.value}>
                    {court.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <select
                value={filters.customer}
                onChange={(e) => onFilterChange('customer', e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Tất cả khách hàng</option>
                {customerOptions.map((customer) => (
                  <option key={customer.value} value={customer.value}>
                    {customer.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                placeholder="Giá từ"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                placeholder="Đến"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {dateRanges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => onFilterChange('quickRange', range.value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${filters.quickRange === range.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onSaveFilter}
                disabled={loading}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Lưu bộ lọc
              </button>
              <button
                type="button"
                onClick={onReset}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {savedFilters.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <div className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">Saved Filters</div>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((filter) => (
                  <button
                    key={filter.name}
                    type="button"
                    onClick={() => onApplySavedFilter(filter)}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 xl:w-80">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Chế độ hiển thị</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onToggleView('table')}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => onToggleView('calendar')}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${viewMode === 'calendar' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                Calendar
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sort nhanh</p>
            <div className="mt-3 flex flex-wrap gap-2">{sortButton('booking_date', 'Ngày đặt')}{sortButton('total_price', 'Giá tiền')}{sortButton('user_name', 'Khách hàng')}{sortButton('status', 'Trạng thái')}</div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Đã chọn</p>
            <div className="mt-3 rounded-3xl bg-white p-4 text-sm font-semibold text-slate-700">{selectedCount} booking</div>
          </div>
        </div>
      </div>
    </div>
  )
}
