import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function ShareButton({ venueId, venueName }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const url = `${window.location.origin}/venue/${venueId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Đã sao chép liên kết!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/venue/${venueId}`
    const text = `Xem sân ${venueName} - Website đặt sân bóng`

    if (navigator.share) {
      try {
        await navigator.share({
          title: venueName,
          text,
          url,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
      title="Chia sẻ"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C9.034 12.35 9.21 11.853 9.21 11.5 9.21 9.978 8.196 8.75 6.75 8.75c-1.446 0-2.46 1.227-2.46 2.75 0 .353.176.85.526 1.842m0 0c.25.776.75 2.325.75 4.408 0 1.522-1.014 2.75-2.46 2.75-1.446 0-2.46-1.228-2.46-2.75 0-2.083.5-3.632.75-4.408" />
      </svg>
      {copied ? 'Đã sao chép!' : 'Chia sẻ'}
    </button>
  )
}
