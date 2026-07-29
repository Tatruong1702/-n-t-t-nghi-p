import React from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

const BookingAnalytics = React.memo(function BookingAnalytics({ analytics }) {
  const lineData = {
    labels: analytics.monthLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Booking', data: analytics.monthBookings || [4, 6, 8, 5, 9, 10], borderColor: '#0f172a', backgroundColor: 'rgba(15,23,42,0.12)', tension: 0.35 }],
  }

  const barData = {
    labels: analytics.hourLabels || ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
    datasets: [{ label: 'Khung giờ', data: analytics.hourBookings || [2, 5, 4, 8, 6, 3], backgroundColor: '#22c55e' }],
  }

  const pieData = {
    labels: analytics.statusLabels || ['Confirmed', 'Pending', 'Cancelled'],
    datasets: [{ data: analytics.statusValues || [10, 4, 2], backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'] }],
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-slate-700">Booking theo tháng</h3>
        <div className="mt-4 h-56"><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
      </div>
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-slate-700">Booking theo giờ</h3>
        <div className="mt-4 h-56"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
      </div>
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_18px_60px_-26px_rgba(15,23,42,0.2)] backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-slate-700">Booking theo trạng thái</h3>
        <div className="mt-4 h-56"><Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
      </div>
    </div>
  )
})

export default BookingAnalytics
