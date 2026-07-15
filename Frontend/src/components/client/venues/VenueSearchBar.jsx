import React, { useCallback, useMemo } from 'react'
import { Search, MapPin, Grid3X3, List } from 'lucide-react'

export default function VenueSearchBar({
  searchTerm,
  onSearchChange,
  onLocationChange,
  onViewChange,
  viewType = 'grid',
  locations = [],
}) {
  const handleSearch = useCallback((e) => {
    onSearchChange(e.target.value)
  }, [onSearchChange])

  const handleLocationChange = useCallback((e) => {
    onLocationChange(e.target.value)
  }, [onLocationChange])

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search & Location */}
          <div className="flex-1 flex gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Tìm tên sân..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-slate-200 bg-slate-50 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Location Filter */}
            <select
              onChange={handleLocationChange}
              className="px-4 py-2.5 rounded-[12px] border border-slate-200 bg-slate-50 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 min-w-[160px]"
            >
              <option value="">Tất cả địa điểm</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewChange('grid')}
              className={`p-2.5 rounded-[12px] transition-all ${
                viewType === 'grid'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="Grid view"
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`p-2.5 rounded-[12px] transition-all ${
                viewType === 'list'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title="List view"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
