import React from 'react'
import { Link } from 'react-router-dom'
import formatMoney from '../../../utils/formatMoney'

export default function VenueCard({ venue }) {
  const previewCourt = venue?.courts?.[0]
  const imageSrc = venue?.image || 'https://via.placeholder.com/420x260?text=S%C3%A2n+b%C3%B3ng'

  return (
    <article className="group overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.4)] transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/venue/${venue?.venue_id}`} className="block">
        <div className="h-60 overflow-hidden bg-slate-200">
          <img
            src={imageSrc}
            alt={venue?.venue_name || 'Sân bóng'}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-5 p-6">
        <Link to={`/venue/${venue?.venue_id}`} className="hover:text-blue-600">
          <h3 className="text-xl font-semibold text-slate-900">
            {venue?.venue_name || 'Sân bóng chưa đặt tên'}
          </h3>
        </Link>
        <p className="text-sm text-slate-500">{venue?.address || 'Địa chỉ đang cập nhật'}</p>

        <div className="grid gap-2 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-slate-900">Loại sân:</span>
            <span>{previewCourt?.sport_type || 'Đang cập nhật'}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-slate-900">Giá thuê:</span>
            <span>{previewCourt ? `${formatMoney(previewCourt.price_per_hour)} / giờ` : 'Liên hệ'}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-slate-900">Sân:</span>
            <span>{previewCourt?.court_name || 'Không có thông tin sân'}</span>
          </div>
        </div>

        <Link
          to={`/venue/${venue?.venue_id}`}
          className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  )
}
