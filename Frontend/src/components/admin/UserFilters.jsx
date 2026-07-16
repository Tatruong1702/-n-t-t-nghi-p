import React from 'react'

export default function UserFilters({
  searchText,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onResetFilters,
}) {
  return (
    <div className="rounded-3xl border border-slate-border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Tìm kiếm người dùng
          </label>
          <div className="relative rounded-2xl border border-slate-border bg-slate-50 px-4 py-3 shadow-sm focus-within:border-slate-400">
            <i className="ti ti-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo tên, email..."
              className="w-full bg-transparent pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Vai trò
            </label>
            <select
              value={roleFilter}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="owner">Chủ sở hữu</option>
              <option value="customer">Khách hàng</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Không hoạt động</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
