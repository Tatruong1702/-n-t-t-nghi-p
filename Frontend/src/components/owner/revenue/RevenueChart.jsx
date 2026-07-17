import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip as ChartTooltip, Filler } from 'chart.js'
import formatMoney from '../../../utils/formatMoney'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, Filler)

const RevenueChart = React.memo(function RevenueChart({ data }) {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map((item) => item.revenue),
        fill: true,
        borderColor: '#0f766e',
        backgroundColor: 'rgba(15, 118, 110, 0.16)',
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 5,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatMoney(context.raw),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b' },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#64748b',
          callback: (value) => `${Number(value) / 1000000}M`,
        },
      },
    },
  }

  return (
    <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">Xu hướng doanh thu</p>
          <p className="text-sm text-slate-500">Theo ngày / tuần / tháng</p>
        </div>
      </div>
      <div className="mt-6 h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
})

export default RevenueChart
