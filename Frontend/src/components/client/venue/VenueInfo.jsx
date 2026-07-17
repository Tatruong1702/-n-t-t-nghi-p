import React, { useCallback } from 'react'
import { toast } from 'react-toastify'

const VenueInfo = React.memo(({ venue }) => {
  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(venue?.address || '')
    toast.success('Đã sao chép địa chỉ')
  }, [venue?.address])

  const handleOpenMaps = useCallback(() => {
    const address = encodeURIComponent(venue?.address || '')
    window.open(`https://maps.google.com/maps/search/${address}`, '_blank')
  }, [venue?.address])

  const infos = [
    {
      icon: '📍',
      label: 'Địa chỉ',
      value: venue?.address || 'Chưa có',
      action: handleCopyAddress,
      actionLabel: 'Sao chép',
    },
    {
      icon: '🏙️',
      label: 'Khu vực',
      value: venue?.city || 'Chưa có',
      action: null,
    },
    {
      icon: '👤',
      label: 'Chủ sân',
      value: venue?.owner_name || 'Không rõ',
      action: null,
    },
  ]

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm border border-slate-200">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Thông tin sân</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Chi tiết</h2>
      </div>

      <div className="mt-8 space-y-4">
        {infos.map((info, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-[20px] bg-slate-50 p-5 hover:bg-slate-100 transition"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{info.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-600">{info.label}</p>
                <p className="mt-1 text-slate-900 font-medium">{info.value}</p>
              </div>
            </div>
            {info.action && (
              <button
                onClick={info.action}
                className="rounded-full bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-200 transition"
              >
                {info.actionLabel}
              </button>
            )}
          </div>
        ))}

        <button
          onClick={handleOpenMaps}
          className="w-full rounded-[20px] bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-sm font-semibold text-white hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          Mở Google Maps
        </button>
      </div>

      <div className="mt-8 rounded-[20px] bg-blue-50 border border-blue-200 p-6">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">📞 Liên hệ:</span> {venue?.owner_phone || 'Chưa có'}
        </p>
        <p className="text-sm text-blue-900 mt-2">
          <span className="font-semibold">✉️ Email:</span> {venue?.owner_email || 'Chưa có'}
        </p>
      </div>
    </div>
  )
})

VenueInfo.displayName = 'VenueInfo'

export default VenueInfo
