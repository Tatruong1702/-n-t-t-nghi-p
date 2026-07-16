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
import bookingApi from '../../api/bookingApi'
import venueApi from '../../api/venueApi'
import ReportsHeader from '../../components/admin/ReportsHeader'
import ReportsFilters from '../../components/admin/ReportsFilters'
import ReportsStats from '../../components/admin/ReportsStats'
import RevenueAnalytics from '../../components/admin/RevenueAnalytics'
import BookingAnalytics from '../../components/admin/BookingAnalytics'
import VenuePerformance from '../../components/admin/VenuePerformance'
import CustomerAnalytics from '../../components/admin/CustomerAnalytics'
import GeographicAnalytics from '../../components/admin/GeographicAnalytics'
import RecentActivity from '../../components/admin/RecentActivity'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler)

const statusLabels = {
  completed: { label: 'Hoàn thành', color: '#10b981' },
  confirmed: { label: 'Đã xác nhận', color: '#3b82f6' },
  pending: { label: 'Chờ xác nhận', color: '#f59e0b' },
  cancelled: { label: 'Đã hủy', color: '#ef4444' },
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const formatDate = (value) => {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const getDateKey = (date) => {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const buildTimeline = (days, bookings) => {
  const now = new Date()
  const labels = [...Array(days)].map((_, index) => {
    const day = new Date(now)
    day.setDate(now.getDate() - (days - 1 - index))
    return formatDate(day)
  })

  const counts = labels.map((_, index) => {
    const day = new Date(now)
    day.setDate(now.getDate() - (days - 1 - index))
    const key = getDateKey(day)
    return bookings.filter((booking) => getDateKey(booking.booking_date) === key).length
  })

  const revenue = labels.map((_, index) => {
    const day = new Date(now)
    day.setDate(now.getDate() - (days - 1 - index))
    const key = getDateKey(day)
    return bookings
      .filter((booking) => getDateKey(booking.booking_date) === key)
      .reduce((sum, booking) => sum + Number(booking.total_price || 0), 0)
  })

  return { labels, counts, revenue }
}

export default function AdminReports() {
  const [venues, setVenues] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ period: '30', venueId: '', ownerId: '', region: '', status: '' })
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [venuesRes, bookingsRes] = await Promise.all([venueApi.list(), bookingApi.list()])
        setVenues(venuesRes.data.data.venues || [])
        setBookings(bookingsRes.data.data.bookings || [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const owners = useMemo(() => {
    const map = new Map()
    venues.forEach((venue) => {
      const ownerId = venue.owner_id || venue.Owner?.id || venue.User?.id || venue.user_id
      const ownerName = venue.owner_name || venue.Owner?.full_name || venue.User?.full_name || venue.user_name || 'Chủ sân'
      if (ownerId) map.set(ownerId, { owner_id: ownerId, owner_name: ownerName })
    })
    return Array.from(map.values())
  }, [venues])

  const regions = useMemo(
    () => Array.from(new Set(venues.map((venue) => venue.city || venue.address || 'Chưa xác định'))),
    [venues]
  )

  const venueMap = useMemo(
    () => venues.reduce((acc, venue) => {
      acc[venue.venue_id] = venue
      return acc
    }, {}),
    [venues]
  )

  const filteredBookings = useMemo(
    () => bookings.filter((booking) => {
      if (filters.status && booking.status !== filters.status) return false
      if (filters.venueId && String(booking.venue_id) !== String(filters.venueId)) return false
      if (filters.ownerId && String(booking.owner_id) !== String(filters.ownerId) && String(booking.Owner?.id) !== String(filters.ownerId)) return false
      if (filters.region) {
        const venue = venueMap[booking.venue_id]
        if (!venue || !((venue.city || venue.address || '').includes(filters.region))) return false
      }
      return true
    }),
    [bookings, filters, venueMap]
  )

  const confirmedBookings = useMemo(
    () => filteredBookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'completed'),
    [filteredBookings]
  )

  const activeVenues = useMemo(
    () => venues.filter((venue) => Number(venue.status) === 1).length,
    [venues]
  )

  const totalRevenue = useMemo(
    () => confirmedBookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0),
    [confirmedBookings]
  )

  const totalBookings = useMemo(() => filteredBookings.length, [filteredBookings])

  const uniqueCustomers = useMemo(() => {
    const ids = new Set(
      filteredBookings
        .map((booking) => booking.user_id || booking.user_name || booking.email)
        .filter((value) => value !== undefined && value !== null)
    )
    return ids.size
  }, [filteredBookings])

  const statusCounts = useMemo(
    () => filteredBookings.reduce((acc, booking) => {
      const status = booking.status || 'pending'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, { completed: 0, confirmed: 0, pending: 0, cancelled: 0 }),
    [filteredBookings]
  )

  const todayKey = getDateKey(new Date())
  const revenueToday = useMemo(
    () => confirmedBookings
      .filter((booking) => getDateKey(booking.booking_date) === todayKey)
      .reduce((sum, booking) => sum + Number(booking.total_price || 0), 0),
    [confirmedBookings, todayKey]
  )

  const revenueMonth = useMemo(() => {
    const now = new Date()
    return confirmedBookings.reduce((sum, booking) => {
      const date = new Date(booking.booking_date)
      if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
        return sum + Number(booking.total_price || 0)
      }
      return sum
    }, 0)
  }, [confirmedBookings])

  const todayBookings = useMemo(
    () => filteredBookings.filter((booking) => getDateKey(booking.booking_date) === todayKey).length,
    [filteredBookings, todayKey]
  )

  const weekBookings = useMemo(
    () => filteredBookings.filter((booking) => {
      const delta = Math.floor((new Date() - new Date(booking.booking_date)) / (1000 * 60 * 60 * 24))
      return delta >= 0 && delta < 7
    }).length,
    [filteredBookings]
  )

  const monthBookings = useMemo(() => {
    const now = new Date()
    return filteredBookings.filter((booking) => {
      const date = new Date(booking.booking_date)
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    }).length
  }, [filteredBookings])

  const newCustomers = useMemo(
    () => filteredBookings.filter((booking) => booking.is_new_customer).length,
    [filteredBookings]
  )

  const cancelRate = useMemo(
    () => filteredBookings.length ? ((statusCounts.cancelled || 0) / filteredBookings.length) * 100 : 0,
    [filteredBookings, statusCounts]
  )

  const recentBookings = useMemo(
    () => [...filteredBookings].sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date)).slice(0, 5),
    [filteredBookings]
  )

  const timeline = useMemo(() => buildTimeline(Number(filters.period), confirmedBookings), [confirmedBookings, filters.period])

  const venueStats = useMemo(() => {
    const stats = venues.map((venue) => ({
      ...venue,
      revenue: 0,
      booking_count: 0,
      occupancy_rate: 0,
      month_growth: 0,
    }))
    const map = stats.reduce((acc, venue) => {
      acc[venue.venue_id] = venue
      return acc
    }, {})

    confirmedBookings.forEach((booking) => {
      const venue = map[booking.venue_id]
      if (!venue) return
      venue.revenue += Number(booking.total_price || 0)
      venue.booking_count += 1
    })

    return stats.map((venue) => ({
      ...venue,
      occupancy_rate: venue.booking_count > 0 ? Math.min(Math.round((venue.booking_count / 50) * 100), 100) : 0,
      month_growth: Math.floor(Math.random() * 20) - 10,
    }))
  }, [venues, confirmedBookings])

  const reportEvents = useMemo(
    () => recentBookings.map((booking) => ({
      id: booking.booking_id,
      type: booking.status === 'completed' ? 'complete' : booking.status === 'cancelled' ? 'canceled' : 'booked',
      title: `Booking #${booking.booking_id}`,
      description: `${booking.user_name || booking.User?.full_name || 'Khách'} trên sân ${booking.venue_name || booking.Court?.Venue?.venue_name || 'Chưa xác định'}`,
      timeLabel: formatDate(booking.booking_date),
      meta: `${booking.start_time || '??'} - ${booking.end_time || '??'} • ${statusLabels[booking.status]?.label || booking.status}`,
    })),
    [recentBookings]
  )

  const handleUpdateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({ period: '30', venueId: '', ownerId: '', region: '', status: '' })
  }

  const handleQuickRange = (value) => {
    setFilters((prev) => ({ ...prev, period: value }))
  }

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const [venuesRes, bookingsRes] = await Promise.all([venueApi.list(), bookingApi.list()])
      setVenues(venuesRes.data.data.venues || [])
      setBookings(bookingsRes.data.data.bookings || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    alert('Chức năng xuất CSV đang được phát triển.')
  }

  const handleExportPDF = () => {
    alert('Chức năng xuất PDF đang được phát triển.')
  }

  const handleCopyReport = () => {
    navigator.clipboard.writeText(`Báo cáo điều hành sân bóng - ${new Date().toLocaleString()}`)
    alert('Đã sao chép báo cáo rút gọn vào clipboard.')
  }

  const handleToggleAutoRefresh = () => {
    setAutoRefresh((prev) => !prev)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-slate-100 text-sm font-sans">
      <div className="flex min-h-screen overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl space-y-6">
              <ReportsHeader
                title="Báo cáo quản trị sân bóng"
                subtitle="Analytics Dashboard"
                periodLabel={`${filters.period} ngày gần nhất`}
                autoRefresh={autoRefresh}
                onRefresh={handleRefresh}
                onExportCSV={handleExportCSV}
                onExportPDF={handleExportPDF}
                onCopyReport={handleCopyReport}
                onToggleAutoRefresh={handleToggleAutoRefresh}
              />

              <ReportsFilters
                filters={filters}
                owners={owners}
                venues={venues}
                regions={regions}
                onUpdateFilter={handleUpdateFilter}
                onReset={handleResetFilters}
                onQuickRange={handleQuickRange}
              />

              <ReportsStats
                stats={{
                  totalRevenue: Number.isFinite(totalRevenue) ? totalRevenue : 0,
                  todayRevenue: Number.isFinite(revenueToday) ? revenueToday : 0,
                  monthRevenue: Number.isFinite(revenueMonth) ? revenueMonth : 0,
                  totalBookings: Number.isFinite(totalBookings) ? totalBookings : 0,
                  todayBookings: Number.isFinite(todayBookings) ? todayBookings : 0,
                  weekBookings: Number.isFinite(weekBookings) ? weekBookings : 0,
                  monthBookings: Number.isFinite(monthBookings) ? monthBookings : 0,
                  totalCustomers: Number.isFinite(uniqueCustomers) ? uniqueCustomers : 0,
                  newCustomers: Number.isFinite(newCustomers) ? newCustomers : 0,
                  totalVenues: Number.isFinite(venues.length) ? venues.length : 0,
                  activeVenues: Number.isFinite(activeVenues) ? activeVenues : 0,
                  cancelRate: Number.isFinite(cancelRate) ? cancelRate : 0,
                }}
              />

              <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <RevenueAnalytics
                  timeline={timeline}
                  periodDays={filters.period}
                  onChangePeriod={handleQuickRange}
                  summary={{
                    current: revenueMonth,
                    growth: 12.5,
                    forecast: Math.round(revenueMonth * 1.08),
                  }}
                />
                <BookingAnalytics bookings={filteredBookings} venueMap={venueMap} />
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <VenuePerformance venues={venueStats} />
                <CustomerAnalytics bookings={filteredBookings} />
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <GeographicAnalytics bookings={filteredBookings} venues={venues} />
                <RecentActivity events={reportEvents} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
