import React, { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'

const statusMeta = [
  { key: 'completed', label: 'Hoàn tất', color: 'bg-emerald-500', ring: 'bg-emerald-100' },
  { key: 'confirmed', label: 'Xác nhận', color: 'bg-blue-500', ring: 'bg-blue-100' },
  { key: 'pending', label: 'Chờ', color: 'bg-amber-500', ring: 'bg-amber-100' },
  { key: 'cancelled', label: 'Hủy', color: 'bg-rose-500', ring: 'bg-rose-100' },
]

export default function BookingStatus({ statusCounts = {}, totalBookings = 0, loading }) {
  const safeCounts = {
    completed: Number(statusCounts.completed || 0),
    confirmed: Number(statusCounts.confirmed || 0),
    pending: Number(statusCounts.pending || 0),
    cancelled: Number(statusCounts.cancelled || 0),
  }

  const data = useMemo(
    () => ({
      labels: statusMeta.map((item) => item.label),
      datasets: [
        {
          data: [safeCounts.completed, safeCounts.confirmed, safeCounts.pending, safeCounts.cancelled],
          backgroundColor: ['#16a34a', '#2563eb', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        },
      ],
    }),
    [safeCounts.completed, safeCounts.confirmed, safeCounts.pending, safeCounts.cancelled]
  )

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#64748b', padding: 16, boxWidth: 12 } },
      },
    }),
    []
  )

  const totalCount = totalBookings || safeCounts.completed + safeCounts.confirmed + safeCounts.pending + safeCounts.cancelled
  const statuses = statusMeta.map((item) => ({
    ...item,
    value: safeCounts[item.key],
    percent: totalCount ? Math.round((safeCounts[item.key] / totalCount) * 100) : 0,
  }))

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Booking Status</h2>
          <p className="mt-1 text-sm text-slate-500">Nhìn tổng quan trạng thái booking trong hệ thống.</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">{totalCount.toLocaleString()} booking</div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-h-[320px] rounded-[1.75rem] bg-slate-50 p-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-48 w-48 animate-pulse rounded-full bg-slate-200" />
            </div>
          ) : (
            <Doughnut data={data} options={options} />
          )}
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tổng booking</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalCount.toLocaleString()}</p>
          </div>

          <div className="grid gap-3">
            {statuses.map((item) => (
              <div key={item.key} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.value.toLocaleString()} đơn</p>
                  </div>
                  <span className={`inline-flex h-2.5 w-10 rounded-full ${item.color}`} />
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className={`${item.color} h-full`} style={{ width: `${item.percent}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{item.percent}% tổng</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
