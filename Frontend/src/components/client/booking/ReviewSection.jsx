import React from 'react'

export default React.memo(function ReviewSection({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Đánh giá</p>
        <p className="mt-3 text-lg font-semibold text-slate-900">Chưa có đánh giá</p>
        <p className="mt-2 text-sm leading-6">Hãy là người đầu tiên đánh giá trải nghiệm sân bóng này.</p>
      </div>
    )
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.24em] text-emerald-500">Đánh giá</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Cảm nhận khách hàng</h2>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.review_id} className="rounded-[28px] border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{review.user?.name || 'Khách hàng'}</p>
                <p className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString('vi-VN')}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{Number(review.rating).toFixed(1)}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{review.comment || 'Khách hàng chưa để lại nhận xét.'}</p>
          </div>
        ))}
      </div>
    </div>
  )
})
