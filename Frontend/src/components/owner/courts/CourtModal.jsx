import React, { useEffect, useMemo, useState } from 'react'
import { X, Sparkles } from 'lucide-react'

const initialForm = {
  court_name: '',
  venue_id: '',
  sport_type: '5v5',
  price_per_hour: '',
  image: '',
  status: 1,
  description: '',
}

const CourtModal = React.memo(function CourtModal({ isOpen, mode, court, venues, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setForm(
        court
          ? {
              court_name: court.court_name || '',
              venue_id: court.venue_id || '',
              sport_type: court.sport_type || '5v5',
              price_per_hour: court.price_per_hour || '',
              image: court.image || '',
              status: court.status ?? 1,
              description: court.description || '',
            }
          : { ...initialForm, venue_id: venues[0]?.venue_id || '' }
      )
      setErrors({})
    }
  }, [isOpen, court, venues])

  const validation = useMemo(() => {
    const next = {}
    if (!form.court_name?.trim()) next.court_name = 'Tên sân con là bắt buộc'
    if (!form.venue_id) next.venue_id = 'Vui lòng chọn sân chính'
    if (!form.price_per_hour || Number(form.price_per_hour) <= 0) next.price_per_hour = 'Giá phải lớn hơn 0'
    return next
  }, [form])

  useEffect(() => { setErrors(validation) }, [validation])

  if (!isOpen) return null

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = { ...validation }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({ ...form, price_per_hour: Number(form.price_per_hour) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/40 bg-white/90 p-6 shadow-[0_30px_120px_-35px_rgba(15,23,42,0.55)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
              <Sparkles className="h-4 w-4" /> {mode === 'create' ? 'Thêm sân con' : 'Sửa sân con'}
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">{mode === 'create' ? 'Tạo sân con mới' : 'Cập nhật sân con'}</h3>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Tên sân con</span>
            <input value={form.court_name} onChange={(e) => handleChange('court_name', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            {errors.court_name && <p className="mt-1 text-sm text-rose-600">{errors.court_name}</p>}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">Sân chính</span>
            <select value={form.venue_id} onChange={(e) => handleChange('venue_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400">
              {venues.map((venue) => <option key={venue.venue_id} value={venue.venue_id}>{venue.venue_name}</option>)}
            </select>
            {errors.venue_id && <p className="mt-1 text-sm text-rose-600">{errors.venue_id}</p>}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">Loại sân</span>
            <select value={form.sport_type} onChange={(e) => handleChange('sport_type', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400">
              <option value="5v5">5v5</option>
              <option value="7v7">7v7</option>
              <option value="11v11">11v11</option>
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">Giá theo giờ</span>
            <input type="number" value={form.price_per_hour} onChange={(e) => handleChange('price_per_hour', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
            {errors.price_per_hour && <p className="mt-1 text-sm text-rose-600">{errors.price_per_hour}</p>}
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-slate-700">Trạng thái</span>
            <select value={form.status} onChange={(e) => handleChange('status', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400">
              <option value={1}>Available</option>
              <option value={2}>Maintenance</option>
              <option value={0}>Closed</option>
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">URL hình ảnh</span>
            <input value={form.image} onChange={(e) => handleChange('image', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Mô tả</span>
            <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-400" />
          </label>

          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Hủy</button>
            <button type="submit" disabled={loading} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70">
              {loading ? 'Đang lưu...' : mode === 'create' ? 'Tạo sân con' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

export default CourtModal
