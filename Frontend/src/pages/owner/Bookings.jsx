import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarDays, Sparkles, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import Swal from 'sweetalert2'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from '../../hooks/useAuth'
import bookingApi from '../../api/bookingApi'
import venueApi from '../../api/venueApi'
import courtApi from '../../api/courtApi'
import userApi from '../../api/userApi'
import BookingStats from '../../components/owner/bookings/BookingStats'
import BookingFilters from '../../components/owner/bookings/BookingFilters'
import BookingTable from '../../components/owner/bookings/BookingTable'
import BookingDrawer from '../../components/owner/bookings/BookingDrawer'
import BookingSkeleton from '../../components/owner/bookings/BookingSkeleton'
import BookingPagination from '../../components/owner/bookings/BookingPagination'
import BookingExport from '../../components/owner/bookings/BookingExport'

const BookingCalendar = React.lazy(() => import('../../components/owner/bookings/BookingCalendar'))
const BookingAnalytics = React.lazy(() => import('../../components/owner/bookings/BookingAnalytics'))

const fetchOwnerBookings = async (currentUser, venues, courts) => {
  const response = await bookingApi.list()
  const bookings = response?.data?.data?.bookings || []
  const ownerVenueIds = venues.filter((venue) => String(venue.owner_id) === String(currentUser?.user_id)).map((venue) => venue.venue_id)
  const ownerCourtIds = courts.filter((court) => ownerVenueIds.includes(court.venue_id)).map((court) => court.court_id)
  return bookings.filter((booking) => ownerCourtIds.includes(booking.court_id))
}

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const getPaymentStatus = (booking) => {
  const payment = booking.Payment?.status
  if (payment === 'paid') return 'paid'
  if (payment === 'refunded') return 'refunded'
  return 'unpaid'
}

