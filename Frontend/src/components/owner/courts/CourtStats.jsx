import React from 'react'
import { Activity, BarChart3, CalendarRange, CircleDollarSign, Layers3, Lock, TrendingUp, Wrench } from 'lucide-react'
import StatCard from '../../common/StatCard'

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const statCards = [
  { key: 'total', title: 'Tổng số sân con', value: 'totalCourts', icon: Layers3, tone: 'default' },
  { key: 'active', title: 'Đang hoạt động', value: 'activeCourts', icon: Activity, tone: 'success' },
  { key: 'maintenance', title: 'Bảo trì', value: 'maintenanceCourts', icon: Wrench, tone: 'warning' },
  { key: 'closed', title: 'Đã khóa', value: 'closedCourts', icon: Lock, tone: 'danger' },
  { key: 'bookings', title: 'Tổng lượt booking', value: 'totalBookings', icon: CalendarRange, tone: 'cyan' },
  { key: 'revenue', title: 'Doanh thu tháng', value: 'monthRevenue', icon: CircleDollarSign, tone: 'orange' },
  { key: 'fill', title: 'Tỷ lệ lấp đầy', value: 'fillRate', icon: BarChart3, tone: 'default' },
  { key: 'average', title: 'Giá trung bình', value: 'averagePrice', icon: TrendingUp, tone: 'success' },
]

const CourtStats = React.memo(function CourtStats({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = stats[card.value]
        return (
          <StatCard
            key={card.key}
            title={card.title}
            value={card.key === 'revenue' || card.key === 'average' ? formatCurrency(value) : value}
            subtitle="Cập nhật theo dữ liệu hiện tại"
            icon={Icon}
            tone={card.tone}
          />
        )
      })}
    </div>
  )
})

export default CourtStats
