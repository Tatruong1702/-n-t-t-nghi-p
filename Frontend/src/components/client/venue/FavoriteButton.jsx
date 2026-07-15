import React, { useState, useCallback } from 'react'
import useAuth from '../../../hooks/useAuth'
import { toast } from 'react-toastify'

export default function FavoriteButton({ venueId, venueName }) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggleFavorite = useCallback(async () => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để lưu sân yêu thích')
      return
    }

    setLoading(true)
    try {
      // TODO: Call favorite API when available
      setIsFavorite(!isFavorite)
      toast.success(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích')
    } catch (err) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }, [isFavorite, user])

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-3xl px-4 py-2 text-sm font-semibold transition active:scale-95 disabled:opacity-50 ${
        isFavorite
          ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
      }`}
      title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
    >
      <svg
        className={`h-5 w-5 transition ${isFavorite ? 'fill-current' : ''}`}
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {isFavorite ? 'Yêu thích' : 'Lưu'}
    </button>
  )
}
