import React, { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import authApi from '../../api/authApi'
import bookingApi from '../../api/bookingApi'
import formatDate from '../../utils/formatDate'
import formatMoney from '../../utils/formatMoney'
import BookingFilters from '../../components/client/my-bookings/BookingFilters'
import BookingStats from '../../components/client/my-bookings/BookingStats'
import BookingCard from '../../components/client/my-bookings/BookingCard'
import BookingDetailDrawer from '../../components/client/my-bookings/BookingDetailDrawer'
import BookingSkeleton from '../../components/client/my-bookings/BookingSkeleton'
import EmptyBookings from '../../components/client/my-bookings/EmptyBookings'

const statusLabels = {
  all: 'Tất cả',
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
}

const sortHandlers = {
  newest: (list) => [...list].sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date) || b.start_time.localeCompare(a.start_time)),
  oldest: (list) => [...list].sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date) || a.start_time.localeCompare(b.start_time)),
  priceHigh: (list) => [...list].sort((a, b) => Number(b.total_price) - Number(a.total_price)),
  priceLow: (list) => [...list].sort((a, b) => Number(a.total_price) - Number(b.total_price)),
}

export default function MyBookings() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [activeBooking, setActiveBooking] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const userQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authApi.profile()
      return response.data.data.user
    },
    retry: false,
  })

  const bookingsQuery = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const response = await bookingApi.list()
      return response.data.data.bookings || []
    },
    staleTime: 1000 * 60 * 2,
  })

  const currentUserBookings = useMemo(() => {
    const allBookings = bookingsQuery.data || []
    const currentUserId = userQuery.data?.user_id || userQuery.data?.id || userQuery.data?.ID
    if (!currentUserId) return allBookings
    return allBookings.filter(
      (booking) => booking.user_id === currentUserId || booking.User?.user_id === currentUserId || booking.User?.id === currentUserId,
    )
  }, [bookingsQuery.data, userQuery.data])

  const filteredBookings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()
    const baseList = statusFilter === 'all' ? currentUserBookings : currentUserBookings.filter((booking) => booking.status === statusFilter)
    const searched = search
      ? baseList.filter((booking) => {
          const venueName = booking.venue?.name || booking.venue?.venue_name || booking.Court?.Venue?.venue_name || ''
          const courtName = booking.court?.name || booking.court?.court_name || booking.Court?.court_name || ''
          const code = booking.booking_code || booking.booking_id || ''
          return [venueName, courtName, code].some((value) => value.toLowerCase().includes(search))
        })
      : baseList
    return sortHandlers[sortOrder]?.(searched) || searched
  }, [currentUserBookings, searchTerm, statusFilter, sortOrder])

  const stats = useMemo(() => {
    const total = currentUserBookings.length
    const pending = currentUserBookings.filter((booking) => booking.status === 'pending').length
    const confirmed = currentUserBookings.filter((booking) => booking.status === 'confirmed').length
    const completed = currentUserBookings.filter((booking) => booking.status === 'completed').length
    const cancelled = currentUserBookings.filter((booking) => booking.status === 'cancelled').length
    const revenue = currentUserBookings.reduce((sum, booking) => sum + Number(booking.total_price || 0), 0)

    return [
      { label: 'Tổng booking', value: total, meta: `${formatMoney(revenue)} tổng` },
      { label: 'Chờ xử lý', value: pending },
      { label: 'Đã xác nhận', value: confirmed },
      { label: 'Hoàn thành', value: completed },
      { label: 'Đã hủy', value: cancelled },
    ]
  }, [currentUserBookings])

  const cancelMutation = useMutation({
    mutationFn: async (bookingId) => {
      return bookingApi.update(bookingId, { status: 'cancelled' })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['myBookings'])
      toast.success('Booking đã được huỷ thành công.')
      setDrawerOpen(false)
    },
    onError: () => {
      toast.error('Không thể huỷ booking. Vui lòng thử lại sau.')
    },
  })

  const isLoading = userQuery.isLoading || bookingsQuery.isLoading
  const error = userQuery.error || bookingsQuery.error

  const handleViewDetails = useCallback((booking) => {
    setActiveBooking(booking)
    setDrawerOpen(true)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false)
    setTimeout(() => setActiveBooking(null), 200)
  }, [])

  const handleCancelBooking = useCallback(
    async (booking) => {
      const result = await Swal.fire({
        title: 'Xác nhận hủy booking',
        text: 'Bạn có chắc chắn muốn huỷ booking này? Hành động không thể hoàn tác.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, huỷ',
        cancelButtonText: 'Không',
      })

      if (!result.isConfirmed) return

      await cancelMutation.mutateAsync(booking.booking_id || booking.id || booking.bookingId)
    },
    [cancelMutation],
  )

  const headerSubtitle = useMemo(() => {
    if (isLoading) return 'Đang tải booking của bạn...'
    if (error) return 'Không thể tải lịch sử booking. Vui lòng thử lại.'
    return `${filteredBookings.length} booking được tìm thấy trong hồ sơ của bạn.`
  }, [error, filteredBookings.length, isLoading])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Hồ sơ khách hàng</p>
          <h1 className="text-4xl font-semibold text-slate-950">Quản lý booking của tôi</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">Xem, lọc và quản lý các lượt đặt sân của bạn với chi tiết thanh toán, trạng thái và options đặt lại.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <BookingFilters
              status={statusFilter}
              onStatusChange={setStatusFilter}
              search={searchTerm}
              onSearchChange={setSearchTerm}
              sort={sortOrder}
              onSortChange={setSortOrder}
            />

            <BookingStats stats={stats} />
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Tóm tắt</p>
            <p className="mt-4 text-sm text-slate-700">{headerSubtitle}</p>
            <div className="mt-6 space-y-3 rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Người dùng</span>
                <span>{userQuery.data?.full_name || userQuery.data?.name || 'Khách hàng'}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Email</span>
                <span>{userQuery.data?.email || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Booking gần nhất</span>
                <span>{currentUserBookings[0] ? formatDate(currentUserBookings[0].booking_date) : 'Chưa có'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <BookingSkeleton />
        ) : error ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">
            <p className="text-lg font-semibold">Có lỗi xảy ra khi tải booking.</p>
            <p className="mt-2 text-sm">Vui lòng làm mới trang hoặc kiểm tra kết nối mạng.</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.booking_id || booking.id}
                booking={booking}
                onView={handleViewDetails}
                onAction={(action) => action === 'cancel' && handleCancelBooking(booking)}
              />
            ))}
          </div>
        )}
      </div>

      <BookingDetailDrawer booking={activeBooking} open={drawerOpen} onClose={handleCloseDrawer} />
    </section>
  )
}
