import React from 'react'
import { Download, Printer, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'

const BookingExport = React.memo(function BookingExport({ bookings, onExport }) {
  const handleExportCsv = () => {
    const rows = bookings.map((booking) => ({
      booking_id: booking.booking_id,
      customer: booking.customerName || `User ${booking.user_id}`,
      venue: booking.venueName,
      court: booking.courtName,
      date: booking.booking_date,
      time: `${booking.start_time}-${booking.end_time}`,
      total_price: booking.total_price,
      status: booking.status,
      payment_status: booking.paymentStatus || 'unpaid',
    }))
    const csv = rows.map((row) => Object.values(row).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'bookings.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(bookings.map((booking) => ({
      booking_id: booking.booking_id,
      customer: booking.customerName || `User ${booking.user_id}`,
      venue: booking.venueName,
      court: booking.courtName,
      date: booking.booking_date,
      time: `${booking.start_time}-${booking.end_time}`,
      total_price: booking.total_price,
      status: booking.status,
      payment_status: booking.paymentStatus || 'unpaid',
    })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings')
    XLSX.writeFile(workbook, 'bookings.xlsx')
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={handleExportExcel} className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
        <FileSpreadsheet className="h-4 w-4" /> Excel
      </button>
      <button onClick={handleExportCsv} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
        <Download className="h-4 w-4" /> CSV
      </button>
      <button onClick={onExport} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
        <Printer className="h-4 w-4" /> PDF
      </button>
    </div>
  )
})

export default BookingExport
