import React, { memo } from 'react'
import { PlusCircle } from 'lucide-react'

const EmptyState = memo(function EmptyState() {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <PlusCircle size={32} />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-slate-900">Bạn chưa có sân nào</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">Bắt đầu bằng việc thêm sân đầu tiên để quản lý booking, doanh thu và khách hàng một cách chuyên nghiệp.</p>
      <button className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">
        Thêm sân đầu tiên
      </button>
    </div>
  )
})

export default EmptyState
