import React, { memo, useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const BookingChart = memo(function BookingChart({ data, range, onRangeChange }) {
  const chartData = useMemo(() => ({
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Booking',
        data: data.map((item) => item.count),
        backgroundColor: ['#0F172A', '#1E293B', '#22C55E', '#38BDF8', '#F59E0B', '#8B5CF6', '#EC4899'],
        borderRadius: 10,
      },
    ],
  }), [data])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#64748b' },
        grid: { color: 'rgba(148, 163, 184, 0.16)' },
      },
    },
  }), [])

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.15)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">Booking theo ngày</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Lưu lượng đặt sân</h3>
        </div>
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
          {[7, 30, 90].map((value) => (
            <button
              key={value}
              onClick={() => onRangeChange(value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${range === value ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {value} ngày
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
})

export default BookingChart
