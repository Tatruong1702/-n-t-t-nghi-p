import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useAuth from '../../../hooks/useAuth'
import bookingApi from '../../../api/bookingApi'
import formatMoney from '../../../utils/formatMoney'

const BookingPanel = React.memo(({ courts = [], venueId }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedCourt, setSelectedCourt] = useState(courts[0]?.court_id || '')
  const [startTime, setStartTime] = useState('07:00')
  const [endTime, setEndTime] = useState('08:00')
  const [loading, setLoading] = useState(false)

  const selectedCourtData = useMemo(
    () => courts.find((c) => c.court_id === Number(selectedCourt)),
    [courts, selectedCourt]
  )

  const hoursCount = useMemo(() => {
    if (!startTime || !endTime) return 0
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    const start = startHour + startMin / 60
    const end = endHour + endMin / 60
    return Math.max(0, end - start)
  }, [startTime, endTime])

  const totalPrice = useMemo(
    () => (selectedCourtData?.price_per_hour || 0) * hoursCount,
    [selectedCourtData, hoursCount]
  )

  const vat = totalPrice * 0.1
  const grandTotal = totalPrice + vat

  const minDate = useMemo(() => {
    const today = new Date()
    today.setDate(today.getDate())
    return today.toISOString().split('T')[0]
  }, [])

  const maxDate = useMemo(() => {
    const maxDay = new Date()
    maxDay.setDate(maxDay.getDate() + 30)
    return maxDay.toISOString().split('T')[0]
  }, [])

  const timeOptions = useMemo(() => {
    const options = []
    for (let h = 7; h < 23; h++) {
      options.push(
        `${String(h).padStart(2, '0')}:00`,
        `${String(h).padStart(2, '0')}:30`
      )
    }
    return options
  }, [])

  const handleBooking = useCallback(async () => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để đặt sân')
      return
    }

    if (!selectedDate) {
      toast.error('Vui lòng chọn ngày')
      return
    }

    if (!selectedCourt) {
      toast.error('Vui lòng chọn sân')
      return
    }

    if (hoursCount === 0) {
      toast.error('Vui lòng chọn thời gian hợp lệ')
      return
    }

    setLoading(true)
    try {
      await bookingApi.create({
        court_id: selectedCourt,
        booking_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
        total_price: grandTotal,
      })

      toast.success('Đặt sân thành công! Chuyển hướng tới thanh toán...')
      setTimeout(() => {
        navigate('/my-bookings')
      }, 1500)
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Có lỗi xảy ra khi đặt sân. Vui lòng thử lại.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [
    user,
    selectedDate,
    selectedCourt,
    hoursCount,
    startTime,
    endTime,
    grandTotal,
    navigate,
  ])

  if (!courts.length) {
    return (
      <div className="sticky top-20 rounded-[28px] bg-white p-8 shadow-sm border border-slate-200 h-fit">
        <p className="text-center text-slate-600">Không có sân con khả dụng</p>
      </div>
    )
  }

  return (
    <div className="sticky top-20 space-y-6">
      <div className="rounded-[28px] bg-white p-8 shadow-sm border border-slate-200">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">
            Đặt sân
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">Booking Panel</h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Chọn sân:
            </label>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courts.map((court) => (
                <option key={court.court_id} value={court.court_id}>
                  {court.court_name} - {formatMoney(court.price_per_hour)}/h
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Chọn ngày:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              max={maxDate}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Giờ bắt đầu:
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Giờ kết thúc:
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hoursCount > 0 && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Thời gian:</span> {hoursCount} giờ
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-lg border border-slate-700 text-white">
        <h3 className="mb-6 text-lg font-bold">Tóm tắt giá</h3>

        <div className="space-y-3 border-b border-slate-700 pb-4">
          <div className="flex justify-between text-sm">
            <span>Giá sân / giờ</span>
            <span>{formatMoney(selectedCourtData?.price_per_hour || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Số giờ</span>
            <span>× {hoursCount}</span>
          </div>
        </div>

        <div className="space-y-3 py-4 border-b border-slate-700">
          <div className="flex justify-between">
            <span className="text-sm">Tổng giá:</span>
            <span className="font-semibold">{formatMoney(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm opacity-75">
            <span>VAT (10%)</span>
            <span>+ {formatMoney(vat)}</span>
          </div>
        </div>

        <div className="flex justify-between pt-4 text-lg font-bold">
          <span>Thành tiền:</span>
          <span className="text-2xl text-green-400">{formatMoney(grandTotal)}</span>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading || hoursCount === 0}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-bold text-white hover:shadow-lg transition disabled:opacity-50 active:scale-95"
        >
          {loading ? 'Đang xử lý...' : 'Đặt sân ngay'}
        </button>

        <p className="mt-3 text-center text-xs opacity-75">
          💳 Thanh toán được xử lý an toàn
        </p>
      </div>
    </div>
  )
})

BookingPanel.displayName = 'BookingPanel'

export default BookingPanel
