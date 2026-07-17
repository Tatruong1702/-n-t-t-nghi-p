import React from 'react'
import { Link } from 'react-router-dom'

export default function VenueEmptyState({ error = null }) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-28">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">🏟️</div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {error ? 'Lỗi' : 'Không tìm thấy sân'}
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          {error || 'Sân bạn tìm kiếm không tồn tại hoặc đã bị xóa.'}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            ← Quay lại trang chủ
          </Link>
          <Link
            to="/"
            className="inline-flex rounded-3xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Xem danh sách sân
          </Link>
        </div>
      </div>
    </main>
  )
}
