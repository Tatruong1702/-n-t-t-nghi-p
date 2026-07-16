import React from 'react'

export default function EmptyState({ message, onReload }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950/80">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-4xl text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-300">
        <i className="ti ti-file-search" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white">Không có dữ liệu để hiển thị</h3>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Dữ liệu hiện tại chưa có nội dung nào. Hãy thử tải lại hoặc điều chỉnh bộ lọc.</p>
      <button
        type="button"
        onClick={onReload}
        className="mt-6 inline-flex items-center justify-center rounded-3xl bg-navy-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
      >
        Tải lại dữ liệu
      </button>
    </div>
  )
}
