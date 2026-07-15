import React from 'react'

const statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled']
const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'priceHigh', label: 'Giá cao nhất' },
  { value: 'priceLow', label: 'Giá thấp nhất' },
]

export default React.memo(function BookingFilters({ status, onStatusChange, search, onSearchChange, sort, onSortChange }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Lọc booking</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onStatusChange(option)}
                className={`rounded-3xl px-4 py-2 text-sm font-medium transition ${
                  status === option
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option === 'all' ? 'Tất cả' : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="sr-only">Search bookings</span>
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo tên sân hoặc mã booking"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Sắp xếp
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  )
})
