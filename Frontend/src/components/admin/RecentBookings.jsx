import React, { useMemo, useState } from 'react'

const statusClasses = {
  completed: 'bg-emerald-100 text-emerald-700',
  confirmed: 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
}

export default function RecentBookings({ bookings = [], loading }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()
    return bookings.filter((booking) => {
      const text = `${booking.user_name} ${booking.court_name} ${booking.venue_name} ${booking.phone}`.toLowerCase()
      const matchesSearch = !query || text.includes(query)
      const matchesStatus = !statusFilter || booking.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [bookings, search, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentRows = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page])

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Recent Bookings</h2>
          <p className="mt-1 text-sm text-slate-500">Danh sách booking mới nhất với thông tin gọn, rõ.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">{filtered.length} kết quả</span>
          <button
            type="button"
            onClick={() => setPage(1)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Làm mới
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <input
          type="search"
          placeholder="Tìm kiếm khách hàng, sân hoặc địa điểm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="completed">Hoàn tất</option>
          <option value="confirmed">Xác nhận</option>
          <option value="pending">Chờ</option>
          <option value="cancelled">Hủy</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[1.8rem] border border-slate-200 bg-slate-50">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="sticky top-0 bg-white text-slate-500 shadow-sm">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-4">Khách hàng</th>
              <th className="px-4 py-4">Sân / Địa điểm</th>
              <th className="px-4 py-4">Ngày</th>
              <th className="px-4 py-4">Giờ</th>
              <th className="px-4 py-4">Tổng</th>
              <th className="px-4 py-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-slate-200">
                  {Array.from({ length: 6 }).map((__, idx) => (
                    <td key={idx} className="px-4 py-5">
                      <div className="h-4 w-full rounded-2xl bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : currentRows.length > 0 ? (
              currentRows.map((booking, index) => (
                <tr key={booking.booking_id || index} className="border-b border-slate-200 transition hover:bg-slate-100">
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-900">{booking.user_name || 'Khách lạ'}</div>
                    <div className="mt-1 text-xs text-slate-500">{booking.phone || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{booking.court_name}</div>
                    <div className="mt-1 text-xs text-slate-500">{booking.venue_name}</div>
                  </td>
                  <td className="px-4 py-4">{booking.booking_date}</td>
                  <td className="px-4 py-4">{booking.start_time} - {booking.end_time}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{booking.total_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${statusClasses[booking.status] || 'bg-slate-100 text-slate-600'}`}>
                      {booking.status || 'Chưa rõ'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                  Không có booking phù hợp. Vui lòng thử lại hoặc tải lại dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && currentRows.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Hiển thị {Math.min((page - 1) * pageSize + 1, filtered.length)} - {Math.min(page * pageSize, filtered.length)} trên {filtered.length} booking</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>
            {Array.from({ length: pageCount }, (_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPage(idx + 1)}
                className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${page === idx + 1 ? 'bg-blue-600 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(Math.min(pageCount, page + 1))}
              disabled={page === pageCount}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
