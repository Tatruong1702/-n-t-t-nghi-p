import React, { memo } from 'react'
import { Building2, CalendarDays, Landmark, Sparkles, TrendingUp, Wallet2 } from 'lucide-react'
import StatCard from '../../common/StatCard'

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))

const DashboardStats = memo(function DashboardStats({ stats }) {
  const cards = [
    {
      title: 'Tổng số sân',
      value: stats.venuesCount,
      icon: Building2,
      tone: 'default',
      subtitle: 'Sân đang quản lý',
    },
    {
      title: 'Tổng số sân con',
      value: stats.courtsCount,
      icon: Landmark,
      tone: 'success',
      subtitle: 'Cơ sở vật chất',
    },
    {
      title: 'Tổng booking',
      value: stats.bookingsCount,
      icon: CalendarDays,
      tone: 'cyan',
      subtitle: 'Đã xác nhận & hoàn tất',
    },
    {
      title: 'Booking hôm nay',
      value: stats.todayBookings,
      icon: Sparkles,
      tone: 'orange',
      subtitle: 'Khách hàng mới',
    },
    {
      title: 'Booking tháng này',
      value: stats.monthBookings,
      icon: TrendingUp,
      tone: 'warning',
      subtitle: 'Xu hướng tăng trưởng',
    },
    {
      title: 'Doanh thu hôm nay',
      value: formatCurrency(stats.todayRevenue),
      icon: Wallet2,
      tone: 'success',
      subtitle: 'Từ booking thành công',
    },
    {
      title: 'Doanh thu tháng này',
      value: formatCurrency(stats.monthRevenue),
      icon: Wallet2,
      tone: 'cyan',
      subtitle: 'Thu nhập hiện tại',
    },
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(stats.totalRevenue),
      icon: Landmark,
      tone: 'danger',
      subtitle: 'Toàn bộ hệ thống',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} title={card.title} value={card.value} subtitle={card.subtitle} icon={card.icon} tone={card.tone} />
      ))}
    </div>
  )
})

export default DashboardStats
