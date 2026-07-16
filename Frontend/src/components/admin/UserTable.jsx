import React from 'react'

const sortLabel = (label, field, sortBy, sortDirection, onSort) => {
  const active = sortBy === field
  const icon = active ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-slate-900"
    >
      {label}
      <span className={`text-[10px] ${active ? 'text-slate-700' : 'text-slate-400'}`}>{icon}</span>
    </button>
  )
}

export default function UserTable({
  users,
  loading,
  selectedUserIds,
  onSelectAll,
  onSelectUser,
  onDeleteUser,
  onToggleStatus,
  onEditUser,
  onViewUser,
  onSort,
  sortBy,
  sortDirection,
  page,
  pageSize,
  setPage,
  pageCount,
  totalCount,
}) {
  const allSelected = users.length > 0 && selectedUserIds.length === users.length
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, totalCount)

  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-border bg-white shadow-sm">
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
              <th className="whitespace-nowrap px-4 py-4">{sortLabel('Người dùng', 'full_name', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-4 py-4">{sortLabel('Email', 'email', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-4 py-4">Vai trò</th>
              <th className="whitespace-nowrap px-4 py-4">Trạng thái</th>
              <th className="whitespace-nowrap px-4 py-4">{sortLabel('Ngày tạo', 'created_at', sortBy, sortDirection, onSort)}</th>
              <th className="whitespace-nowrap px-4 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="animate-pulse bg-slate-50">
                  <td className="px-4 py-5">
                    <div className="h-4 w-4 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-5">
                    <div className="h-4 w-44 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-5">
                    <div className="h-4 w-52 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-5">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-5">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-5">
                    <div className="h-4 w-32 rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-5">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : users.length > 0 ? (
              users.map((user, index) => {
                const name = user.full_name || user.username || 'Người dùng'
                const initials = name
                  .split(' ')
                  .filter(Boolean)
                  .map((part) => part.charAt(0).toUpperCase())
                  .slice(0, 2)
                  .join('')
                const roleLabel = user.role === 'admin' ? 'Quản trị viên' : user.role === 'owner' ? 'Chủ sở hữu' : 'Khách hàng'
                const active = Number(user.status) === 1

                return (
                  <tr
                    key={user.user_id}
                    className={`border-b border-slate-200 transition hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                  >
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.user_id)}
                        onChange={(e) => onSelectUser(user.user_id, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{name}</p>
                          <p className="text-xs text-slate-400">ID #{user.user_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{user.email || 'Không có'}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {roleLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {active ? 'Hoạt động' : 'Bị khoá'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{new Date(user.created_at).toLocaleDateString('vi-VN') || '---'}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewUser(user)}
                          className="rounded-2xl border border-slate-border bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Chi tiết
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditUser(user)}
                          className="rounded-2xl border border-slate-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleStatus(user)}
                          className="rounded-2xl border border-slate-border bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          {active ? 'Khoá' : 'Mở' }
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteUser(user)}
                          className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                  <div className="mx-auto max-w-xl space-y-3">
                    <p className="text-lg font-semibold text-slate-900">Không có người dùng phù hợp.</p>
                    <p className="text-sm text-slate-500">Thử thay đổi tiêu chí tìm kiếm hoặc đặt lại bộ lọc để xem tất cả người dùng.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && users.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị <span className="font-semibold text-slate-900">{startItem}</span> - <span className="font-semibold text-slate-900">{endItem}</span> trên tổng <span className="font-semibold text-slate-900">{totalCount.toLocaleString()}</span> người dùng
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-2xl border border-slate-border bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${pageNumber === page ? 'bg-navy-600 text-white' : 'border border-slate-border bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(Math.min(pageCount, page + 1))}
              disabled={page === pageCount}
              className="rounded-2xl border border-slate-border bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
