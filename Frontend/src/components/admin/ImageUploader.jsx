import React, { useCallback, useState } from 'react'

export default function ImageUploader({ onImageChange, preview, onRemove }) {
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')
  const [imageMode, setImageMode] = useState('upload')

  const validateUrl = useCallback((url) => {
    try {
      new URL(url)
      setUrlError('')
      return true
    } catch {
      setUrlError('URL không hợp lệ')
      return false
    }
  }, [])

  const handleFileUpload = useCallback(
    (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        onImageChange(reader.result, 'file')
        setUrlInput('')
        setUrlError('')
      }
      reader.readAsDataURL(file)
    },
    [onImageChange]
  )

  const handleUrlChange = useCallback(
    (e) => {
      const url = e.target.value
      setUrlInput(url)
      if (!url) {
        setUrlError('')
        return
      }
      if (validateUrl(url)) {
        onImageChange(url, 'url')
      }
    },
    [validateUrl, onImageChange]
  )

  const handleRemove = useCallback(() => {
    setUrlInput('')
    setUrlError('')
    onRemove()
  }, [onRemove])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setImageMode('upload')}
          className={`flex-1 rounded-3xl px-4 py-2 text-sm font-semibold transition ${
            imageMode === 'upload' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setImageMode('url')}
          className={`flex-1 rounded-3xl px-4 py-2 text-sm font-semibold transition ${
            imageMode === 'url' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          URL Ảnh
        </button>
      </div>

      {imageMode === 'upload' ? (
        <div className="space-y-3">
          <label className="block">
            <span className="cursor-pointer inline-flex items-center justify-center w-full h-40 rounded-[1.75rem] border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 transition">
              <div className="text-center">
                <i className="ti ti-cloud-upload text-3xl text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">Chọn file hoặc kéo thả</p>
                <p className="text-xs text-slate-500">PNG, JPG, WebP (Max 5MB)</p>
              </div>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={handleUrlChange}
            className={`w-full rounded-3xl border px-4 py-3 text-sm outline-none transition ${
              urlError
                ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400'
                : 'border-slate-300 bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-100'
            }`}
          />
          {urlError && <p className="text-xs text-red-600">{urlError}</p>}
        </div>
      )}

      {preview && (
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
          <img src={preview} alt="preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-red-500 text-white p-2 hover:bg-red-600 transition"
          >
            <i className="ti ti-trash text-sm" />
          </button>
        </div>
      )}
    </div>
  )
}
