import React from 'react'

export default function ReportsHeader({
  title,
  subtitle,
  periodLabel,
  autoRefresh,
  onRefresh,
  onExportCSV,
  onExportPDF,
  onCopyReport,
  onToggleAutoRefresh,
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{subtitle}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">Báo cáo vận hành sân bóng thông minh, giúp quản trị và phân tích dữ liệu doanh thu, booking và hiệu suất sân theo thời gian thực.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Khoảng thời gian</p>
            <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{periodLabel}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <i className="ti ti-refresh text-base" /> Refresh
            </button>
            <button
              type="button"
              onClick={onToggleAutoRefresh}
              className={`inline-flex items-center justify-center gap-2 rounded-3xl px-5 py-3 text-sm font-semibold transition ${autoRefresh ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
            >
              <i className="ti ti-clock text-base" /> {autoRefresh ? 'Auto On' : 'Auto Off'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={onExportCSV}
          className="group inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <i className="ti ti-file-csv text-base" /> Download CSV
        </button>
        <button
          type="button"
          onClick={onExportPDF}
          className="group inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <i className="ti ti-file-text text-base" /> Download PDF
        </button>
        <button
          type="button"
          onClick={onCopyReport}
          className="group inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <i className="ti ti-copy text-base" /> Copy report
        </button>
        <button
          type="button"
          onClick={onExportPDF}
          className="group inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <i className="ti ti-printer text-base" /> Export Excel
        </button>
      </div>
    </div>
  )
}
