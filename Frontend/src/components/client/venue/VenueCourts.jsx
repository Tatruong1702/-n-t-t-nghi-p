import React, { useMemo, useState } from 'react'
import CourtCard from './CourtCard'

const VenueCourts = React.memo(({ courts = [], venueId }) => {
  const [sortBy, setSortBy] = useState('name')
  const [filterType, setFilterType] = useState('')

  const filteredAndSortedCourts = useMemo(() => {
    let filtered = courts

    if (filterType) {
      filtered = filtered.filter((court) => court.sport_type === filterType)
    }

    let sorted = [...filtered]
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => (a.price_per_hour || 0) - (b.price_per_hour || 0))
        break
      case 'price_desc':
        sorted.sort((a, b) => (b.price_per_hour || 0) - (a.price_per_hour || 0))
        break
      case 'name':
      default:
        sorted.sort((a, b) => (a.court_name || '').localeCompare(b.court_name || ''))
        break
    }

    return sorted
  }, [courts, sortBy, filterType])

  const sportTypes = useMemo(() => {
    const types = [...new Set(courts.map((c) => c.sport_type).filter(Boolean))]
    return types.sort()
  }, [courts])

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm border border-slate-200">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Sân con</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Danh sách sân</h2>
      </div>

      {courts.length > 0 && (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Sắp xếp:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Tên sân</option>
                <option value="price_asc">Giá (thấp → cao)</option>
                <option value="price_desc">Giá (cao → thấp)</option>
              </select>
            </div>

            {sportTypes.length > 0 && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Loại sân:
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  {sportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {filteredAndSortedCourts.length} sân
          </span>
        </div>
      )}

      {filteredAndSortedCourts.length ? (
        <div className="space-y-5">
          {filteredAndSortedCourts.map((court) => (
            <CourtCard
              key={court.court_id || court.id}
              court={court}
              venueId={venueId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-lg text-slate-600">
            {filterType ? 'Không tìm thấy sân với bộ lọc này' : 'Chưa có sân con cho sân này'}
          </p>
        </div>
      )}
    </div>
  )
})

VenueCourts.displayName = 'VenueCourts'

export default VenueCourts
