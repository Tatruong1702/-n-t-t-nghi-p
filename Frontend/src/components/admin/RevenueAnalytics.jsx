import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

export default function RevenueAnalytics({ timeline, periodDays, onChangePeriod, summary }) {
  const data = useMemo(
    () => ({
      labels: timeline.labels,
      datasets: [
        {
          label: 'Doanh thu thực tế',
          data: timeline.revenue,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.16)',
          tension: 0.35,
          fill: true,
          pointRadius: 3,
        },
      ],
    }),
    [timeline]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { borderDash: [6, 6] }, ticks: { callback: (value) => `${value / 1000000}M` } },
      },
    }),
    []
  )

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Revenue Analytics</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Theo dõi doanh thu thực tế so với kỳ trước và xu hướng dự báo.</p>
        </div>
        <div className="inline-flex flex-wrap items-center gap-2">
          {['7', '30', '90', '365'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onChangePeriod(value)}
              className={`rounded-3xl px-4 py-2 text-sm font-semibold transition ${periodDays === value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200'}`}
            >
              {value === '365' ? '1 năm' : `${value} ngày`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_330px]">
        <div className="min-h-[360px] rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <Line data={data} options={options} />
        </div>
        <div className="grid gap-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Doanh thu kỳ hiện tại</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{formatCurrency(summary.current)}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">So sánh với kỳ trước: <span className="font-semibold text-slate-900 dark:text-white">{summary.growth > 0 ? `+${summary.growth}%` : `${summary.growth}%`}</span></p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Dự báo doanh thu</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{formatCurrency(summary.forecast)}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Dựa trên xu hướng trung bình trong kỳ hiện tại.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
