import React from 'react'

const sortLabel = (label, field, sortBy, sortDirection, onSort) => {
  const active = sortBy === field
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900"
    >
      {label}
      <span className={`text-[10px] ${active ? 'text-slate-700' : 'text-slate-400'}`}>{active ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</span>
    </button>
  )
}

export default function VenueTable({
  venues,
  loading,
  selectedIds,
  onSelectAll,
  onSelectVenue,
  onSelectRow,
  sortBy,
  sortDirection,
  onSort,
  page,
  pageSize,
  setPage,
  pageCount,
  totalCount,
}) {
  const allSelected = venues.length > 0 && selectedIds.length === venues.length
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalCount)

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full w-full table-auto text-left text-sm text-slate-700">
          <thead className="sticky top-0 z-10 bg-white text-slate-500 shadow-sm">
            <tr className="border-b border-slate-200">
              <th className="whitespace-nowrap px-5 py-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                  />
                </label>
              </th>
              <th className="whitespace-nowrap px-5 py-4">{sortLabel('Tên sân', 'venue_name', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-5 py-4">{sortLabel('Khu vực', 'city', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-5 py-4">Sân con</th>
              <th className="whitespace-nowrap px-5 py-4">{sortLabel('Doanh thu', 'revenue', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-5 py-4">Trạng thái</th>
              <th className="whitespace-nowrap px-5 py-4">{sortLabel('Ngày tạo', 'created_at', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-5 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse bg-slate-50">
                  {Array.from({ length: 8 }).map((__, idx) => (
                    <td key={idx} className="px-5 py-5">
                      <div className="h-4 w-full rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : venues.length > 0 ? (
              venues.map((venue) => {
                const active = Number(venue.status) === 1
                return (
                  <tr key={venue.venue_id} className="border-b border-slate-200 transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(venue.venue_id)}
                        onChange={(e) => onSelectVenue(venue.venue_id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => onSelectRow(venue)} className="text-left text-sm font-semibold text-slate-900 transition hover:text-blue-600">
                        {venue.venue_name}
                      </button>
                      <p className="text-xs text-slate-500">{venue.owner_name || `Owner #${venue.owner_id || '—'}`}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{venue.city || 'Chưa xác định'}</td>
                    <td className="px-5 py-4">{venue.courts_count ?? 0}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(venue.revenue || 0)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {active ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{venue.created_at ? new Date(venue.created_at).toLocaleDateString('vi-VN') : '—'}</td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => onSelectRow(venue)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                  Không có kết quả phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!loading && venues.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-semibold text-slate-900">{startItem}</span> - <span className="font-semibold text-slate-900">{endItem}</span> trên <span className="font-semibold text-slate-900">{totalCount.toLocaleString()}</span> sân
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: pageCount }, (_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPage(idx + 1)}
                className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${page === idx + 1 ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(Math.min(pageCount, page + 1))}
              disabled={page === pageCount}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
