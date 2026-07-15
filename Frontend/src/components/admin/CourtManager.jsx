import React, { useCallback, useState } from 'react'

const sportTypes = ['5 người', '7 người', '11 người']

export default function CourtManager({ courts, onChange, errors }) {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    court_name: '',
    sport_type: '',
    price_per_hour: '',
    status: 1,
    image: '',
  })

  const handleAdd = useCallback(() => {
    if (!formData.court_name.trim()) {
      alert('Tên sân con bắt buộc')
      return
    }
    if (!formData.sport_type) {
      alert('Loại sân bắt buộc')
      return
    }
    if (!formData.price_per_hour || Number(formData.price_per_hour) <= 0) {
      alert('Giá sân phải lớn hơn 0')
      return
    }

    const newCourt = {
      ...formData,
      court_id: editingId || `temp_${Date.now()}`,
      price_per_hour: Number(formData.price_per_hour),
      status: Number(formData.status),
    }

    if (editingId) {
      onChange(courts.map((c) => (c.court_id === editingId ? newCourt : c)))
      setEditingId(null)
    } else {
      onChange([...courts, newCourt])
    }

    setFormData({
      court_name: '',
      sport_type: '',
      price_per_hour: '',
      status: 1,
      image: '',
    })
  }, [formData, editingId, courts, onChange])

  const handleEdit = useCallback((court) => {
    setFormData(court)
    setEditingId(court.court_id)
  }, [])

  const handleDelete = useCallback(
    (courtId) => {
      onChange(courts.filter((c) => c.court_id !== courtId))
      if (editingId === courtId) setEditingId(null)
    },
    [courts, editingId, onChange]
  )

  const handleCancel = useCallback(() => {
    setEditingId(null)
    setFormData({
      court_name: '',
      sport_type: '',
      price_per_hour: '',
      status: 1,
      image: '',
    })
  }, [])

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          {editingId ? 'Sửa sân con' : 'Thêm sân con'}
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Tên sân con"
            value={formData.court_name}
            onChange={(e) => setFormData((prev) => ({ ...prev, court_name: e.target.value }))}
            className="rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />

          <select
            value={formData.sport_type}
            onChange={(e) => setFormData((prev) => ({ ...prev, sport_type: e.target.value }))}
            className="rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">Loại sân</option>
            {sportTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Giá theo giờ"
            value={formData.price_per_hour}
            onChange={(e) => setFormData((prev) => ({ ...prev, price_per_hour: e.target.value }))}
            className="rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />

          <select
            value={formData.status}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: Number(e.target.value) }))}
            className="rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Tạm dừng</option>
          </select>

          <input
            type="text"
            placeholder="URL ảnh sân con (tuỳ chọn)"
            value={formData.image}
            onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
            className="sm:col-span-2 rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            {editingId ? 'Cập nhật' : 'Thêm sân'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      {errors?.courts && <p className="text-xs text-red-600">{errors.courts}</p>}

      <div className="space-y-3">
        {courts.length === 0 ? (
          <p className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 text-center">
            Chưa có sân con. Hãy thêm ít nhất 1 sân con.
          </p>
        ) : (
          courts.map((court) => (
            <div key={court.court_id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{court.court_name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {court.sport_type} • {Number(court.price_per_hour || 0).toLocaleString()} ₫/giờ
                  </p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-semibold ${
                    Number(court.status) === 1
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {Number(court.status) === 1 ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(court)}
                    className="rounded-3xl bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 text-xs font-semibold transition"
                  >
                    <i className="ti ti-edit" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(court.court_id)}
                    className="rounded-3xl bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 text-xs font-semibold transition"
                  >
                    <i className="ti ti-trash" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
