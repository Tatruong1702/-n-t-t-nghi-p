import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import axiosClient from '../../api/axiosClient'
import authApi from '../../api/authApi'
import bookingApi from '../../api/bookingApi'
import courtApi from '../../api/courtApi'
import reviewApi from '../../api/reviewApi'
import venueApi from '../../api/venueApi'
import paymentApi from '../../api/paymentApi'
import formatMoney from '../../utils/formatMoney'

const BookingHero = lazy(() => import('../../components/client/booking/BookingHero'))
const CourtSelector = lazy(() => import('../../components/client/booking/CourtSelector'))
const DateSelector = lazy(() => import('../../components/client/booking/DateSelector'))
const TimeSelector = lazy(() => import('../../components/client/booking/TimeSelector'))
const BookingSummary = lazy(() => import('../../components/client/booking/BookingSummary'))
const BookingHistory = lazy(() => import('../../components/client/booking/BookingHistory'))
const ReviewSection = lazy(() => import('../../components/client/booking/ReviewSection'))
const BookingSkeleton = lazy(() => import('../../components/client/booking/BookingSkeleton'))
const EmptyBooking = lazy(() => import('../../components/client/booking/EmptyBooking'))

const SERVICE_FEE = 15000
const TAX_RATE = 0.1

const buildPromotionList = (promotions) => {
  return promotions.map((promotion, index) => ({
    id: promotion.id || `${promotion.code}-${index}`,
    title: promotion.title || promotion.code || 'Ưu đãi đặc biệt',
    description: promotion.description || 'Giảm giá cho lần đặt sân tiếp theo.',
    code: promotion.code || promotion.id || `PROMO${index}`,
    discountLabel: promotion.discountLabel || 'Up to 15%',
  }))
}

const getHoursDifference = (startTime, endTime) => {
  if (!startTime || !endTime) return 0
  const startHour = Number(startTime.split(':')[0])
  const endHour = Number(endTime.split(':')[0])
  return Math.max(0, endHour - startHour)
}

const calculateDiscount = (promoCode, basePrice) => {
  if (!promoCode?.trim() || basePrice <= 0) return 0
  return Math.min(basePrice * 0.15, 50000)
}

