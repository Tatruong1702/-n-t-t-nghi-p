import React from 'react'

const roleOptions = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'owner', label: 'Chủ sở hữu' },
  { value: 'admin', label: 'Quản trị viên' },
]

export default function UserModal({
  isOpen,
  mode,
  user,
  errors,
  onClose,
  onChange,
  onSave,
  onEditMode,
  saving,
}) {
  if (!isOpen) return null

  const isViewMode = mode === 'view'
  const title = isViewMode ? 'Chi tiết người dùng' : mode === 'edit' ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'
  const buttonLabel = mode === 'add' ? 'Thêm người dùng' : 'Lưu thay đổi'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-border p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {isViewMode
                ? 'Xem thông tin tài khoản và trạng thái.'
                : 'Quản lý thông tin người dùng, vai trò và kích hoạt tài khoản.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-border bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Họ và tên</span>
              <input
                type="text"
                value={user.full_name || ''}
                onChange={(e) => onChange('full_name', e.target.value)}
                disabled={isViewMode}
                className="w-full rounded-2xl border border-slate-border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              {errors.full_name && <p className="text-xs text-red-600">{errors.full_name}</p>}
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Email</span>
              <input
                type="email"
                value={user.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                disabled={isViewMode}
                className="w-full rounded-2xl border border-slate-border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Vai trò</span>
              <select
                value={user.role || 'customer'}
                onChange={(e) => onChange('role', e.target.value)}
                disabled={isViewMode}
                className="w-full rounded-2xl border border-slate-border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Trạng thái</span>
              <input
                type="text"
                value={user.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                disabled
                className="w-full rounded-2xl border border-slate-border bg-slate-50 px-4 py-3 text-sm text-slate-900"
              />
            </label>
          </div>

          {mode !== 'view' && (
            <div className="space-y-2 text-sm text-slate-700">
              <label>Mat khau {mode === 'edit' ? '(tuỳ chọn)' : ''}</label>
              <input
                type="password"
                value={user.password || ''}
                onChange={(e) => onChange('password', e.target.value)}
                disabled={isViewMode}
                placeholder={mode === 'edit' ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'}
                className="w-full rounded-2xl border border-slate-border bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>
          )}

          {isViewMode && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tạo lúc</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{user.created_at || 'Không có dữ liệu'}</p>
              </div>
              <div className="rounded-3xl border border-slate-border bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Số điện thoại</p>
                <p className="mt-2 text-sm font-medium text-slate-900">{user.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-border px-6 py-4 sm:flex-row sm:justify-end">
          {isViewMode ? (
            <button
              type="button"
              onClick={onEditMode}
              className="w-full rounded-2xl bg-navy-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 sm:w-auto"
            >
              Chỉnh sửa
            </button>
          ) : (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="w-full rounded-2xl bg-navy-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              {saving ? 'Đang lưu...' : buttonLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl border border-slate-border bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}
