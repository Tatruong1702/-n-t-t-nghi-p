import React from 'react'
import { CalendarRange, TrendingUp } from 'lucide-react'

const CourtAnalytics = React.memo(function CourtAnalytics({ analytics }) {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_60px_-25px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Booking analytics</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Xu hướng đặt sân</h3>
        </div>
        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
          <CalendarRange className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Tổng booking</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">{analytics.totalBookings}</div>
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Hôm nay</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">{analytics.todayBookings}</div>
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Tuần này</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">{analytics.weekBookings}</div>
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Tháng này</div>
          <div className="mt-2 text-xl font-semibold text-slate-900">{analytics.monthBookings}</div>
        </div>
      </div>
      <div className="mt-5 rounded-[20px] border border-slate-200 bg-gradient-to-br from-slate-50 to-cyan-50 p-4 text-sm text-slate-600">
        <div className="flex items-center gap-2 font-medium text-slate-900">
          <TrendingUp className="h-4 w-4" /> Xu hướng đang tăng ổn định
        </div>
      </div>
    </div>
  )
})

export default CourtAnalytics
