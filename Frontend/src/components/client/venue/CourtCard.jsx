import React from 'react'
import { Link } from 'react-router-dom'
import formatMoney from '../../../utils/formatMoney'
import getImageUrl from '../../../utils/getImageUrl'

const placeholderImage =
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80'

const CourtCard = React.memo(({ court, venueId }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return {
          text: 'Còn trống',
          icon: '✅',
          color: 'bg-green-100 text-green-700 border-green-300',
        }
      case 2:
        return {
          text: 'Đang bảo trì',
          icon: '🔧',
          color: 'bg-orange-100 text-orange-700 border-orange-300',
        }
      case 0:
        return {
          text: 'Đã kín',
          icon: '❌',
          color: 'bg-red-100 text-red-700 border-red-300',
        }
      default:
        return {
          text: 'Không rõ',
          icon: '❓',
          color: 'bg-gray-100 text-gray-700 border-gray-300',
        }
    }
  }

  const statusBadge = getStatusBadge(court?.status)
  const courtImage = getImageUrl(court?.image) || placeholderImage

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm hover:shadow-lg transition">
      <div className="grid gap-6 md:grid-cols-[0.95fr_0.45fr] p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{court?.court_name}</h3>
            <p className="mt-1 text-sm text-slate-600">Loại sân: <span className="font-semibold">{court?.sport_type || 'Không xác định'}</span></p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Giá:</span>{' '}
              <span className="text-blue-600 font-bold">{formatMoney(court?.price_per_hour)}/giờ</span>
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">ID Sân:</span> {court?.court_id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge.color}`}>
              {statusBadge.icon} {statusBadge.text}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-[20px] bg-slate-100">
            <img
              src={courtImage}
              alt={court?.court_name}
              className="h-40 w-full object-cover"
              loading="lazy"
            />
          </div>
          <Link
            to={`/booking?court_id=${court?.court_id}&venue_id=${venueId}`}
            className="inline-flex w-full items-center justify-center rounded-[16px] bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            Đặt sân
          </Link>
        </div>
      </div>
    </div>
  )
})

CourtCard.displayName = 'CourtCard'

export default CourtCard