export default function Booking() {
  const [searchParams] = useSearchParams()
  const venueId = searchParams.get('venue_id')
  const navigate = useNavigate()
  const historyRef = useRef(null)
  const queryClient = useQueryClient()

  const { register, watch, setValue, handleSubmit, reset } = useForm({
    defaultValues: {
      court_id: '',
      booking_date: '',
      start_time: '',
      end_time: '',
      promo_code: '',
      payment_method: 'cash',
    },
  })

  const selectedCourtId = watch('court_id')
  const bookingDate = watch('booking_date')
  const startTime = watch('start_time')
  const endTime = watch('end_time')
  const promoCode = watch('promo_code')
  const paymentMethod = watch('payment_method')

  useEffect(() => {
    if (!venueId) return
    setValue('court_id', '')
    setValue('booking_date', '')
    setValue('start_time', '')
    setValue('end_time', '')
  }, [venueId, setValue])

  const userQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authApi.profile()
      return response.data.data.user
    },
    retry: false,
  })

  const venueQuery = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const response = await venueApi.get(venueId)
      return response.data.data.venue
    },
    enabled: Boolean(venueId),
    retry: false,
  })

  const selectedVenue = venueQuery.data || null

  const courtsQuery = useQuery({
    queryKey: ['courts', selectedVenue?.venue_id],
    queryFn: async () => {
      const params = selectedVenue?.venue_id ? { venue_id: selectedVenue.venue_id } : {}
      const response = await courtApi.list(params)
      return response.data.data.courts || []
    },
    enabled: Boolean(selectedVenue?.venue_id),
    keepPreviousData: true,
  })

  useEffect(() => {
    if (!selectedCourtId && courtsQuery.data?.length) {
      setValue('court_id', courtsQuery.data[0].court_id?.toString() || '')
    }
  }, [courtsQuery.data, selectedCourtId, setValue])

  const bookingsQuery = useQuery({
    queryKey: ['courtBookings', selectedCourtId, bookingDate],
    queryFn: async () => {
      const response = await bookingApi.search({ court_id: selectedCourtId, booking_date: bookingDate })
      return response.data.data.bookings || []
    },
    enabled: Boolean(selectedCourtId && bookingDate),
    keepPreviousData: true,
  })

  const historyQuery = useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const response = await bookingApi.list()
      return response.data.data.bookings || []
    },
    staleTime: 1000 * 60 * 2,
  })

  const reviewQuery = useQuery({
    queryKey: ['reviews', selectedVenue?.venue_id],
    queryFn: async () => {
      const response = await reviewApi.list({ venue_id: selectedVenue?.venue_id })
      return response.data.data.reviews || []
    },
    enabled: Boolean(selectedVenue?.venue_id),
    retry: false,
  })

  const promotionsQuery = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/promotions')
        return response.data.data.promotions || []
      } catch {
        return []
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  const courts = courtsQuery.data || []
  const selectedCourt = useMemo(
    () => courts.find((court) => court.court_id.toString() === selectedCourtId?.toString()) || courts[0] || null,
    [courts, selectedCourtId],
  )

  const hours = useMemo(() => getHoursDifference(startTime, endTime), [startTime, endTime])
  const basePrice = useMemo(() => (selectedCourt?.price_per_hour ? Number(selectedCourt.price_per_hour) * hours : 0), [selectedCourt, hours])
  const discount = useMemo(() => calculateDiscount(promoCode, basePrice), [promoCode, basePrice])
  const fee = useMemo(() => (hours > 0 ? SERVICE_FEE : 0), [hours])
  const tax = useMemo(() => (basePrice + fee - discount) * TAX_RATE, [basePrice, fee, discount])
  const total = useMemo(() => basePrice + fee - discount + tax, [basePrice, fee, discount, tax])

  const availablePromotions = useMemo(() => buildPromotionList(promotionsQuery.data || []), [promotionsQuery.data])
  const averageRating = useMemo(() => {
    if (!reviewQuery.data?.length) return 0
    const totalRating = reviewQuery.data.reduce((sum, item) => sum + Number(item.rating || 0), 0)
    return totalRating / reviewQuery.data.length
  }, [reviewQuery.data])

  const isLoading = venueQuery.isLoading || courtsQuery.isLoading || userQuery.isLoading
  const isBookingLoading = bookingsQuery.isFetching

  const bookingMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await bookingApi.create(payload)
      return response.data.data.booking
    },
    onSuccess: async (booking) => {
      await queryClient.invalidateQueries(['courtBookings', selectedCourtId, bookingDate])
      await queryClient.invalidateQueries(['myBookings'])
      if (paymentMethod !== 'cash') {
        await paymentApi.create({
          booking_id: booking.booking_id,
          payment_method: paymentMethod,
          transaction_code: `${paymentMethod}-${Date.now()}`,
          amount: total,
        })
      }
    },
  })

  const handleCourtSelect = useCallback(
    (courtId) => {
      setValue('court_id', courtId?.toString() || '')
      setValue('start_time', '')
      setValue('end_time', '')
    },
    [setValue],
  )

  const handleDateChange = useCallback(
    (date) => {
      setValue('booking_date', date)
      setValue('start_time', '')
      setValue('end_time', '')
    },
    [setValue],
  )

  const handleStartTimeChange = useCallback((value) => setValue('start_time', value), [setValue])
  const handleEndTimeChange = useCallback((value) => setValue('end_time', value), [setValue])
  const handlePromoChange = useCallback((value) => setValue('promo_code', value), [setValue])
  const handlePaymentChange = useCallback((method) => setValue('payment_method', method), [setValue])

  const handleViewVenue = useCallback(() => {
    if (!selectedVenue) return
    const address = `${selectedVenue.address || ''}${selectedVenue.city ? ', ' + selectedVenue.city : ''}`
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
  }, [selectedVenue])

  const handleDirections = useCallback(() => {
    if (!selectedVenue) return
    const address = `${selectedVenue.address || ''}${selectedVenue.city ? ', ' + selectedVenue.city : ''}`
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank')
  }, [selectedVenue])

  const onSubmit = handleSubmit(async () => {
    if (!selectedCourt || !selectedVenue || !userQuery.data) {
      toast.error('Vui lòng chọn sân, ngày và giờ để tiếp tục.')
      return
    }

    if (hours <= 0) {
      toast.error('Khoảng thời gian không hợp lệ. Vui lòng kiểm tra lại.')
      return
    }

    try {
      const bookingData = {
        user_id: userQuery.data.user_id,
        court_id: selectedCourt.court_id,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        total_price: total,
        status: 'pending',
      }

      const booking = await bookingMutation.mutateAsync(bookingData)

      await Swal.fire({
        title: 'Đặt sân thành công',
        html: `<p class="text-sm text-slate-700">Booking ID: ${booking.booking_id}</p>`,
        icon: 'success',
        showDenyButton: true,
        confirmButtonText: 'Xem lịch sử booking',
        denyButtonText: 'Tiếp tục đặt sân',
      }).then((result) => {
        if (result.isConfirmed) {
          historyRef.current?.scrollIntoView({ behavior: 'smooth' })
        } else if (result.isDenied) {
          reset({
            court_id: selectedCourt.court_id?.toString() || '',
            booking_date: '',
            start_time: '',
            end_time: '',
            promo_code: '',
            payment_method: 'cash',
          })
        }
      })
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Đặt sân thất bại'
      toast.error(message)
    }
  })

  const activePromotions = availablePromotions.filter((promo) => promo.code)
  const isEmptyState = !isLoading && !selectedVenue

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        <Suspense fallback={<BookingSkeleton />}>
          {(isLoading || !selectedVenue) && <BookingSkeleton />}
          {!isLoading && selectedVenue && (
            <BookingHero
              venue={selectedVenue}
              selectedCourt={selectedCourt}
              averageRating={averageRating}
              onViewVenue={handleViewVenue}
              onDirections={handleDirections}
            />
          )}

          {isEmptyState && (
            <div className="pb-8">
              <EmptyBooking />
            </div>
          )}

          {!isEmptyState && !isLoading && (
            <div className="grid gap-8 xl:grid-cols-[0.7fr_0.3fr]">
              <div className="space-y-8">
                <section className="space-y-8 rounded-[32px] bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                  <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Chi tiết đặt sân</p>
                    <h2 className="text-3xl font-semibold text-slate-950">Chọn sân con và thời gian phù hợp</h2>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                      Duyệt danh sách sân con từ địa điểm này, kiểm tra lịch trống và hoàn tất đặt sân an toàn.
                    </p>
                  </div>

                  <div className="grid gap-6">
                    <CourtSelector courts={courts} selectedCourtId={selectedCourt?.court_id?.toString()} onSelect={handleCourtSelect} />
                    <DateSelector value={bookingDate} onChange={handleDateChange} />
                    <TimeSelector
                      selectedDate={bookingDate}
                      startTime={startTime}
                      endTime={endTime}
                      onStartChange={handleStartTimeChange}
                      onEndChange={handleEndTimeChange}
                      bookings={bookingsQuery.data || []}
                    />
                  </div>
                </section>

                <section ref={historyRef} className="space-y-6 rounded-[32px] bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Lịch sử booking</p>
                    <h2 className="text-2xl font-semibold text-slate-950">Booking gần đây</h2>
                  </div>
                  <BookingHistory items={historyQuery.data || []} />
                </section>

                <section className="rounded-[32px] bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                  <ReviewSection reviews={reviewQuery.data || []} />
                </section>
              </div>

              <div className="space-y-6">
                <div className="rounded-[32px] bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                  <BookingSummary
                    venue={selectedVenue}
                    court={selectedCourt}
                    bookingDate={bookingDate}
                    startTime={startTime}
                    endTime={endTime}
                    promoCode={promoCode}
                    onPromoChange={handlePromoChange}
                    paymentMethod={paymentMethod}
                    onPaymentChange={handlePaymentChange}
                    isSubmitting={bookingMutation.isLoading}
                    onSubmit={onSubmit}
                  />
                </div>

                {activePromotions.length ? (
                  <div className="rounded-[32px] bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                    <div className="space-y-3">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Ưu đãi hiện tại</p>
                      <h2 className="text-2xl font-semibold text-slate-950">Chọn mã giảm giá</h2>
                    </div>
                    <div className="grid gap-4">
                      {activePromotions.map((promo) => (
                        <button
                          key={promo.id}
                          type="button"
                          onClick={() => handlePromoChange(promo.code)}
                          className={`rounded-3xl border px-4 py-4 text-left transition ${
                            promoCode === promo.code
                              ? 'border-emerald-500 bg-emerald-50 text-slate-900'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{promo.title}</p>
                              <p className="mt-1 text-sm text-slate-500">{promo.description}</p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{promo.discountLabel}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </Suspense>
      </div>
    </main>
  )
}
