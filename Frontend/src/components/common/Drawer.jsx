import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Drawer({ open, title, onClose, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 220, damping: 24 }} className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl border-l border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
              <button onClick={onClose} className="rounded-full border border-slate-200 p-2 text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 overflow-y-auto pb-8">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
