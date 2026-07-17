import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ConfirmModal({ open, title, description, confirmLabel = 'Xác nhận', cancelLabel = 'Hủy', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onCancel} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">{cancelLabel}</button>
            <button onClick={onConfirm} className="rounded-2xl bg-gradient-to-r from-cyan-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white">{confirmLabel}</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
