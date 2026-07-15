import React from 'react'
import { Link } from 'react-router-dom'

export default React.memo(function EmptyBookings() {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-900/5">
      <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-slate-100 text-4xl text-slate-500">
        ⚽
      </div>
      <h2 className="mt-8 text-3xl font-semibold text-slate-950">Bạn chưa có booking nào</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Khám phá sân bóng ngay để đặt khung giờ yêu thích và tiếp tục niềm đam mê.
      </p>
      <Link
        to="/venues"
        className="mt-8 inline-flex rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
      >
        Đặt sân ngay
      </Link>
    </div>
  )
})
