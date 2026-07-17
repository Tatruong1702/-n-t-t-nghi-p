import React, { useEffect, useMemo, useState } from 'react'
import { Search, Plus, PencilLine, Trash2, Layers3, Sparkles } from 'lucide-react'
import courtApi from '../../../api/courtApi'

const CourtManager = React.memo(function CourtManager({ venue, isOpen, onClose }) {
  const [courts, setCourts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !venue?.venue_id) return
    const loadCourts = async () => {
      try {
        setLoading(true)
        const response = await courtApi.list({ venue_id: venue.venue_id })
        setCourts(response?.data?.data?.courts || [])
      } finally {
        setLoading(false)
      }
    }
    loadCourts()
  }, [isOpen, venue?.venue_id])

  const filteredCourts = useMemo(() => {
    const keyword = search.toLowerCase()
    return courts.filter((court) => `${court.court_name} ${court.sport_type}`.toLowerCase().includes(keyword))
  }, [courts, search])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[28px] border border-white/40 bg-white/90 p-6 shadow-[0_30px_120px_-35px_rgba(15,23,42,0.55)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
              <Layers3 className="h-4 w-4" /> Quản lý sân con
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">{venue?.venue_name}</h3>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">✕</button>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Search className="h-4 w-4" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm sân con" className="w-full bg-transparent outline-none" />
          </label>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800" disabled={courts.length >= 16}>
            <Plus className="h-4 w-4" /> Thêm sân con
          </button>
        </div>

        {courts.length >= 16 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            Sân này đã đạt giới hạn tối đa 16 sân con
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="h-28 animate-pulse rounded-[22px] bg-slate-200" />)
          ) : filteredCourts.length > 0 ? (
            filteredCourts.map((court) => (
              <div key={court.court_id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{court.court_name}</h4>
                    <p className="mt-1 text-sm text-slate-500">{court.sport_type || 'Chưa rõ'}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${court.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {court.status === 1 ? 'Đang hoạt động' : 'Tạm ngưng'}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span>{court.price_per_hour ? `${court.price_per_hour.toLocaleString()}đ/giờ` : 'Chưa có giá'}</span>
                  <div className="flex gap-2">
                    <button className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"><PencilLine className="h-4 w-4" /></button>
                    <button className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
              <Sparkles className="mx-auto mb-3 h-6 w-6 text-slate-400" /> Không có sân con nào phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default CourtManager
