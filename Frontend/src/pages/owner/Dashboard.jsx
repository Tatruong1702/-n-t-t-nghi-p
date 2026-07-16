import React, { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bar, Line } from 'react-chartjs-2'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CalendarRange,
  CircleDollarSign,
  Clock3,
  Copy,
  FileDown,
  FileText,
  Home,
  Landmark,
  MapPin,
  PlusCircle,
  Receipt,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler } from 'chart.js'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from '../../hooks/useAuth'
import authApi from '../../api/authApi'
import venueApi from '../../api/venueApi'
import courtApi from '../../api/courtApi'
import bookingApi from '../../api/bookingApi'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import DataTable from '../../components/common/DataTable'
import EmptyState from '../../components/common/EmptyState'
import SkeletonLoader from '../../components/common/SkeletonLoader'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import { Link } from 'react-router-dom'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))

const formatDateLabel = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const formatDateKey = (date) => date.toLocaleDateString('sv-SE')

const getOwnerId = (user) => user?.user_id ?? user?.id ?? user?.userId ?? user?.user?.id

const isRevenueStatus = (status) => ['confirmed', 'completed'].includes(String(status || '').toLowerCase())

const buildDashboardData = async (ownerId, profileUser) => {
  const [profileResponse, venuesResponse, courtsResponse, bookingsResponse] = await Promise.all([
    authApi.profile().catch(() => ({ data: { data: { user: profileUser || null } } })),
    venueApi.list().catch(() => ({ data: { data: { venues: [] } } })),
    courtApi.list().catch(() => ({ data: { data: { courts: [] } } })),
    bookingApi.list().catch(() => ({ data: { data: { bookings: [] } } })),
  ])

  const ownerProfile = profileResponse?.data?.data?.user || profileUser || null
  const venueList = Array.isArray(venuesResponse?.data?.data?.venues) ? venuesResponse.data.data.venues : []
  const courtList = Array.isArray(courtsResponse?.data?.data?.courts) ? courtsResponse.data.data.courts : []
  const fallbackBookings = Array.isArray(bookingsResponse?.data?.data?.bookings) ? bookingsResponse.data.data.bookings : []

  const ownerVenues = venueList.filter((venue) => String(getOwnerId(ownerProfile) || ownerId) === String(venue.owner_id ?? venue.ownerId ?? venue.owner?.user_id ?? venue.owner?.id))
  const ownerVenueIds = new Set(ownerVenues.map((venue) => venue.venue_id))
  const ownerCourts = courtList.filter((court) => ownerVenueIds.has(court.venue_id))

  let ownerBookings = []
  if (ownerCourts.length > 0) {
    const bookingResponses = await Promise.all(
      ownerCourts.map((court) =>
        bookingApi.search({ court_id: court.court_id }).catch(() => ({ data: { data: { bookings: [] } } })),
      ),
    )
    ownerBookings = bookingResponses.flatMap((response) => Array.isArray(response?.data?.data?.bookings) ? response.data.data.bookings : [])
  } else {
    ownerBookings = fallbackBookings
  }

  return {
    ownerProfile,
    ownerVenues,
    ownerCourts,
    ownerBookings,
  }
}

const getStatusClasses = (status) => {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'completed') return 'bg-emerald-100 text-emerald-700'
  if (normalized === 'confirmed') return 'bg-cyan-100 text-cyan-700'
  if (normalized === 'pending') return 'bg-amber-100 text-amber-700'
  if (normalized === 'cancelled') return 'bg-rose-100 text-rose-700'
  return 'bg-slate-100 text-slate-700'
}

