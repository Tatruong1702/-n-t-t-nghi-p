import React from 'react'

export default function VenueCards({ venues, loading, selectedIds, onSelectVenue, onOpenVenue }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2">
      {loading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm" />
        ))
      ) : venues.length > 0 ? (
        venues.map((venue) => {
          const active = Number(venue.status) === 1
          return (
            <div key={venue.venue_id} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-100">
                <img src={venue.image || 'https://images.unsplash.com/photo-1517649763962-0c623066013b'} alt={venue.venue_name} className="h-44 w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-white">
                  <p className="text-sm font-semibold">{venue.city || 'Chưa xác định'}</p>
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <button type="button" onClick={() => onOpenVenue(venue)} className="text-lg font-semibold text-slate-900 transition hover:text-blue-600">
                    {venue.venue_name}
                  </button>
                  <p className="mt-2 text-sm text-slate-500">{venue.address || 'Địa chỉ chưa xác định'}</p>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(venue.venue_id)}
                    onChange={(e) => onSelectVenue(venue.venue_id, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                  />
                  Chọn
                </label>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 p-3">
                  <span>Sân con</span>
                  <span className="font-semibold text-slate-900">{venue.courts_count ?? 0}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 p-3">
                  <span>Doanh thu</span>
                  <span className="font-semibold text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(venue.revenue || 0)}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-3xl bg-slate-50 p-3">
                  <span>Trạng thái</span>
                  <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {active ? 'Hoạt động' : 'Tạm dừng'}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenVenue(venue)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          )
        })
      ) : (
        <div className="col-span-full rounded-[2rem] border border-slate-200 bg-white p-8 text-center text-slate-500">
          Không có venue để hiển thị.
        </div>
      )}
    </div>
  )
}
