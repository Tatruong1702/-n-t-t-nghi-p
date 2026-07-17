import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import useAuth from '../../hooks/useAuth'

export default function UserHomeButton() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('/home')
  }

  if (!user) return null

  return (
    <button
      type="button"
      onClick={handleNavigate}
      title="Trang người dùng"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition duration-300 hover:scale-[1.03] hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-white"
    >
      <Home size={18} />
      <span className="hidden lg:inline">Trang người dùng</span>
    </button>
  )
}
