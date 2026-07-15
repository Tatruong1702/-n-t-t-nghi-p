import React, { useCallback } from 'react'
import { ChevronDown, X } from 'lucide-react'

export default function VenueFilters({
  filters = {},
  onFilterChange,
  onReset,
  locations = [],
  priceRange = { min: 0, max: 1000000 },
}) {
  const handleLocationChange = useCallback((location) => {
    onFilterChange('city', location === filters.city ? '' : location)
  }, [filters.city, onFilterChange])

  const handleSportChange = useCallback((sport) => {
    onFilterChange('sport_type', sport === filters.sport_type ? '' : sport)
  }, [filters.sport_type, onFilterChange])

  const handleStatusChange = useCallback((status) => {
    onFilterChange('status', status === filters.status ? '' : status)
  }, [filters.status, onFilterChange])

  const handleSortChange = useCallback((sort) => {
    onFilterChange('sort', sort)
  }, [onFilterChange])

  const hasActiveFilters = Object.values(filters).some(v => v && v !== '')

  const sports = ['Bóng đá', 'Bóng rổ', 'Bóng chuyền', 'Cầu lông']
  const statuses = ['Đang hoạt động', 'Tạm ngưng']

  return (
    <aside className="lg:sticky lg:top-20 lg:h-fit space-y-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-950">Bộ lọc</h3>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 transition"
          >
            <X size={16} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Sắp xếp</h4>
        <select
          value={filters.sort || 'newest'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-[12px] border border-slate-200 bg-white text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="price_asc">Giá tăng</option>
          <option value="price_desc">Giá giảm</option>
          <option value="rating">Rating cao nhất</option>
          <option value="bookings">Đặt nhiều nhất</option>
        </select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Địa điểm</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {locations.map((location) => (
            <label key={location} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.city === location}
                onChange={() => handleLocationChange(location)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sport Type */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Loại sân</h4>
        <div className="space-y-2">
          {sports.map((sport) => (
            <label key={sport} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.sport_type === sport}
                onChange={() => handleSportChange(sport)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">{sport}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700">Trạng thái</h4>
        <div className="space-y-2">
          {statuses.map((status) => (
            <label key={status} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.status === (status === 'Đang hoạt động' ? 1 : 0)}
                onChange={() => handleStatusChange(status === 'Đang hoạt động' ? 1 : 0)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-700">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700">Giá</h4>
        <div className="space-y-2">
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={filters.maxPrice || priceRange.max}
            onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Tối đa: <span className="font-semibold text-slate-900">{(filters.maxPrice || priceRange.max).toLocaleString()}₫</span></span>
          </div>
        </div>
      </div>
    </aside>
  )
}
