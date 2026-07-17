import React, { memo } from 'react'
import { TrendingUp, ShieldCheck, Clock3, Sparkles } from 'lucide-react'

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))

const BusinessInsights = memo(function BusinessInsights({ insights }) {
  const items = [
    { label: 'Tỷ lệ lấp đầy sân', value: `${insights.occupancyRate}%`, icon: TrendingUp },
    { label: 'Giá thuê trung bình', value: formatCurrency(insights.averagePrice), icon: ShieldCheck },
    { label: 'Doanh thu trung bình/sân', value: formatCurrency(insights.revenuePerCourt), icon: Sparkles },
    { label: 'Booking trung bình/ngày', value: insights.bookingsPerDay.toFixed(1), icon: Clock3 },
  ]

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600">
          <TrendingUp size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-600">Phân tích kinh doanh</p>
          <h3 className="text-xl font-semibold text-slate-900">Hiệu suất vận hành</h3>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Icon size={16} />
                <span className="text-sm">{item.label}</span>
              </div>
              <p className="mt-3 text-xl font-semibold text-slate-900">{item.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
        <p className="text-sm font-medium text-emerald-600">Giờ cao điểm</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">{insights.peakHour || '—'}</p>
        <p className="mt-2 text-sm text-slate-600">Ngày đông khách nhất: {insights.busiestDay || '—'}</p>
      </div>
    </div>
  )
})

export default BusinessInsights
