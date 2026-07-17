import React from 'react'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500 text-white">
              SP
            </div>
            <p className="max-w-sm text-sm leading-7 text-slate-400">
              StadiumPro giúp bạn tìm sân bóng, đặt lịch nhanh và kết nối cùng cộng đồng thể thao trên toàn quốc.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <Mail size={18} />
              <span>support@stadiumpro.vn</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Phone size={18} />
              <span>1900 1234</span>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Danh mục sân</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="transition hover:text-white">Sân 5 người</a></li>
              <li><a href="#" className="transition hover:text-white">Sân 7 người</a></li>
              <li><a href="#" className="transition hover:text-white">Sân cỏ nhân tạo</a></li>
              <li><a href="#" className="transition hover:text-white">Sân mini</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Chính sách</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="transition hover:text-white">Chính sách hoàn tiền</a></li>
              <li><a href="#" className="transition hover:text-white">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="transition hover:text-white">Chính sách bảo mật</a></li>
              <li><a href="#" className="transition hover:text-white">Hổ trợ khách hàng</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Kết nối</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white/5 text-slate-200 transition hover:bg-white/10"><Facebook size={18} /></a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white/5 text-slate-200 transition hover:bg-white/10"><Instagram size={18} /></a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} StadiumPro. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
