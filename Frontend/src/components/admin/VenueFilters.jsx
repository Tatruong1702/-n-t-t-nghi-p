import React from 'react'

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: '1', label: 'Hoạt động' },
  { value: '0', label: 'Tạm dừng' },
]

export default function VenueFilters({
  filters,
  onFilterChange,
  onReset,
  onSort,
  sortBy,
  sortDirection,
  viewMode,
  onToggleView,
  selectedCount,
  onBulkAction,
  bulkLabel,
  loading,
}) {
  const sortButton = (field, label) => {
    const active = sortBy === field
    return (
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
          active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900'
        }`}
      >
        {label} {active && (sortDirection === 'asc' ? '↑' : '↓')}
      </button>
    )
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex-1 space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              type="search"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Tìm kiếm tên sân, khu vực hoặc chủ sân"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="text"
              value={filters.ownerId}
              onChange={(e) => onFilterChange('ownerId', e.target.value)}
              placeholder="ID chủ sân"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                value={filters.minRevenue}
                onChange={(e) => onFilterChange('minRevenue', e.target.value)}
                placeholder="Doanh thu từ"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="number"
                min="0"
                value={filters.maxRevenue}
                onChange={(e) => onFilterChange('maxRevenue', e.target.value)}
                placeholder="Đến"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                value={filters.minCourts}
                onChange={(e) => onFilterChange('minCourts', e.target.value)}
                placeholder="Sân con tối thiểu"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <input
                type="number"
                min="0"
                value={filters.maxCourts}
                onChange={(e) => onFilterChange('maxCourts', e.target.value)}
                placeholder="Tối đa"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            <select
              value={filters.city}
              onChange={(e) => onFilterChange('city', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tất cả khu vực</option>
              {filters.cityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.ownerId}
              onChange={(e) => onFilterChange('ownerId', e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tất cả chủ sân</option>
              {filters.ownerOptions.map((owner) => (
                <option key={owner} value={owner.id}>
                  {owner.label}
                </option>
              ))}
            </select>
            <div className="col-span-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onReset}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset Filters
              </button>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {selectedCount} selected
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:w-96">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sắp xếp nhanh</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sortButton('venue_name', 'Tên sân')}
              {sortButton('city', 'Khu vực')}
              {sortButton('revenue', 'Doanh thu')}
              {sortButton('created_at', 'Ngày tạo')}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Chế độ hiển thị</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleView('table')}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => onToggleView('card')}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${viewMode === 'card' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
              >
                Card
              </button>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Bulk Actions</p>
            <div className="mt-3 grid gap-2">
              <button
                type="button"
                disabled={selectedCount === 0 || loading}
                onClick={() => onBulkAction('activate')}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Kích hoạt nhiều sân
              </button>
              <button
                type="button"
                disabled={selectedCount === 0 || loading}
                onClick={() => onBulkAction('pause')}
                className="rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Tạm dừng nhiều sân
              </button>
              <button
                type="button"
                disabled={selectedCount === 0 || loading}
                onClick={() => onBulkAction('delete')}
                className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Xóa nhiều sân
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
