import React from 'react'
import { motion } from 'framer-motion'

export default function FilterPanel({ title, children, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] border border-slate-200/70 bg-white/90 p-4 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.24)] backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</h3>
        {actions ? <div>{actions}</div> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  )
}
