import React from 'react'
import { PlusCircle, Sparkles } from 'lucide-react'

const EmptyCourt = React.memo(function EmptyCourt({ onCreate }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300/70 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-10 text-center shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg">
        <Sparkles className="h-8 w-8" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-slate-900">Chưa có sân con nào</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">Bắt đầu bằng việc thêm sân con đầu tiên và quản lý vận hành của bạn ngay trong một workspace hiện đại.</p>
      <button onClick={onCreate} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
        <PlusCircle className="h-4 w-4" /> Thêm sân con đầu tiên
      </button>
    </div>
  )
})

export default EmptyCourt
