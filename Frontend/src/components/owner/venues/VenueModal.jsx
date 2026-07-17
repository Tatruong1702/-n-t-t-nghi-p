import React, { useEffect, useMemo, useState } from 'react'
import { X, Sparkles } from 'lucide-react'

const initialForm = {
  venue_name: '',
  description: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  image: '',
  status: 1,
}

const VenueModal = React.memo(function VenueModal({ isOpen, mode, venue, currentUser, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setForm(
        venue
          ? {
              venue_name: venue.venue_name || '',
              description: venue.description || '',
              address: venue.address || '',
              city: venue.city || '',
              phone: venue.phone || '',
              email: venue.email || '',
              image: venue.image || '',
              status: venue.status ?? 1,
            }
          : { ...initialForm, owner_id: currentUser?.user_id }
      )
      setErrors({})
    }
  }, [isOpen, venue, currentUser])

  const validation = useMemo(() => {
    const next = {}
    if (!form.venue_name?.trim()) next.venue_name = 'Tên sân là bắt buộc'
    if (!form.address?.trim()) next.address = 'Địa chỉ là bắt buộc'
    if (!form.phone?.trim()) next.phone = 'Số điện thoại là bắt buộc'
    if (!form.email?.trim()) next.email = 'Email là bắt buộc'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Email không hợp lệ'
    return next
  }, [form])

  useEffect(() => {
    setErrors(validation)
  }, [validation])

  if (!isOpen) return null

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {
      ...validation,
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ ...form, owner_id: currentUser?.user_id })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/40 bg-white/90 p-6 shadow-[0_30px_120px_-35px_rgba(15,23,42,0.55)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
              <Sparkles className="h-4 w-4" />
              {mode === 'create' ? 'Thêm sân mới' : 'Chỉnh sửa sân'}
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">{mode === 'create' ? 'Tạo sân mới' : 'Cập nhật thông tin sân'}</h3>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Tên sân</span>
            <input value={form.venue_name} onChange={(e) => handleChange('venue_name', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            {errors.venue_name && <p className="mt-1 text-sm text-rose-600">{errors.venue_name}</p>}
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Mô tả</span>
            <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Địa chỉ</span>
            <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            {errors.address && <p className="mt-1 text-sm text-rose-600">{errors.address}</p>}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">Thành phố</span>
            <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">Số điện thoại</span>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            {errors.phone && <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">URL ảnh</span>
            <input value={form.image} onChange={(e) => handleChange('image', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">Trạng thái</span>
            <select value={form.status} onChange={(e) => handleChange('status', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400">
              <option value={1}>Đang hoạt động</option>
              <option value={0}>Tạm ngưng</option>
            </select>
          </label>

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Hủy</button>
            <button type="submit" disabled={loading} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70">
              {loading ? 'Đang lưu...' : mode === 'create' ? 'Tạo sân' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

export default VenueModal
