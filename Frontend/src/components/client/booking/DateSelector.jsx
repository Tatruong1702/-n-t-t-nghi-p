import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

function formatLabel(date, index) {
  if (index === 0) return 'Hôm nay'
  if (index === 1) return 'Ngày mai'
  const day = date.toLocaleDateString('vi-VN', { weekday: 'short' })
  return day
}

function formatShortDate(date) {
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export default React.memo(function DateSelector({ value, onChange }) {
  const dates = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 8 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      return {
        label: formatLabel(date, index),
        date: date.toISOString().slice(0, 10),
        subtitle: formatShortDate(date),
        isWeekend: [0, 6].includes(date.getDay()),
      }
    })
  }, [])

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Chọn ngày</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {dates.map((item) => {
          const isSelected = item.date === value
          return (
            <motion.button
              type="button"
              key={item.date}
              onClick={() => onChange(item.date)}
              whileHover={{ y: -1 }}
              className={`rounded-3xl border p-4 text-left transition ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold">{item.subtitle}</p>
              {item.isWeekend && <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Cuối tuần</span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
})
