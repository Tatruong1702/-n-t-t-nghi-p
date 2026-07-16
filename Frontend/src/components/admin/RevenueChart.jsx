import React, { lazy, Suspense, useMemo } from 'react'
import ChartCard from '../common/ChartCard'
import StatusBadge from '../common/StatusBadge'

const Bar = lazy(() => import('react-chartjs-2').then((mod) => ({ default: mod.Bar })))

export default function RevenueChart({ bookingsByMonth = [], range = '6 months' }) {
  const data = useMemo(
    () => ({
      labels: bookingsByMonth.map((item) => item.month),
      datasets: [
        {
          label: 'Doanh thu',
          data: bookingsByMonth.map((item) => item.revenue ?? 0),
          backgroundColor: 'rgba(16, 185, 129, 0.72)',
          borderRadius: 16,
        },
      ],
    }),
    [bookingsByMonth]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { borderDash: [6, 6] }, beginAtZero: true },
      },
    }),
    []
  )

  return (
    <ChartCard
      title="Doanh thu theo tháng"
      subtitle={`Doanh thu từ bookings confirmed/completed trong ${range}`}
      action={<StatusBadge label="Revenue pulse" tone="success" />}
    >
      <div className="min-h-[320px] rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-emerald-50/70 p-3">
        <Suspense fallback={<div className="h-full min-h-[300px] animate-pulse rounded-[20px] bg-slate-100" />}>
          <Bar data={data} options={options} />
        </Suspense>
      </div>
    </ChartCard>
  )
}
