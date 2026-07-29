import React, { memo } from 'react'
import { ArrowUpRight, MapPin, CalendarDays, Wallet } from 'lucide-react'
import getImageUrl from '../../../utils/getImageUrl'

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))

const MyVenues = memo(function MyVenues({ venues }) {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">Sân của tôi</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Danh sách venue</h3>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600">
          Quản lý sân <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {venues.map((venue) => (
          <article key={venue.venue_id} className="overflow-hidden rounded-[20px] border border-slate-200 bg-slate-50/70">
            <div className="h-36 bg-slate-200">
              {venue.image ? (
                <img src={getImageUrl(venue.image)} alt={venue.venue_name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">Không có ảnh</div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900">{venue.venue_name}</h4>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} /> {venue.address || venue.city || 'Địa chỉ chưa cập nhật'}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">{venue.courts_count || 0} sân con</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Wallet size={14} /> Doanh thu
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">{formatCurrency(venue.revenue || 0)}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={14} /> Booking
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">{venue.booking_count || 0}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
})

export default MyVenues
