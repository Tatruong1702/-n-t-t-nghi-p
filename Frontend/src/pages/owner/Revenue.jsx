import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw, Sparkles } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import bookingApi from '../../api/bookingApi'
import venueApi from '../../api/venueApi'
import courtApi from '../../api/courtApi'
import userApi from '../../api/userApi'
import RevenueStats from '../../components/owner/revenue/RevenueStats'
import RevenueFilters from '../../components/owner/revenue/RevenueFilters'
import RevenueChart from '../../components/owner/revenue/RevenueChart'
import RevenueInsights from '../../components/owner/revenue/RevenueInsights'
import RevenueTable from '../../components/owner/revenue/RevenueTable'

const fetchOwnerRevenueData = async (currentUser, venues, courts) => {
  const response = await bookingApi.list()
  const bookings = response?.data?.data?.bookings || []
  const ownerVenueIds = venues.filter((venue) => String(venue.owner_id) === String(currentUser?.user_id)).map((venue) => venue.venue_id)
  const ownerCourtIds = courts.filter((court) => ownerVenueIds.includes(court.venue_id)).map((court) => court.court_id)
  return bookings.filter((booking) => ownerCourtIds.includes(booking.court_id) || ownerVenueIds.includes(booking?.Court?.venue_id))
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const getRevenueValue = (booking) => {
  if (booking?.status === 'cancelled') return 0
  if (booking?.Payment?.status === 'paid') return Number(booking.total_price || 0)
  if (['confirmed', 'completed'].includes(booking?.status)) return Number(booking.total_price || 0)
  return 0
}

const getDateRangeStart = (period) => {
  const now = new Date()
  const start = new Date(now)
  if (period === 'today') {
    start.setHours(0, 0, 0, 0)
    return start
  }
  if (period === '7d') {
    start.setDate(now.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    return start
  }
  if (period === '30d') {
    start.setDate(now.getDate() - 29)
    start.setHours(0, 0, 0, 0)
    return start
  }
  if (period === 'quarter') {
    const quarter = Math.floor(now.getMonth() / 3)
    start.setMonth(quarter * 3, 1)
    start.setHours(0, 0, 0, 0)
    return start
  }
  if (period === 'year') {
    start.setMonth(0, 1)
    start.setHours(0, 0, 0, 0)
    return start
  }
  return null
}

const buildChartData = (bookings, period) => {
  const base = bookings.filter((booking) => booking.revenueValue > 0)
  if (!base.length) return []
  const start = getDateRangeStart(period)
  const filtered = start ? base.filter((booking) => new Date(booking.booking_date) >= start) : base

  if (period === 'today') {
    return filtered.map((booking) => ({ label: booking.booking_date, revenue: booking.revenueValue }))
  }

  const map = new Map()
  filtered.forEach((booking) => {
    const date = new Date(booking.booking_date)
    let key = ''
    if (period === '7d' || period === '30d') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    } else if (period === 'quarter' || period === 'year') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    } else {
      key = booking.booking_date
    }

    const label = period === 'year' || period === 'quarter' ? key : booking.booking_date
    map.set(label, (map.get(label) || 0) + booking.revenueValue)
  })

  return Array.from(map.entries()).map(([label, revenue]) => ({ label, revenue }))
}