export default function OwnerBookings() {
  const { user, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [bookingStatus, setBookingStatus] = useState('all')
  const [paymentStatus, setPaymentStatus] = useState('all')
  const [venueFilter, setVenueFilter] = useState('all')
  const [courtFilter, setCourtFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('booking_date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode, setViewMode] = useState('table')
  const [selectedIds, setSelectedIds] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data: venues = [] } = useQuery({
    queryKey: ['owner-booking-venues', user?.user_id],
    queryFn: () => venueApi.list().then((res) => res?.data?.data?.venues || []),
    enabled: !!user?.user_id,
    staleTime: 30_000,
  })

  const { data: courts = [] } = useQuery({
    queryKey: ['owner-booking-courts', user?.user_id],
    queryFn: () => courtApi.list().then((res) => res?.data?.data?.courts || []),
    enabled: !!user?.user_id,
    staleTime: 30_000,
  })

  const { data: users = [] } = useQuery({
    queryKey: ['owner-booking-users', user?.user_id],
    queryFn: () => userApi.list().then((res) => res?.data?.data?.users || []),
    enabled: !!user?.user_id,
    staleTime: 30_000,
  })

  const { data: bookings = [], isLoading, isFetching } = useQuery({
    queryKey: ['owner-bookings', user?.user_id],
    queryFn: () => fetchOwnerBookings(user, venues, courts),
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
        address: venue?.address || booking?.Court?.Venue?.address || '—',
        customerName: customer?.full_name || booking?.User?.full_name || `User ${booking.user_id}`,
        customerEmail: customer?.email || booking?.User?.email || '—',
        customerPhone: customer?.phone || booking?.User?.phone || '—',
        paymentStatus: getPaymentStatus(booking),
        durationHours: booking?.start_time && booking?.end_time ? `${Math.max(1, Math.round((new Date(`1970-01-01T${booking.end_time}`) - new Date(`1970-01-01T${booking.start_time}`)) / 3600000))}h` : '—',
      }
    })
  }, [bookings, courts, users, venues])

  const stats = useMemo(() => {
    const totalBookings = normalizedBookings.length
    const todayBookings = normalizedBookings.filter((booking) => booking.booking_date === new Date().toISOString().slice(0, 10)).length
    const weekBookings = normalizedBookings.filter((booking) => {
      const date = new Date(booking.booking_date)
      const start = new Date()
      start.setDate(start.getDate() - 6)
      return date >= start && date <= new Date()
    }).length
    const monthBookings = normalizedBookings.filter((booking) => booking.booking_date?.slice(0, 7) === new Date().toISOString().slice(0, 7)).length
    const totalRevenue = normalizedBookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0)
    const monthRevenue = normalizedBookings.filter((booking) => booking.booking_date?.slice(0, 7) === new Date().toISOString().slice(0, 7)).reduce((sum, booking) => sum + Number(booking.total_price || 0), 0)
    const occupancy = normalizedBookings.length ? Math.round((normalizedBookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'completed').length / normalizedBookings.length) * 100) : 0
    const cancelRate = normalizedBookings.length ? Math.round((normalizedBookings.filter((booking) => booking.status === 'cancelled').length / normalizedBookings.length) * 100) : 0
    return { totalBookings, todayBookings, weekBookings, monthBookings, totalRevenue, monthRevenue, occupancy, cancelRate }
  }, [normalizedBookings])

  const filteredBookings = useMemo(() => {
    const keyword = debouncedSearch.toLowerCase()
    const list = normalizedBookings.filter((booking) => {
      const matchesSearch = `${booking.customerName || ''} ${booking.customerEmail || ''} ${booking.booking_id || ''} ${booking.courtName || ''} ${booking.venueName || ''}`.toLowerCase().includes(keyword)
      const matchesStatus = bookingStatus === 'all' || booking.status === bookingStatus
      const matchesPayment = paymentStatus === 'all' || booking.paymentStatus === paymentStatus
      const matchesVenue = venueFilter === 'all' || String(booking.venue_id || booking.Court?.venue_id) === String(venueFilter)
      const matchesCourt = courtFilter === 'all' || String(booking.court_id) === String(courtFilter)
      const matchesDate = !dateFilter || String(booking.booking_date) === dateFilter
      const matchesMonth = !monthFilter || String(booking.booking_date).slice(0, 7) === monthFilter
      const matchesPrice = priceFilter === 'all' || (priceFilter === 'lt100' ? Number(booking.total_price || 0) < 100000 : priceFilter === '100_300' ? Number(booking.total_price || 0) >= 100000 && Number(booking.total_price || 0) <= 300000 : Number(booking.total_price || 0) > 300000)
      return matchesSearch && matchesStatus && matchesPayment && matchesVenue && matchesCourt && matchesDate && matchesMonth && matchesPrice
    })

    return [...list].sort((a, b) => {
      const direction = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'total_price') return (Number(a.total_price || 0) - Number(b.total_price || 0)) * direction
      if (sortBy === 'customerName') return String(a.customerName || '').localeCompare(String(b.customerName || '')) * direction
      if (sortBy === 'status') return String(a.status || '').localeCompare(String(b.status || '')) * direction
      return (new Date(a.booking_date || 0) - new Date(b.booking_date || 0)) * direction
    })
  }, [normalizedBookings, debouncedSearch, bookingStatus, paymentStatus, venueFilter, courtFilter, dateFilter, monthFilter, priceFilter, sortBy, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / 15))
  const pagedBookings = useMemo(() => filteredBookings.slice((currentPage - 1) * 15, currentPage * 15), [filteredBookings, currentPage])

  const resetFilters = useCallback(() => {
    setSearch('')
    setBookingStatus('all')
    setPaymentStatus('all')
    setVenueFilter('all')
    setCourtFilter('all')
    setDateFilter('')
    setMonthFilter('')
    setPriceFilter('all')
    setSortBy('booking_date')
    setSortOrder('desc')
    setCurrentPage(1)
  }, [])

  const handleStatusChange = useCallback(async (booking, status) => {
    const result = await Swal.fire({ title: 'Cập nhật trạng thái booking?', icon: 'question', showCancelButton: true, confirmButtonText: 'Xác nhận', cancelButtonText: 'Hủy' })
    if (!result.isConfirmed) return
    try {
      setUpdating(true)
      await bookingApi.update(booking.booking_id, { status })
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] })
      toast.success('Đã cập nhật trạng thái booking')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể cập nhật booking')
    } finally {
      setUpdating(false)
    }
  }, [queryClient])

  const handleBulkAction = useCallback(async (status) => {
    if (!selectedIds.length) return
    const result = await Swal.fire({ title: `Cập nhật ${selectedIds.length} booking đã chọn?`, icon: 'question', showCancelButton: true, confirmButtonText: 'Xác nhận', cancelButtonText: 'Hủy' })
    if (!result.isConfirmed) return
    try {
      setUpdating(true)
      await Promise.all(selectedIds.map((id) => bookingApi.update(id, { status })))
      setSelectedIds([])
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] })
      toast.success('Đã cập nhật các booking đã chọn')
    } catch (error) {
      toast.error('Không thể cập nhật hàng loạt')
    } finally {
      setUpdating(false)
    }
  }, [queryClient, selectedIds])

  const toggleSelect = useCallback((bookingId) => {
    setSelectedIds((prev) => (prev.includes(bookingId) ? prev.filter((id) => id !== bookingId) : [...prev, bookingId]))
  }, [])

  const copyBookingId = useCallback(async (bookingId) => {
    await navigator.clipboard.writeText(String(bookingId))
    toast.success('Đã sao chép mã booking')
  }, [])

  if (authLoading || isLoading) {
    return <BookingSkeleton />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.15),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <ToastContainer position="top-right" theme="light" />
        <section className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <Sparkles className="h-4 w-4" /> Owner Booking Management
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Quản lý đơn đặt sân</h1>
              <p className="mt-3 text-base leading-7 text-slate-600">Theo dõi, xác nhận và tối ưu doanh thu từ các đơn đặt sân của bạn.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedIds.length > 0 && (
                <>
                  <button onClick={() => handleBulkAction('confirmed')} className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
                    <CheckCircle2 className="h-4 w-4" /> Xác nhận nhiều
                  </button>
                  <button onClick={() => handleBulkAction('cancelled')} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                    <XCircle className="h-4 w-4" /> Hủy nhiều
                  </button>
                </>
              )}
              <button onClick={() => queryClient.invalidateQueries({ queryKey: ['owner-bookings'] })} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                <RefreshCw className="h-4 w-4" /> Tải lại
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Tổng booking</span><CalendarDays className="h-4 w-4" /></div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.totalBookings}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Booking hôm nay</span><CalendarDays className="h-4 w-4" /></div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.todayBookings}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Booking tuần này</span><CalendarDays className="h-4 w-4" /></div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stats.weekBookings}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-sm text-slate-500"><span>Doanh thu tháng</span><CalendarDays className="h-4 w-4" /></div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{formatCurrency(stats.monthRevenue)}</div>
            </div>
          </div>
        </section>

        <BookingStats stats={stats} />
        <BookingFilters search={search} onSearchChange={setSearch} bookingStatus={bookingStatus} onBookingStatusChange={setBookingStatus} paymentStatus={paymentStatus} onPaymentStatusChange={setPaymentStatus} venueFilter={venueFilter} onVenueFilterChange={setVenueFilter} courtFilter={courtFilter} onCourtFilterChange={setCourtFilter} dateFilter={dateFilter} onDateFilterChange={setDateFilter} monthFilter={monthFilter} onMonthFilterChange={setMonthFilter} priceFilter={priceFilter} onPriceFilterChange={setPriceFilter} venues={venues} courts={courts} onReset={resetFilters} viewMode={viewMode} onViewModeChange={setViewMode} sortBy={sortBy} onSortByChange={setSortBy} sortOrder={sortOrder} onSortOrderChange={setSortOrder} />

        {isFetching && <div className="text-sm text-slate-500">Đang đồng bộ dữ liệu booking...</div>}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl">
          <div className="text-sm text-slate-500">Hiển thị {filteredBookings.length} booking cho owner hiện tại</div>
          <BookingExport bookings={filteredBookings} onExport={() => window.print()} />
        </div>

        <Suspense fallback={<BookingSkeleton />}>
          <BookingAnalytics analytics={{ monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], monthBookings: [3, 6, 5, 7, 9, 8], hourLabels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'], hourBookings: [2, 5, 7, 6, 8, 4], statusLabels: ['Confirmed', 'Pending', 'Cancelled'], statusValues: [12, 4, 2] }} />
        </Suspense>

        {viewMode === 'table' ? (
          <>
            {!filteredBookings.length ? (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl">
                <p className="text-lg font-semibold text-slate-900">📅 Chưa có đơn đặt sân nào</p>
                <p className="mt-2 text-sm text-slate-600">Các booking mới sẽ xuất hiện ở đây khi khách hàng đặt sân.</p>
              </div>
            ) : (
              <>
                <BookingTable bookings={pagedBookings} selectedIds={selectedIds} onToggleSelect={toggleSelect} onOpenDrawer={(booking) => setSelectedBooking(booking)} onStatusChange={handleStatusChange} onCopy={copyBookingId} />
                <BookingPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </>
        ) : (
          <Suspense fallback={<BookingSkeleton />}>
            <BookingCalendar bookings={pagedBookings} onSelectBooking={(booking) => setSelectedBooking(booking)} />
          </Suspense>
        )}
      </div>

      <BookingDrawer isOpen={!!selectedBooking} booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  )
}
