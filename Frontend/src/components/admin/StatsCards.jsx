import React from 'react'
import { Ban, BarChart3, Building2, CalendarDays, CircleDollarSign, Users } from 'lucide-react'
import StatCard from '../common/StatCard'

const cards = [
  {
    key: 'revenue',
    title: 'Tổng doanh thu',
    icon: CircleDollarSign,
    tone: 'cyan',
    label: 'Doanh thu hôm nay',
  },
  {
    key: 'users',
    title: 'Tổng người dùng',
    icon: Users,
    tone: 'orange',
    label: 'Khách hàng và quản trị',
  },
  {
    key: 'venues',
    title: 'Tổng sân bóng',
    icon: Building2,
    tone: 'success',
    label: 'Sân đang hoạt động',
  },
  {
    key: 'bookings',
    title: 'Tổng lượt đặt',
    icon: CalendarDays,
    tone: 'warning',
    label: 'Lượt đặt trong tháng',
  },
  {
    key: 'cancelRate',
    title: 'Tỷ lệ hủy',
    icon: Ban,
    tone: 'danger',
    label: 'Tỷ lệ không thành công',
  },
  {
    key: 'avgRevenue',
    title: 'Doanh thu trung bình',
    icon: BarChart3,
    tone: 'default',
    label: 'Trên mỗi booking',
  },
]

export default function StatsCards({ data, loading }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const value = loading ? '—' : data?.[card.key]
        const trend = loading ? null : data?.[`${card.key}Trend`]
        return (
          <StatCard
            key={card.key}
            title={card.title}
            value={value}
            subtitle={card.label}
            icon={card.icon}
            tone={card.tone}
            trend={trend !== null && trend !== undefined ? `${trend >= 0 ? '+' : ''}${trend}%` : null}
            loading={loading}
          />
        )
      })}
    </div>
  )
}