const getStatusLabel = (status) => {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'completed') return 'Hoàn tất'
  if (normalized === 'confirmed') return 'Xác nhận'
  if (normalized === 'pending') return 'Chờ xử lý'
  if (normalized === 'cancelled') return 'Đã hủy'
  return 'Chưa rõ'
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const ownerId = useMemo(() => getOwnerId(user), [user])

  const profileQuery = useQuery({
    queryKey: ['owner-profile'],
    queryFn: () => authApi.profile(),
    enabled: !authLoading && !user,
    staleTime: 60_000,
  })

  const resolvedUser = useMemo(() => user || profileQuery.data?.data?.data?.user || profileQuery.data?.data?.user || null, [user, profileQuery.data])

  const dashboardQuery = useQuery({
    queryKey: ['owner-dashboard', ownerId],
    queryFn: () => buildDashboardData(ownerId, resolvedUser),
    enabled: Boolean(ownerId) || (!authLoading && !!resolvedUser),
    staleTime: 30_000,
  })

  const { ownerProfile, ownerVenues, ownerCourts, ownerBookings } = dashboardQuery.data || {}

  const stats = useMemo(() => {
    const revenueBookings = (ownerBookings || []).filter((booking) => isRevenueStatus(booking.status))
    const today = formatDateKey(new Date())
    const currentMonth = new Date().toLocaleDateString('sv-SE').slice(0, 7)

    const todayRevenue = revenueBookings.reduce((sum, booking) => {
      const bookingDate = formatDateKey(new Date(booking.booking_date || booking.created_at || new Date()))
      return bookingDate === today ? sum + Number(booking.total_price || 0) : sum
    }, 0)

    const monthRevenue = revenueBookings.reduce((sum, booking) => {
      const bookingDate = new Date(booking.booking_date || booking.created_at || new Date()).toLocaleDateString('sv-SE')
      return bookingDate.startsWith(currentMonth) ? sum + Number(booking.total_price || 0) : sum
    }, 0)

    const todayBookings = revenueBookings.filter((booking) => formatDateKey(new Date(booking.booking_date || booking.created_at || new Date())) === today).length
    const monthBookings = revenueBookings.filter((booking) => new Date(booking.booking_date || booking.created_at || new Date()).toLocaleDateString('sv-SE').startsWith(currentMonth)).length
    const totalRevenue = revenueBookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0)
    const occupancyRate = ownerCourts?.length ? Math.min(100, Math.round((revenueBookings.length / Math.max(1, ownerCourts.length * 30)) * 100)) : 0

    return {
      venuesCount: ownerVenues?.length || 0,
      courtsCount: ownerCourts?.length || 0,
      bookingsCount: revenueBookings.length,
      todayBookings,
      monthBookings,
      todayRevenue,
      monthRevenue,
      totalRevenue,
      occupancyRate,
      avgRevenue: revenueBookings.length ? totalRevenue / revenueBookings.length : 0,
    }
  }, [ownerBookings, ownerCourts, ownerVenues])

  const monthlySeries = useMemo(() => {
    const months = []
    const revenue = []
    const bookings = []
    const today = new Date()

    for (let index = 11; index >= 0; index -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth() - index, 1)
      const key = date.toLocaleDateString('sv-SE').slice(0, 7)
      const label = date.toLocaleDateString('vi-VN', { month: 'short' })

      months.push(label)
      revenue.push(
        (ownerBookings || []).reduce((sum, booking) => {
          const bookingDate = new Date(booking.booking_date || booking.created_at || new Date()).toLocaleDateString('sv-SE')
          return bookingDate.startsWith(key) && isRevenueStatus(booking.status) ? sum + Number(booking.total_price || 0) : sum
        }, 0),
      )
      bookings.push(
        (ownerBookings || []).filter((booking) => {
          const bookingDate = new Date(booking.booking_date || booking.created_at || new Date()).toLocaleDateString('sv-SE')
          return bookingDate.startsWith(key)
        }).length,
      )
    }

    return { labels: months, revenue, bookings }
  }, [ownerBookings])

  const revenueChartData = useMemo(
    () => ({
      labels: monthlySeries.labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: monthlySeries.revenue,
          backgroundColor: 'rgba(6, 182, 212, 0.28)',
          borderColor: '#06B6D4',
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }),
    [monthlySeries],
  )

  const bookingChartData = useMemo(
    () => ({
      labels: monthlySeries.labels,
      datasets: [
        {
          label: 'Booking',
          data: monthlySeries.bookings,
          borderColor: '#F97316',
          backgroundColor: 'rgba(249, 115, 22, 0.18)',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }),
    [monthlySeries],
  )

  const revenueChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#0F172A', titleColor: '#fff', bodyColor: '#fff' },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b' } },
        y: { beginAtZero: true, grid: { color: 'rgba(15, 23, 42, 0.08)' }, ticks: { color: '#64748b' } },
      },
    }),
    [],
  )

  const bookingChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: '#0F172A', titleColor: '#fff', bodyColor: '#fff' },
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b' } },
        y: { beginAtZero: true, grid: { color: 'rgba(15, 23, 42, 0.08)' }, ticks: { color: '#64748b' } },
      },
    }),
    [],
  )

  const insights = useMemo(() => {
    const confirmedBookings = (ownerBookings || []).filter((booking) => isRevenueStatus(booking.status))
    const averagePrice = ownerCourts?.length
      ? ownerCourts.reduce((sum, court) => sum + Number(court.price_per_hour || 0), 0) / ownerCourts.length
      : 0
    const revenueGrowth = monthlySeries.revenue.length > 1 ? ((monthlySeries.revenue.at(-1) - monthlySeries.revenue.at(-2)) / Math.max(1, monthlySeries.revenue.at(-2))) * 100 : 0
    const hourMap = confirmedBookings.reduce((acc, booking) => {
      const hour = String(booking.start_time || '').slice(0, 5) || '—'
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {})
    const peakHour = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

    return {
      occupancyRate: stats.occupancyRate,
      peakHour,
      revenueGrowth: Number.isFinite(revenueGrowth) ? revenueGrowth : 0,
      averagePrice,
      customers: new Set((ownerBookings || []).map((booking) => booking.user_name || booking.customer_name || booking.user?.full_name).filter(Boolean)).size,
    }
  }, [monthlySeries.revenue, ownerBookings, ownerCourts, stats.occupancyRate])

  const topCourt = useMemo(() => {
    const courtRevenueMap = (ownerBookings || []).reduce((acc, booking) => {
      const courtId = booking.court_id
      if (!acc[courtId]) {
        acc[courtId] = { courtId, revenue: 0, bookings: 0, name: booking.Court?.court_name || booking.court_name || `Sân ${courtId}` }
      }
      acc[courtId].revenue += isRevenueStatus(booking.status) ? Number(booking.total_price || 0) : 0
      acc[courtId].bookings += 1
      return acc
    }, {})

    return Object.values(courtRevenueMap).sort((a, b) => b.revenue - a.revenue)[0] || null
  }, [ownerBookings])

  const mostBookedCourt = useMemo(() => {
    const courtMap = (ownerBookings || []).reduce((acc, booking) => {
      const courtId = booking.court_id
      if (!acc[courtId]) {
        acc[courtId] = { courtId, bookings: 0, name: booking.Court?.court_name || booking.court_name || `Sân ${courtId}` }
      }
      acc[courtId].bookings += 1
      return acc
    }, {})

    return Object.values(courtMap).sort((a, b) => b.bookings - a.bookings)[0] || null
  }, [ownerBookings])

  const latestVenue = useMemo(() => {
    if (!ownerVenues?.length) return null
    return [...ownerVenues].sort((a, b) => Number(b.venue_id) - Number(a.venue_id))[0]
  }, [ownerVenues])

  const recentBookings = useMemo(() => {
    return [...(ownerBookings || [])]
      .sort((a, b) => new Date(b.booking_date || b.created_at || new Date()) - new Date(a.booking_date || a.created_at || new Date()))
      .slice(0, 12)
  }, [ownerBookings])

  const notifications = useMemo(() => {
    const items = []
    const latestBookings = [...(ownerBookings || [])].sort((a, b) => new Date(b.booking_date || b.created_at || new Date()) - new Date(a.booking_date || a.created_at || new Date()))

    latestBookings.slice(0, 5).forEach((booking) => {
      if (booking.status === 'cancelled') {
        items.push({ id: `cancel-${booking.booking_id}`, type: 'canceled', title: 'Booking bị hủy', message: `${booking.Court?.court_name || booking.court_name || 'Sân'} • ${formatDateLabel(booking.booking_date || booking.created_at || new Date())}` })
      } else if (isRevenueStatus(booking.status)) {
        items.push({ id: `success-${booking.booking_id}`, type: 'success', title: 'Thanh toán thành công', message: `${booking.Court?.court_name || booking.court_name || 'Sân'} • ${formatCurrency(booking.total_price || 0)}` })
      } else {
        items.push({ id: `new-${booking.booking_id}`, type: 'info', title: 'Booking mới', message: `${booking.Court?.court_name || booking.court_name || 'Sân'} • ${formatDateLabel(booking.booking_date || booking.created_at || new Date())}` })
      }
    })

    return items.slice(0, 5)
  }, [ownerBookings])

  const filteredBookings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return recentBookings.filter((booking) => {
      const haystack = `${booking.booking_id || ''} ${booking.user_name || ''} ${booking.Court?.court_name || booking.court_name || ''} ${booking.status || ''}`.toLowerCase()
      const matchesQuery = !query || haystack.includes(query)
      const matchesStatus = !statusFilter || String(booking.status || '').toLowerCase() === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [recentBookings, searchQuery, statusFilter])

  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize))
  const currentRows = useMemo(() => filteredBookings.slice((page - 1) * pageSize, page * pageSize), [filteredBookings, page])

  const bookingRows = currentRows.map((booking) => [
    <div key={`${booking.booking_id}-id`} className="font-semibold text-slate-900">#{booking.booking_id}</div>,
    <div key={`${booking.booking_id}-user`} className="space-y-1">
      <div className="font-semibold text-slate-900">{booking.user_name || 'Khách lạ'}</div>
      <div className="text-xs text-slate-500">{booking.phone || 'Chưa có số điện thoại'}</div>
    </div>,
    <div key={`${booking.booking_id}-court`} className="space-y-1">
      <div className="font-semibold text-slate-900">{booking.Court?.court_name || booking.court_name || '—'}</div>
      <div className="text-xs text-slate-500">{booking.venue_name || '—'}</div>
    </div>,
    <div key={`${booking.booking_id}-time`} className="text-sm text-slate-700">
      {formatDateLabel(booking.booking_date || booking.created_at || new Date())}
      <div className="mt-1 text-xs text-slate-500">{booking.start_time || '—'} - {booking.end_time || '—'}</div>
    </div>,
    <div key={`${booking.booking_id}-price`} className="font-semibold text-slate-900">{formatCurrency(booking.total_price || 0)}</div>,
    <div key={`${booking.booking_id}-status`}>
      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusClasses(booking.status)}`}>
        {getStatusLabel(booking.status)}
      </span>
    </div>,
  ])

  const statCards = [
    { title: 'Tổng số sân', value: stats.venuesCount.toLocaleString(), subtitle: 'Venue đang quản lý', icon: Building2, tone: 'default' },
    { title: 'Tổng sân con', value: stats.courtsCount.toLocaleString(), subtitle: 'Số sân hoạt động', icon: Home, tone: 'cyan' },
    { title: 'Booking hôm nay', value: stats.todayBookings.toLocaleString(), subtitle: 'Lượt đặt được xác nhận', icon: CalendarDays, tone: 'orange' },
    { title: 'Booking tháng này', value: stats.monthBookings.toLocaleString(), subtitle: 'Tổng booking tháng hiện tại', icon: CalendarRange, tone: 'success' },
    { title: 'Doanh thu hôm nay', value: formatCurrency(stats.todayRevenue), subtitle: 'Từ booking đã thanh toán', icon: CircleDollarSign, tone: 'warning' },
    { title: 'Doanh thu tháng này', value: formatCurrency(stats.monthRevenue), subtitle: 'Tổng doanh thu tháng', icon: TrendingUp, tone: 'default' },
    { title: 'Tỷ lệ lấp đầy', value: `${stats.occupancyRate}%`, subtitle: 'Tỷ lệ sử dụng sân', icon: Activity, tone: 'cyan' },
    { title: 'Khách hàng mới', value: insights.customers.toLocaleString(), subtitle: 'Khách đặt sân trong tháng', icon: Users, tone: 'success' },
  ]

  const businessCards = [
    { title: 'Occupancy Rate', value: `${insights.occupancyRate}%`, subtitle: 'Tỷ lệ lấp đầy trung bình', icon: Activity, tone: 'cyan' },
    { title: 'Peak Hours', value: insights.peakHour, subtitle: 'Khung giờ đặt sân đông nhất', icon: Clock3, tone: 'orange' },
    { title: 'Revenue Growth', value: `${insights.revenueGrowth >= 0 ? '+' : ''}${insights.revenueGrowth.toFixed(1)}%`, subtitle: 'So với tháng trước', icon: TrendingUp, tone: 'success' },
    { title: 'Average Revenue', value: formatCurrency(insights.averagePrice), subtitle: 'Doanh thu trung bình mỗi sân', icon: BarChart3, tone: 'default' },
    { title: 'Total Customers', value: insights.customers.toLocaleString(), subtitle: 'Khách hàng trong hệ thống', icon: Users, tone: 'warning' },
  ]

  const handleCopyAddress = useCallback(() => {
    const address = ownerVenues?.[0]?.address || ownerVenues?.[0]?.city || 'Địa chỉ chưa cập nhật'
    navigator.clipboard.writeText(address).then(() => toast.success('Đã copy địa chỉ sân')).catch(() => toast.error('Không thể copy địa chỉ'))
  }, [ownerVenues])

  const handleExportExcel = useCallback(() => {
    const rows = recentBookings.map((booking) => [booking.booking_id, booking.user_name || 'Khách hàng', booking.Court?.court_name || booking.court_name || '', booking.booking_date, booking.start_time, booking.total_price, booking.status])
    const csv = [['Mã booking', 'Khách hàng', 'Sân', 'Ngày', 'Giờ', 'Giá', 'Trạng thái'], ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'owner-bookings.csv'
    link.click()
    toast.success('Đã xuất file Excel')
  }, [recentBookings])

  const handleExportPdf = useCallback(() => {
    Swal.fire({
      title: 'Xuất báo cáo PDF',
      text: 'Báo cáo sẽ được mở bằng trình in của trình duyệt.',
      icon: 'info',
      confirmButtonText: 'Tiếp tục',
      confirmButtonColor: '#0F172A',
    }).then(() => window.print())
  }, [])

  if (dashboardQuery.isLoading || authLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.2)]">
          <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-12 w-80 animate-pulse rounded-full bg-slate-200" />
        </div>
        <SkeletonLoader count={8} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" />
      </div>
    )
  }

  if (!ownerVenues?.length) {
    return (
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.2)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Owner Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Chào mừng bạn</h1>
        </div>
        <EmptyState title="Chưa có sân nào" description="Tạo sân đầu tiên để bắt đầu theo dõi doanh thu và booking." />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      <ToastContainer position="top-right" theme="light" />

      <section className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-600 p-6 text-white shadow-[0_32px_90px_-32px_rgba(15,23,42,0.52)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xl font-semibold">
              {(ownerProfile?.full_name || ownerProfile?.username || ownerProfile?.name || 'O').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-cyan-100">
                <Sparkles size={14} /> Owner Workspace
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">Xin chào, {ownerProfile?.full_name || ownerProfile?.username || ownerProfile?.name || 'Owner'}</h1>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                  <CalendarDays size={14} /> {new Date().toLocaleDateString('vi-VN')}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                  <Bell size={14} /> {notifications.length} thông báo mới
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-300">Tổng sân</p>
              <p className="mt-2 text-xl font-semibold">{stats.venuesCount}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-300">Doanh thu</p>
              <p className="mt-2 text-xl font-semibold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-300">Booking hôm nay</p>
              <p className="mt-2 text-xl font-semibold">{stats.todayBookings}</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-slate-300">Thông báo</p>
              <p className="mt-2 text-xl font-semibold">{notifications.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} subtitle={card.subtitle} icon={card.icon} tone={card.tone} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-4 2xl:grid-cols-4">
        <div className="xl:col-span-4">
          <ChartCard title="Revenue Analytics" subtitle="Doanh thu và booking 12 tháng gần nhất">
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="min-h-[320px] rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-cyan-50/70 p-3">
                <Bar data={revenueChartData} options={revenueChartOptions} />
              </div>
              <div className="min-h-[320px] rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-orange-50/70 p-3">
                <Line data={bookingChartData} options={bookingChartOptions} />
              </div>
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-4 2xl:grid-cols-4">
        <div className="xl:col-span-2">
          <ChartCard title="Top Venues" subtitle="Top doanh thu, top booking và sân hoạt động tốt nhất">
            <div className="space-y-3">
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Top doanh thu</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{topCourt?.name || '—'}</p>
                  </div>
                  <div className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700">{formatCurrency(topCourt?.revenue || 0)}</div>
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Top booking</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{mostBookedCourt?.name || '—'}</p>
                  </div>
                  <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">{mostBookedCourt?.bookings || 0} lượt</div>
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Sân hoạt động tốt nhất</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{mostBookedCourt?.name || '—'}</p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Đang chạy ổn</div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-2">
          <ChartCard title="Recent Bookings" subtitle="Danh sách booking mới nhất">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 md:flex-row">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Tìm booking, khách hàng hoặc sân" />
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value)
                    setPage(1)
                  }}
                  className="rounded-[20px] border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="completed">Hoàn tất</option>
                  <option value="confirmed">Xác nhận</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <DataTable headers={['Mã booking', 'Khách hàng', 'Sân', 'Thời gian', 'Giá', 'Trạng thái']} rows={bookingRows} />
              <Pagination page={page} totalPages={totalPages} onChange={(nextPage) => setPage(nextPage)} />
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {businessCards.map((card) => (
          <StatCard key={card.title} title={card.title} value={card.value} subtitle={card.subtitle} icon={card.icon} tone={card.tone} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-4 2xl:grid-cols-4">
        <div className="xl:col-span-2">
          <ChartCard title="Lịch booking hôm nay" subtitle="Sự kiện và booking sắp tới">
            <div className="space-y-3">
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-100 p-2 text-cyan-700">
                    <CalendarRange size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Booking hôm nay</p>
                    <p className="mt-1 text-sm text-slate-600">{stats.todayBookings} lượt đặt trong ngày</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-orange-100 p-2 text-orange-700">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Booking sắp tới</p>
                    <p className="mt-1 text-sm text-slate-600">{Math.max(1, Math.min(5, recentBookings.length))} booking sắp tới trong tuần</p>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="xl:col-span-2">
          <ChartCard title="Quick Actions" subtitle="Tăng tốc vận hành">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/owner/courts" className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4 transition hover:border-cyan-400 hover:bg-cyan-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-100 p-2 text-cyan-700">
                    <PlusCircle size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Thêm sân</p>
                    <p className="text-sm text-slate-600">Tạo sân mới</p>
                  </div>
                </div>
              </Link>
              <Link to="/owner/courts" className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4 transition hover:border-orange-400 hover:bg-orange-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-orange-100 p-2 text-orange-700">
                    <Home size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Thêm sân con</p>
                    <p className="text-sm text-slate-600">Quản lý sân con</p>
                  </div>
                </div>
              </Link>
              <Link to="/owner/bookings" className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4 transition hover:border-emerald-400 hover:bg-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Xem booking</p>
                    <p className="text-sm text-slate-600">Theo dõi lịch dùng sân</p>
                  </div>
                </div>
              </Link>
              <Link to="/owner/revenue" className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4 transition hover:border-slate-400 hover:bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-2 text-white">
                    <BarChart3 size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Xem doanh thu</p>
                    <p className="text-sm text-slate-600">Báo cáo chi tiết</p>
                  </div>
                </div>
              </Link>
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-4 2xl:grid-cols-4">
        <div className="xl:col-span-4">
          <ChartCard title="Thông tin vận hành" subtitle="Thông tin sân và vận hành gần đây">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-100 p-2 text-cyan-700">
                    <Landmark size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Sân có doanh thu cao nhất</p>
                    <p className="mt-2 font-semibold text-slate-900">{topCourt?.name || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-orange-100 p-2 text-orange-700">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Sân mới nhất</p>
                    <p className="mt-2 font-semibold text-slate-900">{latestVenue?.venue_name || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Sân được đặt nhiều nhất</p>
                    <p className="mt-2 font-semibold text-slate-900">{mostBookedCourt?.name || '—'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200/70 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-900 p-2 text-white">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Tỷ lệ lấp đầy</p>
                    <p className="mt-2 font-semibold text-slate-900">{stats.occupancyRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </section>
    </div>
  )
}
