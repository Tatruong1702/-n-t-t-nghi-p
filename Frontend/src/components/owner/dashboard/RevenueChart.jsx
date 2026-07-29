import React, { memo, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0))

const RevenueChart = memo(function RevenueChart({ data }) {
  const chartData = useMemo(() => ({
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map((item) => item.revenue),
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.18)',
        pointBackgroundColor: '#0F172A',
        pointBorderColor: '#22C55E',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35,
      },
    ],
  }), [data])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => formatCurrency(ctx.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.16)' },
        ticks: {
          color: '#64748b',
          callback: (value) => formatCurrency(value),
        },
      },
    },
  }), [])

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">Doanh thu 30 ngày gần nhất</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Xu hướng thu nhập</h3>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">Live</div>
      </div>
      <div className="mt-6 h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
})

export default RevenueChart
