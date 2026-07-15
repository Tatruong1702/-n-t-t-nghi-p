import React from 'react'
import { motion } from 'framer-motion'
import { Search, Clock, CreditCard, CheckCircle2 } from 'lucide-react'

const steps = [
  { icon: Search, title: 'Tìm sân', description: 'Lựa chọn sân phù hợp theo vị trí và giá thuê.' },
  { icon: Clock, title: 'Chọn khung giờ', description: 'Chọn thời gian phù hợp cho trận đấu của bạn.' },
  { icon: CreditCard, title: 'Thanh toán', description: 'Thanh toán nhanh qua cổng an toàn.' },
  { icon: CheckCircle2, title: 'Nhận xác nhận', description: 'Xác nhận đặt sân và thông tin chi tiết ngay lập tức.' },
]

export default function BookingSteps() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Quy trình đặt sân</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Đặt sân chỉ với 4 bước</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-8 text-slate-950 shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
            >
              <div className="absolute left-6 top-6 h-14 w-14 rounded-3xl bg-emerald-500/10 text-emerald-500 shadow-lg shadow-emerald-500/10">
                <Icon size={24} className="m-4" />
              </div>
              <div className="mt-14 space-y-4">
                <span className="text-sm uppercase tracking-[0.32em] text-slate-500">Bước {index + 1}</span>
                <h3 className="text-2xl font-semibold text-slate-950">{step.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
