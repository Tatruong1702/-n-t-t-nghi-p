import React, { useEffect, useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import userApi from '../../api/userApi'
import DashboardHeader from '../../components/admin/DashboardHeader'
import StatsCards from '../../components/admin/StatsCards'
import BookingChart from '../../components/admin/BookingChart'
import RevenueChart from '../../components/admin/RevenueChart'
import BookingStatus from '../../components/admin/BookingStatus'
import TopVenues from '../../components/admin/TopVenues'
import BusinessWidgets from '../../components/admin/BusinessWidgets'
import EmptyState from '../../components/admin/EmptyState'
import RecentBookings from '../../components/admin/RecentBookings'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const defaultDashboard = {
  stats: {
    users: 0,
    venues: 0,
    courts: 0,
    bookings: 0,
    revenue: 0,
    revenueToday: 0,
    revenueMonth: 0,
  },
  bookingsByHour: [],
  bookingsByMonth: [],
  bookingStatusCounts: {
    completed: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  },
  topVenues: [],
  recentBookings: [],
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const normalizeDashboardData = (data) => ({
  stats: {
    users: Number(data?.stats?.users || 0),
    venues: Number(data?.stats?.venues || 0),
    courts: Number(data?.stats?.courts || 0),
    bookings: Number(data?.stats?.bookings || 0),
    revenue: Number(data?.stats?.revenue || 0),
  },
  bookingsByHour: Array.isArray(data?.bookingsByHour)
    ? data.bookingsByHour.map((item) => ({
        hour: item?.hour || '',
        count: Number(item?.count || 0),
      }))
    : [],
  bookingsByMonth: Array.isArray(data?.bookingsByMonth)
    ? data.bookingsByMonth.map((item) => ({
        month: item?.month || '',
        count: Number(item?.count || 0),
        revenue: Number(item?.revenue || 0),
      }))
    : [],
  bookingStatusCounts: {
    completed: Number(data?.bookingStatusCounts?.completed || 0),
    confirmed: Number(data?.bookingStatusCounts?.confirmed || 0),
    pending: Number(data?.bookingStatusCounts?.pending || 0),
    cancelled: Number(data?.bookingStatusCounts?.cancelled || 0),
  },
  topVenues: Array.isArray(data?.topVenues)
    ? data.topVenues.map((item) => ({
        venue_name: item?.venue_name || '',
        bookings: Number(item?.bookings || 0),
        revenue: Number(item?.revenue || 0),
      }))
    : [],
  recentBookings: Array.isArray(data?.recentBookings)
    ? data.recentBookings.map((item) => ({
        booking_id: item?.booking_id,
        booking_date: item?.booking_date || '',
        start_time: item?.start_time || '',
        end_time: item?.end_time || '',
        total_price: Number(item?.total_price || 0),
        status: item?.status || '',
        court_name: item?.court_name || '',
        venue_name: item?.venue_name || '',
        user_name: item?.user_name || 'Khách lạ',
        email: item?.email || '',
        phone: item?.phone || '',
        payment_method: item?.payment_method || 'Chưa rõ',
      }))
    : [],
})

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(defaultDashboard)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  )

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await userApi.dashboard()
      const data = response.data?.data?.dashboard
      setDashboard(data ? normalizeDashboardData(data) : defaultDashboard)
    } catch (err) {
      console.error(err)
      setError('Không thể tải dữ liệu dashboard từ server.')
      setDashboard(defaultDashboard)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
    }, 60_000)

    return () => clearInterval(interval)
  }, [])

  const bookingPeak = useMemo(
    () => dashboard.bookingsByHour.reduce((best, item) => (item.count > best.count ? item : best), { hour: '—', count: 0 }),
    [dashboard.bookingsByHour]
  )

  const averageRevenue = dashboard.stats.bookings ? dashboard.stats.revenue / dashboard.stats.bookings : 0
  const cancelRate = dashboard.stats.bookings
    ? ((dashboard.bookingStatusCounts.cancelled / dashboard.stats.bookings) * 100).toFixed(2)
    : '0.00'

  const topVenuesWithShare = useMemo(() => {
    const totalRevenue = dashboard.topVenues.reduce((sum, venue) => sum + venue.revenue, 0)
    return dashboard.topVenues.map((venue) => ({
      ...venue,
      revenueShare: totalRevenue ? venue.revenue / totalRevenue : 0,
    }))
  }, [dashboard.topVenues])

  const widgetItems = [
    {
      key: 'topVenue',
      title: 'Sân được đặt nhiều nhất',
      value: dashboard.topVenues[0]?.venue_name || 'Chưa có dữ liệu',
      subtitle: `${dashboard.topVenues[0]?.bookings || 0} lượt đặt`,
    },
    {
      key: 'peakHour',
      title: 'Khung giờ cao điểm',
      value: bookingPeak.hour,
      subtitle: `${bookingPeak.count} lượt đặt`,
    },
    {
      key: 'revenueToday',
      title: 'Doanh thu hôm nay',
      value: formatCurrency(dashboard.stats.revenueToday),
      subtitle: 'Doanh thu xác nhận/completed',
    },
    {
      key: 'revenueMonth',
      title: 'Doanh thu tháng',
      value: formatCurrency(dashboard.stats.revenueMonth),
      subtitle: 'Doanh thu xác nhận/completed',
    },
    {
      key: 'fillRate',
      title: 'Tỷ lệ hủy',
      value: `${cancelRate}%`,
      subtitle: 'Booking bị hủy',
    },
    {
      key: 'activeVenues',
      title: 'Số sân',
      value: dashboard.stats.venues.toLocaleString(),
      subtitle: 'Sân đang hoạt động',
    },
    {
      key: 'topOwner',
      title: 'Chủ sân hàng đầu',
      value: 'Đang cập nhật',
      subtitle: 'Dữ liệu chưa đủ',
    },
    {
      key: 'topCustomer',
      title: 'Khách hàng chủ lực',
      value: 'Đang cập nhật',
      subtitle: 'Dữ liệu chưa đủ',
    },
  ]

  const statsData = {
    revenue: formatCurrency(dashboard.stats.revenue),
    users: dashboard.stats.users.toLocaleString(),
    venues: dashboard.stats.venues.toLocaleString(),
    bookings: dashboard.stats.bookings.toLocaleString(),
    cancelRate: `${cancelRate}%`,
    avgRevenue: formatCurrency(averageRevenue),
    revenueTrend: 12.4,
    usersTrend: 4.2,
    venuesTrend: 3.1,
    bookingsTrend: 7.6,
  }

  const hasDashboardData =
    dashboard.stats.bookings > 0 || dashboard.topVenues.length > 0 || dashboard.recentBookings.length > 0

  return loading ? (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-slate-600">Đang tải dữ liệu dashboard...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <div className="flex-1 flex min-h-0 flex-col">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-b border-slate-200 bg-white px-6 py-6 shadow-sm rounded-b-3xl">
              <DashboardHeader currentTime={currentTime} onRefresh={loadDashboard} />
            </div>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              {error && (
                <div className="mb-6 rounded-[1.75rem] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <StatsCards data={statsData} loading={loading} />

              <div className="mt-6">
                <BusinessWidgets items={widgetItems} loading={loading} />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
                <div className="lg:col-span-8">
                  <BookingChart bookingsByHour={dashboard.bookingsByHour} loading={loading} range="6 giờ gần nhất" />
                </div>
                <div className="lg:col-span-4">
                  <RevenueChart bookingsByMonth={dashboard.bookingsByMonth} loading={loading} range="6 tháng" />
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-stretch">
                <div className="lg:col-span-4">
                  <RecentBookings bookings={dashboard.recentBookings} loading={loading} />
                </div>
                <div className="lg:col-span-4">
                  <TopVenues venues={topVenuesWithShare} loading={loading} />
                </div>
                <div className="lg:col-span-4">
                  {!hasDashboardData ? (
                    <EmptyState message="Chưa có dữ liệu dashboard" onReload={loadDashboard} />
                  ) : (
                    <BookingStatus statusCounts={dashboard.bookingStatusCounts} totalBookings={dashboard.stats.bookings} loading={loading} />
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
