import React from 'react'
import formatDate from '../../../utils/formatDate'

const VenueReviewCard = React.memo(({ review }) => {
  const renderStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'text-yellow-400' : 'text-slate-300'}>
          ★
        </span>
      )
    }
    return stars
  }

  const rating = Number(review?.rating || 0)
  const userName = review?.user?.name || review?.user_name || review?.username || 'Khách hàng ẩn danh'
  const content = review?.comment || review?.content || 'Không có nội dung đánh giá'
  const createdAt = review?.created_at ? formatDate(review.created_at) : 'Không rõ ngày'

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{userName}</p>
              <p className="text-xs text-slate-500">{createdAt}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1 text-lg">{renderStars(rating)}</div>
      </div>

      <p className="mt-4 leading-7 text-slate-700">{content}</p>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-slate-700 font-semibold">
          {rating} / 5 ⭐
        </span>
      </div>
    </div>
  )
})

VenueReviewCard.displayName = 'VenueReviewCard'

export default VenueReviewCard