export default function OwnerRevenue() {
  const { user, loading: authLoading } = useAuth()
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState('30d')
  const [dateRange, setDateRange] = useState('')
  const [venueFilter, setVenueFilter] = useState('all')
  const [courtFilter, setCourtFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: venues = [] } = useQuery({
    queryKey: ['owner-revenue-venues', user?.user_id],
    queryFn: () => venueApi.list().then((res) => res?.data?.data?.venues || []),
    enabled: !!user?.user_id,
    staleTime: 30_000,
  })

  const { data: courts = [] } = useQuery({
    queryKey: ['owner-revenue-courts', user?.user_id],
    queryFn: () => courtApi.list().then((res) => res?.data?.data?.courts || []),
    enabled: !!user?.user_id,
    staleTime: 30_000,
  })

  const { data: users = [] } = useQuery({
    queryKey: ['owner-revenue-users', user?.user_id],
    queryFn: () => userApi.list().then((res) => res?.data?.data?.users || []),
    enabled: !!user?.user_id,
    staleTime: 30_000,
  })

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ['owner-revenue-bookings', user?.user_id],
    queryFn: () => fetchOwnerRevenueData(user, venues, courts),
    enabled: !!user?.user_id && venues.length > 0 && courts.length > 0,
    staleTime: 30_000,
  })

  const normalizedBookings = useMemo(() => {
    return bookings.map((booking) => {
      const venue = venues.find((item) => item.venue_id === booking?.Court?.venue_id) || null
      const court = courts.find((item) => item.court_id === booking?.court_id) || null
      const customer = users.find((item) => String(item.user_id) === String(booking.user_id)) || null
      return {
        ...booking,
        venueName: venue?.venue_name || booking?.Court?.Venue?.venue_name || '—',
        courtName: court?.court_name || booking?.Court?.court_name || '—',
        customerName: customer?.full_name || booking?.User?.full_name || `User ${booking.user_id}`,
        revenueValue: getRevenueValue(booking),
      }
    })
  }, [bookings, courts, user, users, venues])

  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase()
    return normalizedBookings.filter((booking) => {
      const matchesKeyword = `${booking.customerName || ''} ${booking.booking_id || ''} ${booking.venueName || ''} ${booking.courtName || ''}`.toLowerCase().includes(keyword)
      const matchesVenue = venueFilter === 'all' || String(booking?.Court?.venue_id || booking?.venue_id) === String(venueFilter)
      const matchesCourt = courtFilter === 'all' || String(booking.court_id) === String(courtFilter)
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
      const matchesDate = !dateRange || booking.booking_date === dateRange
      const matchesPeriod = (() => {
        const start = getDateRangeStart(period)
        if (!start) return true
        return new Date(booking.booking_date) >= start
      })()
      return matchesKeyword && matchesVenue && matchesCourt && matchesStatus && matchesDate && matchesPeriod
    })
  }, [dateRange, courtFilter, normalizedBookings, period, search, statusFilter, venueFilter])

  const stats = useMemo(() => {
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.revenueValue, 0)
    const todayRevenue = filteredBookings.filter((booking) => booking.booking_date === new Date().toISOString().slice(0, 10)).reduce((sum, booking) => sum + booking.revenueValue, 0)
    const monthRevenue = filteredBookings.filter((booking) => booking.booking_date?.slice(0, 7) === new Date().toISOString().slice(0, 7)).reduce((sum, booking) => sum + booking.revenueValue, 0)
    const yearRevenue = filteredBookings.filter((booking) => booking.booking_date?.slice(0, 4) === new Date().toISOString().slice(0, 4)).reduce((sum, booking) => sum + booking.revenueValue, 0)
    const totalBookings = filteredBookings.length
    const completedBookings = filteredBookings.filter((booking) => booking.status === 'completed').length
    const cancelledBookings = filteredBookings.filter((booking) => booking.status === 'cancelled').length
    return {
      totalRevenue,
      todayRevenue,
      monthRevenue,
      yearRevenue,
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalRevenueTrend: `${totalRevenue > 0 ? '+' : ''}${formatCurrency(totalRevenue)}`,
      todayTrend: `${todayRevenue > 0 ? '+' : ''}${formatCurrency(todayRevenue)}`,
      monthTrend: `${monthRevenue > 0 ? '+' : ''}${formatCurrency(monthRevenue)}`,
      yearTrend: `${yearRevenue > 0 ? '+' : ''}${formatCurrency(yearRevenue)}`,
    }
  }, [filteredBookings])

  const chartData = useMemo(() => buildChartData(filteredBookings.map((booking) => ({ ...booking })), period), [filteredBookings, period])

  const insights = useMemo(() => {
    const items = []
    if (stats.totalRevenue > 0) {
      items.push({ type: 'positive', title: 'Doanh thu ổn định', description: `Bạn đã tạo ra ${formatCurrency(stats.totalRevenue)} trong phạm vi bộ lọc hiện tại.` })
    }
    if (stats.completedBookings > 0) {
      items.push({ type: 'positive', title: 'Booking đã hoàn tất', description: `${stats.completedBookings} booking đã hoàn thành và đóng góp doanh thu.` })
    }
    if (stats.cancelledBookings > 0) {
      items.push({ type: 'warning', title: 'Cần chú ý tỷ lệ hủy', description: `${stats.cancelledBookings} booking bị hủy, có thể ảnh hưởng đến hiệu suất.` })
    }
    if (!items.length) {
      items.push({ type: 'neutral', title: 'Chưa có dữ liệu', description: 'Điều chỉnh bộ lọc để xem doanh thu từ các booking phù hợp.' })
    }
    return items
  }, [stats])

  const resetFilters = () => {
    setSearch('')
    setPeriod('30d')
    setDateRange('')
    setVenueFilter('all')
    setCourtFilter('all')
    setStatusFilter('all')
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.15),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-[32px] border border-slate-200/70 bg-white/80 p-8 text-center shadow-[0_24px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl">
            <p className="text-lg font-semibold text-slate-700">Đang tải dữ liệu doanh thu...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.15),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <Sparkles className="h-4 w-4" /> Owner Revenue Analytics
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Bảng điều khiển doanh thu</h1>
              <p className="mt-3 text-base leading-7 text-slate-600">Theo dõi doanh thu, xu hướng booking và hiệu quả vận hành từ các sân của bạn.</p>
            </div>
            <button onClick={() => refetch()} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <RefreshCw className="h-4 w-4" /> Tải lại
            </button>
          </div>

          <div className="mt-8">
            <RevenueStats stats={stats} />
          </div>
        </section>

        <RevenueFilters
          search={search}
          onSearchChange={setSearch}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          period={period}
          onPeriodChange={setPeriod}
          venueFilter={venueFilter}
          onVenueFilterChange={setVenueFilter}
          courtFilter={courtFilter}
          onCourtFilterChange={setCourtFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          venues={venues.filter((venue) => String(venue.owner_id) === String(user?.user_id))}
          courts={courts.filter((court) => venues.some((venue) => String(venue.venue_id) === String(court.venue_id) && String(venue.owner_id) === String(user?.user_id)))}
          onReset={resetFilters}
          onQuickFilter={(value) => { setPeriod(value); setDateRange('') }}
        />

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <RevenueChart data={chartData} />
          <RevenueInsights insights={insights} />
        </div>

        <RevenueTable bookings={filteredBookings.slice(0, 12)} />
      </div>
    </div>
  )
}
