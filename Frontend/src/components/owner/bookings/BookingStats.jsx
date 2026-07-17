import React from 'react'
import { CalendarRange, CircleDollarSign, Clock3, Sparkles, Users2 } from 'lucide-react'
import formatMoney from '../../../utils/formatMoney'
import StatCard from '../../common/StatCard'

const BookingStats = React.memo(function BookingStats({ stats }) {
  const cards = [
    { key: 'total', title: 'Tổng booking', value: stats.totalBookings, icon: CalendarRange, trend: '+12%', tone: 'cyan' },
    { key: 'today', title: 'Hôm nay', value: stats.todayBookings, icon: Clock3, trend: '+4%', tone: 'success' },
    { key: 'week', title: 'Tuần này', value: stats.weekBookings, icon: Users2, trend: '+8%', tone: 'orange' },
    { key: 'revenue', title: 'Tổng doanh thu', value: formatMoney(stats.totalRevenue), icon: CircleDollarSign, trend: '+15%', tone: 'warning' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.key} title={card.title} value={card.value} subtitle="Cập nhật theo dữ liệu hiện tại" icon={card.icon} tone={card.tone} trend={card.trend} />
      ))}
      <div className="rounded-[24px] border border-slate-200/70 bg-slate-950 p-5 text-white shadow-[0_18px_60px_-26px_rgba(15,23,42,0.4)]">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Sparkles className="h-4 w-4" /> Tóm tắt vận hành
        </div>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Tỷ lệ lấp đầy</span>
            <span className="font-semibold text-white">{stats.occupancy}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tỷ lệ hủy</span>
            <span className="font-semibold text-white">{stats.cancelRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Doanh thu tháng</span>
            <span className="font-semibold text-white">{formatMoney(stats.monthRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default BookingStats
