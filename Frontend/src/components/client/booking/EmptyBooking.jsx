import React from 'react'

export default function EmptyBooking() {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-600">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Booking</p>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">Chưa có sân con để đặt</h2>
      <p className="mt-3 max-w-xl mx-auto text-sm leading-6">
        Xin lỗi, hiện tại chưa có sân con phù hợp trong địa điểm này. Vui lòng quay lại sau hoặc chọn sân khác.
      </p>
    </div>
  )
}
