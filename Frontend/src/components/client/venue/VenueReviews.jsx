import React, { useMemo, useState } from 'react'
import VenueReviewCard from './VenueReviewCard'

const VenueReviews = React.memo(({ reviews = [] }) => {
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const ratingStats = useMemo(() => {
    if (!reviews.length) return { total: 0, average: 0, distribution: {} }

    const distribution = {}
    let total = 0

    reviews.forEach((review) => {
      const rating = Number(review?.rating || 0)
      total += rating
      distribution[rating] = (distribution[rating] || 0) + 1
    })

    const average = reviews.length ? (total / reviews.length).toFixed(1) : 0

    return {
      total: reviews.length,
      average,
      distribution,
    }
  }, [reviews])

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews

    if (filterRating) {
      filtered = filtered.filter((r) => Number(r.rating) === Number(filterRating))
    }

    let sorted = [...filtered]
    switch (sortBy) {
      case 'highest':
        sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
        break
      case 'lowest':
        sorted.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0))
        break
      case 'newest':
      default:
        sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })
        break
    }

    return sorted
  }, [reviews, sortBy, filterRating])

  const paginatedReviews = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    return filteredAndSortedReviews.slice(startIdx, startIdx + itemsPerPage)
  }, [filteredAndSortedReviews, currentPage])

  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage)

  return (
    <div className="rounded-[28px] bg-white p-8 shadow-sm border border-slate-200">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Đánh giá</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Phản hồi khách hàng</h2>
      </div>

      {reviews.length > 0 ? (
        <>
          <div className="mb-8 grid gap-6 md:grid-cols-[0.4fr_1fr]">
            <div className="space-y-4">
              <div className="rounded-[20px] bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-6 text-center">
                <p className="text-sm text-blue-700 font-semibold">Đánh giá trung bình</p>
                <p className="mt-3 text-5xl font-bold text-blue-900">{ratingStats.average}</p>
                <p className="mt-2 text-sm text-blue-700">{ratingStats.total} đánh giá</p>
                <div className="mt-3 flex justify-center gap-1 text-2xl">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(ratingStats.average) ? 'text-yellow-400' : 'text-slate-300'}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingStats.distribution[rating] || 0
                  const percentage = ratingStats.total ? (count / ratingStats.total) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="w-8 text-sm font-semibold text-slate-700">{rating}⭐</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs text-slate-600">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Sắp xếp:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="highest">Cao nhất</option>
                    <option value="lowest">Thấp nhất</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Lọc:
                  </label>
                  <select
                    value={filterRating}
                    onChange={(e) => {
                      setFilterRating(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="5">5 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="1">1 ⭐</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {paginatedReviews.length > 0 ? (
            <div className="space-y-4">
              {paginatedReviews.map((review) => (
                <VenueReviewCard
                  key={review.review_id || `${review.user?.id}-${review.created_at}`}
                  review={review}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] bg-slate-50 border border-dashed border-slate-300 p-8 text-center">
              <p className="text-slate-600">Không có đánh giá phù hợp</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                ← Trước
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-10 w-10 rounded-lg font-semibold transition ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Sau →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-lg text-slate-600">Chưa có đánh giá nào cho sân này</p>
        </div>
      )}
    </div>
  )
})

VenueReviews.displayName = 'VenueReviews'

export default VenueReviews
