import React, { useCallback, useMemo } from 'react'
import ImageUploader from './ImageUploader'
import OwnerSelect from './OwnerSelect'
import CourtManager from './CourtManager'

const validate = (venue, courts) => {
  const errors = {}
  if (!venue.venue_name || !venue.venue_name.trim()) errors.venue_name = 'Tên sân là bắt buộc.'
  if (!venue.address || !venue.address.trim()) errors.address = 'Địa chỉ là bắt buộc.'
  if (!venue.city || !venue.city.trim()) errors.city = 'Khu vực là bắt buộc.'
  if (!venue.owner_id) errors.owner_id = 'Chủ sân là bắt buộc.'
  if (!courts || courts.length === 0) errors.courts = 'Phải có ít nhất 1 sân con.'
  return errors
}

export default function VenueModal({
  isOpen,
  mode,
  venue,
  onClose,
  onChange,
  onSubmit,
  loading,
  errors,
  imagePreview,
  onImageChange,
  onRemoveImage,
  courts = [],
  onCourtsChange,
}) {
  const title = mode === 'edit' ? 'Chỉnh sửa sân' : 'Thêm sân mới'
  const computedErrors = useMemo(() => validate(venue, courts), [venue, courts])

  const handleImageChange = useCallback(
    (image) => {
      onImageChange(image)
    },
    [onImageChange]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">Quản lý thông tin sân bóng, sân con và media.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">Thông tin cơ bản</h4>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Tên sân</span>
                <input
                  type="text"
                  value={venue.venue_name || ''}
                  onChange={(e) => onChange('venue_name', e.target.value)}
                  placeholder="Tên sân bóng"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
                {(errors?.venue_name || computedErrors.venue_name) && (
                  <p className="text-xs text-red-600">{errors?.venue_name || computedErrors.venue_name}</p>
                )}
              </label>

              <OwnerSelect value={venue.owner_id || ''} onChange={(value) => onChange('owner_id', value)} loading={loading} />
              {(errors?.owner_id || computedErrors.owner_id) && (
                <p className="text-xs text-red-600">{errors?.owner_id || computedErrors.owner_id}</p>
              )}

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Địa chỉ</span>
                <input
                  type="text"
                  value={venue.address || ''}
                  onChange={(e) => onChange('address', e.target.value)}
                  placeholder="Số nhà, đường phố"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
                {(errors?.address || computedErrors.address) && (
                  <p className="text-xs text-red-600">{errors?.address || computedErrors.address}</p>
                )}
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Khu vực / Thành phố</span>
                <input
                  type="text"
                  value={venue.city || ''}
                  onChange={(e) => onChange('city', e.target.value)}
                  placeholder="Tp. Hồ Chí Minh, Hà Nội, ..."
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
                {(errors?.city || computedErrors.city) && (
                  <p className="text-xs text-red-600">{errors?.city || computedErrors.city}</p>
                )}
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Trạng thái</span>
                <select
                  value={venue.status || 1}
                  onChange={(e) => onChange('status', Number(e.target.value))}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Tạm dừng</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Mô tả</span>
                <textarea
                  value={venue.description || ''}
                  onChange={(e) => onChange('description', e.target.value)}
                  placeholder="Mô tả ngắn về sân bóng"
                  rows={3}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </label>
            </div>

            {/* Quản lý sân con */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Quản lý sân con</h4>
              <CourtManager courts={courts} onChange={onCourtsChange} errors={errors} />
              {computedErrors.courts && <p className="text-xs text-red-600">{computedErrors.courts}</p>}
            </div>
          </div>

          {/* Ảnh sân */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900">Ảnh sân</h4>
            <ImageUploader onImageChange={handleImageChange} preview={imagePreview} onRemove={onRemoveImage} />
            {errors?.image && <p className="text-xs text-red-600">{errors.image}</p>}
          </div>
        </div>

        {errors?.api && (
          <div className="border-t border-red-200 bg-red-50 px-6 py-3">
            <p className="text-sm text-red-700">{errors.api}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || Object.keys(computedErrors).length > 0}
            className="w-full rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? 'Đang lưu...' : mode === 'edit' ? 'Lưu thay đổi' : 'Thêm sân'}
          </button>
        </div>
      </div>
    </div>
  )
}

