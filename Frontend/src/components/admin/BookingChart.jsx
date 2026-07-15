import React, { lazy, Suspense, useMemo } from 'react'
import ChartCard from '../common/ChartCard'
import StatusBadge from '../common/StatusBadge'

const Line = lazy(() => import('react-chartjs-2').then((mod) => ({ default: mod.Line })))

export default function BookingChart({ bookingsByHour = [], bookingsByMonth = [], loading, range = '6 hours' }) {
  const lineData = useMemo(() => ({
    labels: bookingsByHour.map((item) => item.hour),
    datasets: [
      {
        label: 'Lượt đặt hàng giờ',
        data: bookingsByHour.map((item) => item.count),
        borderColor: '#4338ca',
        backgroundColor: 'rgba(67, 56, 202, 0.16)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
      },
    ],
  }), [bookingsByHour])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { borderDash: [6, 6] }, beginAtZero: true },
    },
  }), [])

  return (
    <ChartCard
      title="Booking trend"
      subtitle={`Xu hướng đặt sân theo thời gian ${range}`}
      action={<StatusBadge label="Live analytics" tone="info" />}
    >
      <div className="min-h-[320px] rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-slate-50 via-white to-cyan-50/70 p-3">
        <Suspense fallback={<div className="h-full min-h-[300px] animate-pulse rounded-[20px] bg-slate-100" />}>
          <Line data={lineData} options={options} />
        </Suspense>
      </div>
    </ChartCard>
  )
}
