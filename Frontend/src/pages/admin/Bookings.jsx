import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import BookingChart from '../../components/admin/BookingChart'
import BookingFilters from '../../components/admin/BookingFilters'
import BookingStats from '../../components/admin/BookingStats'
import BookingStatus from '../../components/admin/BookingStatus'
import BookingTable from '../../components/admin/BookingTable'
import BookingCalendar from '../../components/admin/BookingCalendar'
import RevenueChart from '../../components/admin/RevenueChart'
import bookingApi from '../../api/bookingApi'

const defaultFilters = {
  search: '',
  status: '',
  venue: '',
  court: '',
  customer: '',
  startDate: '',
  endDate: '',
  quickRange: '',
  minPrice: '',
  maxPrice: '',
}

const statusLabels = {
  pending: { text: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-700' },
  confirmed: { text: 'Đã xác nhận', className: 'bg-blue-100 text-blue-700' },
  completed: { text: 'Hoàn thành', className: 'bg-green-100 text-emerald-700' },
  cancelled: { text: 'Đã hủy', className: 'bg-rose-100 text-rose-700' },
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))

const normalizeBooking = (booking = {}) => ({
  booking_id: booking.booking_id ?? booking.id ?? booking.bookingId,
  user_id: booking.user_id ?? booking.userId,
  court_id: booking.court_id ?? booking.courtId,
  user_name:
    booking.user_name || booking.User?.full_name || booking.user?.full_name || booking.user_email || booking.email || 'Khách hàng',
  court_name:
    booking.court_name || booking.Court?.court_name || booking.court?.court_name || 'Sân',
  venue_name:
    booking.venue_name || booking.Venue?.venue_name || booking.venue?.venue_name || 'Khu vực',
  booking_date: booking.booking_date || booking.date || '',
  start_time: booking.start_time || booking.startTime || '',
  end_time: booking.end_time || booking.endTime || '',
  total_price: Number(booking.total_price ?? booking.price ?? 0),
  status: booking.status || 'pending',
  created_at: booking.created_at || booking.createdAt || '',
  notes: booking.notes || booking.note || '',
})

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(defaultFilters)
  const [sortBy, setSortBy] = useState('booking_date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [viewMode, setViewMode] = useState('table')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [savedFilters, setSavedFilters] = useState([])
  const [drawerBooking, setDrawerBooking] = useState(null)
  const [toast, setToast] = useState(null)

  const pageSize = 10

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3600)
  }, [])

  const loadBookings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await bookingApi.list()
      const rawBookings = response.data?.data?.bookings || []
      setBookings(rawBookings.map(normalizeBooking))
    } catch (error) {
      console.error(error)
      showToast('Không thể tải danh sách booking', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const filterOptions = useMemo(() => {
    const venues = []
    const courts = []
    const customers = []

    bookings.forEach((booking) => {
      if (booking.venue_name && !venues.some((item) => item.value === booking.venue_name)) {
        venues.push({ value: booking.venue_name, label: booking.venue_name })
      }
      if (booking.court_name && !courts.some((item) => item.value === booking.court_name)) {
        courts.push({ value: booking.court_name, label: booking.court_name })
      }
      if (booking.user_name && !customers.some((item) => item.value === booking.user_name)) {
        customers.push({ value: booking.user_name, label: booking.user_name })
      }
    })

    return { venues, courts, customers }
  }, [bookings])

  const filteredBookings = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())

    const rangeStart = filters.quickRange
      ? new Date(new Date().setDate(now.getDate() - Number(filters.quickRange) + 1))
      : filters.startDate
      ? new Date(filters.startDate)
      : null
    const rangeEnd = filters.quickRange
      ? now
      : filters.endDate
      ? new Date(filters.endDate)
      : null

    return bookings
      .filter((booking) => {
        const term = filters.search.trim().toLowerCase()
        const matchesSearch =
          !term ||
          booking.user_name.toLowerCase().includes(term) ||
          booking.court_name.toLowerCase().includes(term) ||
          booking.venue_name.toLowerCase().includes(term) ||
          String(booking.booking_id).includes(term)

        const matchesStatus = !filters.status || booking.status === filters.status
        const matchesVenue = !filters.venue || booking.venue_name === filters.venue
        const matchesCourt = !filters.court || booking.court_name === filters.court
        const matchesCustomer = !filters.customer || booking.user_name === filters.customer

        const bookingDate = new Date(booking.booking_date)
        const matchesRange = (() => {
          if (filters.quickRange) {
            return bookingDate >= rangeStart && bookingDate <= rangeEnd
          }
          if (rangeStart && rangeEnd) {
            return bookingDate >= rangeStart && bookingDate <= rangeEnd
          }
          if (rangeStart) {
            return bookingDate >= rangeStart
          }
          if (rangeEnd) {
            return bookingDate <= rangeEnd
          }
          return true
        })()

        const minPrice = Number(filters.minPrice || 0)
        const maxPrice = Number(filters.maxPrice || 0)
        const matchesPrice =
          (!minPrice || booking.total_price >= minPrice) &&
          (!maxPrice || booking.total_price <= maxPrice)

        return matchesSearch && matchesStatus && matchesVenue && matchesCourt && matchesCustomer && matchesRange && matchesPrice
      })
      .sort((a, b) => {
        let aValue = a[sortBy]
        let bValue = b[sortBy]

        if (sortBy === 'booking_date') {
          aValue = new Date(a.booking_date).getTime() || 0
          bValue = new Date(b.booking_date).getTime() || 0
        }

        if (sortBy === 'total_price') {
          aValue = Number(aValue || 0)
          bValue = Number(bValue || 0)
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      })
  }, [bookings, filters, sortBy, sortDirection])

  useEffect(() => {
    if (page > Math.ceil(filteredBookings.length / pageSize) && filteredBookings.length > 0) {
      setPage(1)
    }
  }, [filteredBookings.length, page])

  const pageCount = Math.max(1, Math.ceil(filteredBookings.length / pageSize))
  const currentBookings = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredBookings.slice(start, start + pageSize)
  }, [filteredBookings, page])

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => filteredBookings.some((booking) => booking.booking_id === id)))
  }, [filteredBookings])

  const stats = useMemo(() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    return bookings.reduce(
      (acc, booking) => {
        const bookingDate = new Date(booking.booking_date)
        acc.totalBookings += 1

        const isRevenueBooking = ['confirmed', 'completed'].includes(booking.status)
        if (isRevenueBooking) {
          acc.revenueTotal += booking.total_price
        }

        if (bookingDate.toDateString() === today.toDateString()) {
          acc.todayBookings += 1
          if (isRevenueBooking) {
            acc.revenueToday += booking.total_price
          }
        }
        if (bookingDate >= startOfWeek && bookingDate <= today) {
          acc.weekBookings += 1
        }
        if (bookingDate >= startOfMonth && bookingDate <= today) {
          acc.monthBookings += 1
          if (isRevenueBooking) {
            acc.revenueMonth += booking.total_price
          }
        }

        acc.statusCounts[booking.status] = (acc.statusCounts[booking.status] || 0) + 1
        return acc
      },
      {
        totalBookings: 0,
        todayBookings: 0,
        weekBookings: 0,
        monthBookings: 0,
        revenueToday: 0,
        revenueMonth: 0,
        revenueTotal: 0,
        statusCounts: { pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
      }
    )
  }, [bookings])

  const bookingsByHour = useMemo(() => {
    const counts = {}
    filteredBookings.forEach((booking) => {
      const hour = Number(booking.start_time?.split(':')[0])
      if (!Number.isInteger(hour)) return
      const label = `${hour.toString().padStart(2, '0')}:00`
      counts[label] = (counts[label] || 0) + 1
    })

    return Array.from({ length: 12 }, (_, idx) => {
      const hour = 8 + idx
      const label = `${hour.toString().padStart(2, '0')}:00`
      return { hour: label, count: counts[label] || 0 }
    })
  }, [filteredBookings])

  const bookingsByMonth = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - index))
      const label = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })
      return { label, key: `${date.getFullYear()}-${date.getMonth()}` }
    })

    const counts = months.reduce((acc, month) => ({ ...acc, [month.key]: 0 }), {})

    filteredBookings.forEach((booking) => {
      const date = new Date(booking.booking_date)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      if (counts[key] !== undefined) {
        counts[key] += 1
      }
    })

    return months.map((month) => ({ month: month.label, count: counts[month.key] || 0 }))
  }, [filteredBookings])

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(1)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters)
    setPage(1)
  }, [])

  const handleSaveFilter = useCallback(() => {
    const name = `Lọc ${savedFilters.length + 1}`
    setSavedFilters((prev) => [{ ...filters, name }, ...prev])
    showToast('Bộ lọc đã được lưu')
  }, [filters, savedFilters.length, showToast])

  const handleApplySavedFilter = useCallback((saved) => {
    setFilters(saved)
    setPage(1)
  }, [])

  const handleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortBy(field)
        setSortDirection('desc')
      }
    },
    [sortBy]
  )

  const handleSelectAll = useCallback(
    (checked) => {
      setSelectedIds(checked ? currentBookings.map((booking) => booking.booking_id) : [])
    },
    [currentBookings]
  )

  const handleSelectBooking = useCallback((id, checked) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)))
  }, [])

  const openDrawer = useCallback((booking) => {
    setDrawerBooking(booking)
  }, [])

  const closeDrawer = useCallback(() => {
    setDrawerBooking(null)
  }, [])

  const updateBookingStatus = useCallback(
    async (bookingId, nextStatus) => {
      try {
        const response = await bookingApi.update(bookingId, { status: nextStatus })
        const updated = normalizeBooking(response.data?.data?.booking || {})
        setBookings((prev) => prev.map((booking) => (booking.booking_id === bookingId ? updated : booking)))
        if (drawerBooking?.booking_id === bookingId) {
          setDrawerBooking(updated)
        }
        showToast('Cập nhật trạng thái thành công')
      } catch (error) {
        console.error(error)
        showToast('Cập nhật trạng thái thất bại', 'error')
      }
    },
    [drawerBooking, showToast]
  )

  const handleAction = useCallback(
    async (action, booking) => {
      if (!booking) return
      const map = { confirm: 'confirmed', complete: 'completed', cancel: 'cancelled' }
      const nextStatus = map[action]
      if (!nextStatus) return

      if (action === 'cancel') {
        const result = await Swal.fire({
          title: 'Xác nhận hủy booking',
          text: `Bạn có chắc chắn muốn hủy booking #${booking.booking_id}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Hủy',
          cancelButtonText: 'Trở lại',
          reverseButtons: true,
        })
        if (!result.isConfirmed) return
      }

      updateBookingStatus(booking.booking_id, nextStatus)
    },
    [updateBookingStatus]
  )

  const handleDeleteBooking = useCallback(
    async (booking) => {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: `Xóa booking #${booking.booking_id} của ${booking.user_name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        reverseButtons: true,
      })
      if (!result.isConfirmed) return

      try {
        await bookingApi.delete(booking.booking_id)
        setBookings((prev) => prev.filter((item) => item.booking_id !== booking.booking_id))
        if (drawerBooking?.booking_id === booking.booking_id) {
          closeDrawer()
        }
        showToast('Xóa booking thành công')
      } catch (error) {
        console.error(error)
        showToast('Xóa booking thất bại', 'error')
      }
    },
    [drawerBooking, closeDrawer, showToast]
  )

  const selectedCount = selectedIds.length

  return (
    <section className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <div className="flex-1 flex min-h-0 flex-col">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <header className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Admin / Bookings</p>
                  <h1 className="mt-3 text-3xl font-semibold text-slate-950">Quản lý đặt sân</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Dashboard điều hành đặt sân với báo cáo doanh thu, lịch đặt theo giờ và trạng thái booking theo thời gian thực.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
                    {filteredBookings.length.toLocaleString()} booking đang lọc
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode((prev) => (prev === 'table' ? 'calendar' : 'table'))}
                    className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Chuyển sang {viewMode === 'table' ? 'Lịch đặt' : 'Bảng dữ liệu'}
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto pb-10">
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <BookingStats
                    stats={{
                      totalBookings: stats.totalBookings,
                      todayBookings: stats.todayBookings,
                      weekBookings: stats.weekBookings,
                      monthBookings: stats.monthBookings,
                      pendingCount: stats.statusCounts.pending,
                      confirmedCount: stats.statusCounts.confirmed,
                      completedCount: stats.statusCounts.completed,
                      cancelledCount: stats.statusCounts.cancelled,
                      revenueToday: stats.revenueToday,
                      revenueMonth: stats.revenueMonth,
                    }}
                    loading={loading}
                  />
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <BookingFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                    onSaveFilter={handleSaveFilter}
                    savedFilters={savedFilters}
                    onApplySavedFilter={handleApplySavedFilter}
                    onToggleView={setViewMode}
                    viewMode={viewMode}
                    searchValue={filters.search}
                    onSearchChange={(value) => handleFilterChange('search', value)}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    selectedCount={selectedCount}
                    filterOptions={filterOptions}
                    loading={loading}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-8 space-y-6 min-h-0">
                    {viewMode === 'table' ? (
                      <BookingTable
                        bookings={currentBookings}
                        loading={loading}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelectBooking={handleSelectBooking}
                        onRowClick={openDrawer}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        page={page}
                        pageSize={pageSize}
                        setPage={setPage}
                        pageCount={pageCount}
                        totalCount={filteredBookings.length}
                        onAction={handleAction}
                      />
                    ) : (
                      <BookingCalendar bookings={filteredBookings} loading={loading} />
                    )}
                  </div>

                  <div className="lg:col-span-4 space-y-6 min-h-0">
                    <BookingChart bookingsByHour={bookingsByHour} bookingsByMonth={bookingsByMonth} loading={loading} range="6 giờ gần nhất" />
                    <RevenueChart bookingsByMonth={bookingsByMonth} range="6 tháng" />
                    <BookingStatus statusCounts={stats.statusCounts} totalBookings={stats.totalBookings} loading={loading} />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {drawerBooking && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 md:w-[420px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">Booking chi tiết</p>
              <p className="text-xs text-slate-500">#{drawerBooking.booking_id}</p>
            </div>
            <button onClick={closeDrawer} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200">
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="space-y-6 p-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Trạng thái</p>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-2 text-xs font-semibold ${statusLabels[drawerBooking.status]?.className || 'bg-slate-100 text-slate-700'}`}>
                    {statusLabels[drawerBooking.status]?.text || drawerBooking.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(drawerBooking.total_price)}</p>
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Khách hàng</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{drawerBooking.user_name}</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Sân / Khu vực</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{drawerBooking.court_name}</p>
                  <p className="mt-1 text-sm text-slate-500">{drawerBooking.venue_name}</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Thời gian</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{drawerBooking.booking_date}</p>
                  <p className="mt-1 text-sm text-slate-500">{drawerBooking.start_time} - {drawerBooking.end_time}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => handleAction('confirm', drawerBooking)}
                disabled={drawerBooking.status !== 'pending'}
                className="rounded-3xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Xác nhận booking
              </button>
              <button
                type="button"
                onClick={() => handleAction('complete', drawerBooking)}
                disabled={drawerBooking.status !== 'confirmed'}
                className="rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Đánh dấu hoàn thành
              </button>
              <button
                type="button"
                onClick={() => handleAction('cancel', drawerBooking)}
                disabled={drawerBooking.status === 'cancelled'}
                className="rounded-3xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Hủy booking
              </button>
              <button
                type="button"
                onClick={() => handleDeleteBooking(drawerBooking)}
                className="rounded-3xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                Xóa booking
              </button>
            </div>

            {drawerBooking.notes && (
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Ghi chú</p>
                <p className="mt-3 text-sm text-slate-700">{drawerBooking.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed right-5 top-5 z-50 rounded-3xl px-5 py-4 shadow-2xl transition ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </section>
  )
}
