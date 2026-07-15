import React, { useMemo } from 'react'

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

export default function CustomerAnalytics({ bookings }) {
  const summary = useMemo(() => {
    const totalCustomers = new Set()
    const newCustomers = new Set()
    const spending = {}
    const bookingCount = {}

    bookings.forEach((booking) => {
      const customer = booking.user_id || booking.user_name || booking.email || `guest-${booking.booking_id}`
      totalCustomers.add(customer)
      if (booking.is_new_customer) newCustomers.add(customer)
      spending[customer] = (spending[customer] || 0) + Number(booking.total_price || 0)
      bookingCount[customer] = (bookingCount[customer] || 0) + 1
    })

    const topBookers = Object.entries(bookingCount)
      .map(([customer, count]) => ({ customer, count, revenue: spending[customer] || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    const topSpenders = Object.entries(spending)
      .map(([customer, revenue]) => ({ customer, revenue, count: bookingCount[customer] || 0 }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)

    return {
      totalCustomers: totalCustomers.size,
      newCustomers: newCustomers.size,
      returningRate: totalCustomers.size ? (((totalCustomers.size - newCustomers.size) / totalCustomers.size) * 100).toFixed(1) : 0,
      topBookers,
      topSpenders,
    }
  }, [bookings])

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Customer Analytics</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Khách hàng</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{summary.totalCustomers.toLocaleString()}</p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Khách mới</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{summary.newCustomers.toLocaleString()}</p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Giữ chân</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{summary.returningRate}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top khách đặt nhiều nhất</h3>
          <div className="mt-4 space-y-3">
            {summary.topBookers.map((customer) => (
              <div key={customer.customer} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{customer.customer}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{customer.count} booking</p>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(customer.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top khách tiêu nhiều nhất</h3>
          <div className="mt-4 space-y-3">
            {summary.topSpenders.map((customer) => (
              <div key={customer.customer} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{customer.customer}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{customer.count} booking</p>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white">{formatCurrency(customer.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
