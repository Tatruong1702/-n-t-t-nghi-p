import React, { useMemo } from 'react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

function formatNumber(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0)
}

export default function VenueAnalytics({ venues }) {
  const bookingSummary = useMemo(() => {
    const totalBookings = venues.reduce((sum, venue) => sum + Number(venue.booking_count || 0), 0)
    const todayBookings = venues.reduce((sum, venue) => sum + Number(venue.today_booking_count || 0), 0)
    const weekBookings = venues.reduce((sum, venue) => sum + Number(venue.week_booking_count || 0), 0)
    const monthBookings = venues.reduce((sum, venue) => sum + Number(venue.month_booking_count || 0), 0)
    return { totalBookings, todayBookings, weekBookings, monthBookings }
  }, [venues])

  const chartData = useMemo(() => {
    const regions = [...new Set(venues.map((venue) => venue.city).filter(Boolean))]
    const revenueByRegion = regions.map((region) =>
      venues.filter((venue) => venue.city === region).reduce((sum, venue) => sum + Number(venue.revenue || 0), 0)
    )
    const sortedVenues = [...venues].sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0)).slice(0, 5)

    return {
      regionLabels: regions,
      regionData: revenueByRegion,
      topRevenueLabels: sortedVenues.map((venue) => venue.venue_name || 'Sân'),
      topRevenueData: sortedVenues.map((venue) => Number(venue.revenue || 0)),
    }
  }, [venues])

  const hourChart = useMemo(() => {
    const hourLabels = ['06h', '09h', '12h', '15h', '18h', '21h']
    const hourData = hourLabels.map((_, index) =>
      venues.reduce((sum, venue) => sum + ((venue.hourly_booking?.[index] && Number(venue.hourly_booking[index])) || 0), 0)
    )
    return { hourLabels, hourData }
  }, [venues])

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Booking Analytics</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Tổng lượt đặt</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{formatNumber(bookingSummary.totalBookings)}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Booking hôm nay</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{formatNumber(bookingSummary.todayBookings)}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Booking tuần</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{formatNumber(bookingSummary.weekBookings)}</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Booking tháng</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{formatNumber(bookingSummary.monthBookings)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-semibold text-slate-900">Booking theo khu vực</h3>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Revenue mix</span>
        </div>
        <div className="mt-6 h-72">
          {chartData.regionLabels.length > 0 ? (
            <Bar
              data={{ labels: chartData.regionLabels, datasets: [{ label: 'Doanh thu', data: chartData.regionData, backgroundColor: '#2563eb' }] }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">Chưa có dữ liệu biểu đồ</div>
          )}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Booking theo giờ</h3>
            <p className="text-sm text-slate-500">Phân bố theo các khung thời gian chính.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600">Realtime</span>
        </div>
        <div className="mt-6 h-72">
          <Line
            data={{
              labels: hourChart.hourLabels,
              datasets: [
                {
                  label: 'Booking',
                  data: hourChart.hourData,
                  fill: true,
                  borderColor: '#2563eb',
                  backgroundColor: 'rgba(37,99,235,0.16)',
                  tension: 0.4,
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Top sân doanh thu</h3>
          <div className="mt-6 space-y-4">
            {chartData.topRevenueLabels.length > 0 ? (
              chartData.topRevenueLabels.map((label, index) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500">{formatNumber(chartData.topRevenueData[index])} VND</p>
                  </div>
                  <div className="h-2.5 w-24 rounded-full bg-blue-100">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${chartData.topRevenueData[index] > 0 ? Math.min(100, (chartData.topRevenueData[index] / Math.max(...chartData.topRevenueData)) * 100) : 0}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Không có dữ liệu để hiển thị.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
