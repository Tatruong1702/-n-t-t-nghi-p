import React from 'react'
import { CalendarDays, CircleDollarSign, ReceiptText, ShieldCheck, TrendingUp } from 'lucide-react'
import formatMoney from '../../../utils/formatMoney'
import StatCard from '../../common/StatCard'

const RevenueStats = React.memo(function RevenueStats({ stats }) {
  const cards = [
    { key: 'totalRevenue', title: 'Tổng doanh thu', value: formatMoney(stats.totalRevenue), icon: CircleDollarSign, trend: stats.totalRevenueTrend, tone: 'cyan' },
    { key: 'todayRevenue', title: 'Doanh thu hôm nay', value: formatMoney(stats.todayRevenue), icon: CalendarDays, trend: stats.todayTrend, tone: 'success' },
    { key: 'monthRevenue', title: 'Doanh thu tháng', value: formatMoney(stats.monthRevenue), icon: ReceiptText, trend: stats.monthTrend, tone: 'orange' },
    { key: 'yearRevenue', title: 'Doanh thu năm', value: formatMoney(stats.yearRevenue), icon: TrendingUp, trend: stats.yearTrend, tone: 'warning' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.key} title={card.title} value={card.value} subtitle="Cập nhật theo dữ liệu hiện tại" icon={card.icon} tone={card.tone} trend={card.trend} />
      ))}
      <div className="rounded-[24px] border border-slate-200/70 bg-slate-950 p-5 text-white shadow-[0_18px_60px_-26px_rgba(15,23,42,0.4)]">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Booking</span>
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="mt-4 grid gap-3 text-sm text-slate-300">
          <div className="flex items-center justify-between"><span>Tổng booking</span><span className="font-semibold text-white">{stats.totalBookings}</span></div>
          <div className="flex items-center justify-between"><span>Hoàn thành</span><span className="font-semibold text-white">{stats.completedBookings}</span></div>
          <div className="flex items-center justify-between"><span>Đã hủy</span><span className="font-semibold text-white">{stats.cancelledBookings}</span></div>
        </div>
      </div>
    </div>
  )
})

export default RevenueStats
