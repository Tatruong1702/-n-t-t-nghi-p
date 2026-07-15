import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Star, Heart, MapPinIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import getImageUrl from '../../../utils/getImageUrl'

const placeholderImage = 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80'

const VenueCard = React.memo(({ venue, viewType = 'grid' }) => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = React.useState(false)

  const imageUrl = useMemo(() => getImageUrl(venue.image) || placeholderImage, [venue.image])

  const venueStats = useMemo(() => ({
    courts: venue.courts_count || venue.Courts?.length || 0,
    bookings: venue.booking_count || 0,
    rating: venue.rating || 4.5,
    price: venue.min_price || venue.price || 0,
  }), [venue])

  const badges = useMemo(() => {
    const result = []
    if (venue.is_new) result.push({ text: 'MỚI', color: 'bg-blue-500' })
    if (venue.is_hot) result.push({ text: 'HOT', color: 'bg-red-500' })
    if (venue.is_discount) result.push({ text: 'GIẢM GIÁ', color: 'bg-emerald-500' })
    return result
  }, [venue])

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    toast.success(!isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích')
  }

  const handleQuickBook = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/booking?venue_id=${venue.venue_id}`)
  }

  if (viewType === 'list') {
    return (
      <Link
        to={`/venue/${venue.venue_id}`}
        className="group flex gap-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/20 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/30 hover:-translate-y-1"
      >
        {/* Image */}
        <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-[16px]">
          <img src={imageUrl} alt={venue.venue_name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {badges.map((badge, i) => (
              <span key={i} className={`${badge.color} px-2 py-1 text-xs font-bold text-white rounded-full`}>
                {badge.text}
              </span>
            ))}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 rounded-full bg-white/90 p-2 transition-all duration-200 hover:bg-white hover:scale-110"
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-1">
          {/* Header */}
          <div>
            <h3 className="text-lg font-bold text-slate-950 line-clamp-2">{venue.venue_name}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} />
              <span className="line-clamp-1">{venue.address || 'Địa chỉ chưa cập nhật'}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-slate-900">{venueStats.rating.toFixed(1)}</span>
            </div>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-900">{venueStats.bookings}</span> đặt
            </div>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-900">{venueStats.courts}</span> sân
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <p className="text-sm text-slate-600">Giá từ</p>
            <p className="text-2xl font-bold text-emerald-600">{venueStats.price.toLocaleString()}₫</p>
          </div>
          <button
            onClick={handleQuickBook}
            className="rounded-2xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-emerald-500 active:scale-95"
          >
            Đặt ngay
          </button>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/venue/${venue.venue_id}`}
      className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-lg shadow-slate-200/20 transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/30 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-200">
        <img src={imageUrl} alt={venue.venue_name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {badges.map((badge, i) => (
            <span key={i} className={`${badge.color} px-2.5 py-1.5 text-xs font-bold text-white rounded-full shadow-lg`}>
              {badge.text}
            </span>
          ))}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 rounded-full bg-white/90 p-2.5 transition-all duration-200 hover:bg-white hover:scale-110"
        >
          <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'} />
        </button>

        {/* Status Badge */}
        {venue.status === 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white">
            Đang hoạt động
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-950 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {venue.venue_name}
        </h3>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <MapPinIcon size={16} className="flex-shrink-0 mt-0.5" />
          <p className="line-clamp-2">{venue.address || 'Địa chỉ chưa cập nhật'}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 border-t border-slate-200 pt-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-slate-900">{venueStats.rating.toFixed(1)}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-900">{venueStats.bookings}</span> đặt
          </div>
          <div>
            <span className="font-semibold text-slate-900">{venueStats.courts}</span> sân
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div>
            <p className="text-xs text-slate-600">Giá từ</p>
            <p className="text-xl font-bold text-emerald-600">{venueStats.price.toLocaleString()}₫</p>
          </div>
          <button
            onClick={handleQuickBook}
            className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-500 active:scale-95 w-full"
          >
            Đặt ngay
          </button>
        </div>
      </div>
    </Link>
  )
})

VenueCard.displayName = 'VenueCard'

export default VenueCard
