import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import getImageUrl from '../../../utils/getImageUrl'
import formatMoney from '../../../utils/formatMoney'

const statusMap = {
  1: { label: 'Available', color: 'bg-emerald-100 text-emerald-700' },
  2: { label: 'Busy', color: 'bg-amber-100 text-amber-700' },
  3: { label: 'Maintenance', color: 'bg-rose-100 text-rose-700' },
}

function getStatus(court) {
  if (court.status === 1) return statusMap[1]
  if (court.status === 3) return statusMap[3]
  return statusMap[2]
}

export default React.memo(function CourtSelector({ courts = [], selectedCourtId, onSelect }) {
  const sortedCourts = useMemo(
    () => [...courts].sort((a, b) => (a.status === 1 ? -1 : 1) - (b.status === 1 ? -1 : 1)),
    [courts],
  )

  if (!courts.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
        Không có sân con để đặt tại địa điểm này.
      </div>
    )
  }

  return (
    <motion.div layout className="grid gap-4 md:grid-cols-2">
      {sortedCourts.map((court) => {
        const status = getStatus(court)
        const isActive = court.court_id.toString() === selectedCourtId?.toString()
        return (
          <motion.button
            key={court.court_id}
            type="button"
            onClick={() => onSelect(court.court_id)}
            layout
            whileHover={{ y: -2 }}
            className={`group text-left rounded-[28px] border p-5 transition duration-300 ${
              isActive
                ? 'border-emerald-500/60 bg-emerald-500/10 shadow-xl shadow-emerald-500/10'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{court.court_name || 'Sân bóng'} </p>
                <p className="mt-1 text-sm text-slate-500">{court.sport_type || 'Loại sân chưa xác định'}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex items-center gap-3">
                <div className="h-16 w-24 overflow-hidden rounded-3xl bg-slate-100">
                  <img src={getImageUrl(court.image)} alt={court.court_name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Giá / giờ</p>
                  <p className="text-lg font-semibold text-slate-950">{formatMoney(court.price_per_hour)}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                {isActive ? 'Đang chọn' : 'Chọn' }
              </div>
            </div>
          </motion.button>
        )
      })}
    </motion.div>
  )
})
