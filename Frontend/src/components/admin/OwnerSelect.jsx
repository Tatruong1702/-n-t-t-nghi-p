import React, { useEffect, useMemo, useState } from 'react'
import axiosClient from '../../api/axiosClient'

export default function OwnerSelect({ value, onChange, loading }) {
  const [owners, setOwners] = useState([])
  const [loadingOwners, setLoadingOwners] = useState(true)
  const [ownersError, setOwnersError] = useState('')

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const response = await axiosClient.get('/users', { params: { role: 'owner' } })
        setOwners(response.data.data?.users || [])
      } catch (error) {
        console.error(error)
        setOwners([])
        setOwnersError('Không thể tải danh sách chủ sân. Vui lòng thử lại.')
      } finally {
        setLoadingOwners(false)
      }
    }
    loadOwners()
  }, [])

  const ownerOptions = useMemo(
    () => owners.map((owner) => ({
      id: owner.user_id,
      label: `${owner.full_name || 'Unknown'} (${owner.email || 'no-email'})`,
      phone: owner.phone,
    })),
    [owners]
  )

  const selectedOwner = useMemo(() => ownerOptions.find((o) => String(o.id) === String(value)), [ownerOptions, value])

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Chủ sân</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loadingOwners || loading}
          className="mt-2 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50 disabled:text-slate-500"
        >
          <option value="">-- Chọn chủ sân --</option>
          {ownerOptions.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.label}
            </option>
          ))}
        </select>
      </label>
      {ownersError && <p className="text-xs text-red-600">{ownersError}</p>}
      {selectedOwner && (
        <div className="rounded-3xl bg-slate-50 p-3 text-sm text-slate-600">
          <p><span className="font-semibold">Email:</span> {selectedOwner.label.split('(')[1].replace(')', '')}</p>
          {selectedOwner.phone && <p><span className="font-semibold">Điện thoại:</span> {selectedOwner.phone}</p>}
        </div>
      )}
    </div>
  )
}
