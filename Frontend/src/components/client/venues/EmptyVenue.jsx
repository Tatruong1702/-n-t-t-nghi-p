import React from 'react'
import { Search, RotateCcw } from 'lucide-react'

export default function EmptyVenue({ onReset }) {
  return (
    <div className="rounded-[24px] border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
      <div className="space-y-4">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
          <Search size={40} className="text-slate-500" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-950">Không tìm thấy sân phù hợp</h3>
          <p className="mt-2 text-sm text-slate-600">
            Hãy thử thay đổi các bộ lọc hoặc tìm kiếm lại
          </p>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-[12px] bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          <RotateCcw size={18} />
          Xóa bộ lọc
        </button>
      </div>
    </div>
  )
}
