import React from 'react'

const styles = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  info: 'bg-cyan-100 text-cyan-700',
}

export default function StatusBadge({ label, tone = 'default' }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[tone] || styles.default}`}>{label}</span>
}
