import React from 'react'
import { Activity, Building2, CalendarRange, CircleDollarSign, Layers3, PauseCircle } from 'lucide-react'
import StatCard from '../../common/StatCard'

const statCards = [
  { key: 'total', title: 'Tổng số sân', value: 'totalVenues', icon: Building2, tone: 'default' },
  { key: 'active', title: 'Đang hoạt động', value: 'activeVenues', icon: Activity, tone: 'success' },
  { key: 'paused', title: 'Tạm ngưng', value: 'pausedVenues', icon: PauseCircle, tone: 'warning' },
  { key: 'courts', title: 'Tổng sân con', value: 'totalCourts', icon: Layers3, tone: 'cyan' },
  { key: 'bookings', title: 'Tổng booking', value: 'totalBookings', icon: CalendarRange, tone: 'orange' },
  { key: 'revenue', title: 'Doanh thu tháng', value: 'monthRevenue', icon: CircleDollarSign, tone: 'danger' },
]

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const VenueStats = React.memo(function VenueStats({ stats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {statCards.map((card) => {
        const Icon = card.icon
        const value = stats[card.value]
        return (
          <StatCard
            key={card.key}
            title={card.title}
            value={card.key === 'revenue' ? formatCurrency(value) : value}
            subtitle="Cập nhật theo dữ liệu hiện tại"
            icon={Icon}
            tone={card.tone}
          />
        )
      })}
    </div>
  )
})

export default VenueStats
