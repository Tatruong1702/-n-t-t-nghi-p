const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const apiOrigin = apiUrl.replace(/\/api$/, '')

export default function getImageUrl(path) {
  if (!path) return ''
  if (typeof path !== 'string') return ''
  if (/^https?:\/\//.test(path)) return path
  if (path.startsWith('/uploads')) return `${apiOrigin}${path}`
  return path
}
