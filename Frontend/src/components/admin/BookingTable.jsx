import React from 'react'

const statusClasses = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
}

const sortLabel = (label, field, sortBy, sortDirection, onSort) => {
  const active = sortBy === field
  return (
    <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 transition hover:text-slate-900">
      {label}
      <span className={`text-[10px] ${active ? 'text-slate-700' : 'text-slate-400'}`}>{active ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}</span>
    </button>
  )
}

export default function BookingTable({
  bookings,
  loading,
  selectedIds,
  onSelectAll,
  onSelectBooking,
  onRowClick,
  sortBy,
  sortDirection,
  onSort,
  page,
  pageSize,
  setPage,
  pageCount,
  totalCount,
  onAction,
}) {
  const allSelected = bookings.length > 0 && selectedIds.length === bookings.length
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalCount)

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full w-full table-auto text-left text-sm text-slate-700">
          <thead className="sticky top-0 z-10 bg-white text-slate-500 shadow-sm">
            <tr className="border-b border-slate-200">
              <th className="whitespace-nowrap px-5 py-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={allSelected} onChange={(e) => onSelectAll(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500" />
                </label>
              </th>
              <th className="whitespace-nowrap px-5 py-4">{sortLabel('Booking', 'booking_date', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-5 py-4">{sortLabel('Khách hàng', 'user_name', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-5 py-4">Sân</th>
              <th className="whitespace-nowrap px-5 py-4">Khu vực</th>
              <th className="whitespace-nowrap px-5 py-4">{sortLabel('Giá', 'total_price', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-5 py-4">{sortLabel('Trạng thái', 'status', sortBy, sortDirection, onSort)}</th>
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
            ) : bookings.length > 0 ? (
              bookings.map((booking) => {
                const active = statusClasses[booking.status] || 'bg-slate-100 text-slate-700'
                return (
                  <tr key={booking.booking_id} className="border-b border-slate-200 transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <input type="checkbox" checked={selectedIds.includes(booking.booking_id)} onChange={(e) => onSelectBooking(booking.booking_id, e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500" />
                    </td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => onRowClick(booking)} className="text-left text-sm font-semibold text-slate-900 transition hover:text-blue-600">
                        #{booking.booking_id} • {booking.booking_date}
                      </button>
                      <p className="text-xs text-slate-500">{booking.start_time} - {booking.end_time}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">{booking.user_name || booking.User?.full_name || 'Khách'}</td>
                    <td className="px-5 py-4 text-slate-700">{booking.court_name || booking.Court?.court_name || 'Sân'}</td>
                    <td className="px-5 py-4 text-slate-700">{booking.venue_name || booking.venue?.venue_name || 'Khu vực'}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(booking.total_price || 0))}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${active}`}>{booking.status || 'unknown'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => onRowClick(booking)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                          Xem
                        </button>
                        <button type="button" onClick={() => onAction('confirm', booking)} disabled={booking.status !== 'pending'} className="rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40">
                          Confirm
                        </button>
                        <button type="button" onClick={() => onAction('complete', booking)} disabled={booking.status !== 'confirmed'} className="rounded-2xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40">
                          Complete
                        </button>
                        <button type="button" onClick={() => onAction('cancel', booking)} disabled={booking.status === 'cancelled'} className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                  Chưa có booking phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && bookings.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-semibold text-slate-900">{startItem}</span> - <span className="font-semibold text-slate-900">{endItem}</span> trên <span className="font-semibold text-slate-900">{totalCount.toLocaleString()}</span> booking
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
              Trước
            </button>
            {Array.from({ length: pageCount }, (_, idx) => (
              <button key={idx} type="button" onClick={() => setPage(idx + 1)} className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${page === idx + 1 ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                {idx + 1}
              </button>
            ))}
            <button type="button" onClick={() => setPage(Math.min(pageCount, page + 1))} disabled={page === pageCount} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50">
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
