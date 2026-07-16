import React from 'react'

const periodOptions = [
  { value: '7', label: '7 ngày' },
  { value: '30', label: '30 ngày' },
  { value: '90', label: '90 ngày' },
  { value: '365', label: '1 năm' },
]

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'pending', label: 'Chờ' },
  { value: 'cancelled', label: 'Đã hủy' },
]

export default function ReportsFilters({ filters, owners, venues, regions, onUpdateFilter, onReset, onQuickRange }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Bộ lọc nâng cao</p>
          <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">Điều chỉnh hiển thị dữ liệu</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onQuickRange(option.value)}
              className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${filters.period === option.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-5">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Sân</span>
          <select
            value={filters.venueId}
            onChange={(e) => onUpdateFilter('venueId', e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Tất cả sân</option>
            {venues.map((venue) => (
              <option key={venue.venue_id} value={venue.venue_id}>{venue.venue_name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Chủ sân</span>
          <select
            value={filters.ownerId}
            onChange={(e) => onUpdateFilter('ownerId', e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Tất cả chủ sân</option>
            {owners.map((owner) => (
              <option key={owner.owner_id} value={owner.owner_id}>{owner.owner_name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Khu vực</span>
          <select
            value={filters.region}
            onChange={(e) => onUpdateFilter('region', e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Tất cả vùng</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Trạng thái booking</span>
          <select
            value={filters.status}
            onChange={(e) => onUpdateFilter('status', e.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}
