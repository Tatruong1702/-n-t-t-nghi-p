export const getAvatarUrl = (user) => {
  const avatarSource = user?.avatar_url || user?.avatar || user?.profile_image || ''
  if (!avatarSource) return ''
  if (/^https?:\/\//i.test(avatarSource)) return avatarSource

  let baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
  baseUrl = baseUrl.replace(/\/api$/, '')

  if (!baseUrl) return avatarSource.startsWith('/') ? avatarSource : `/${avatarSource}`
  return avatarSource.startsWith('/') ? `${baseUrl}${avatarSource}` : `${baseUrl}/${avatarSource}`
}

export const getInitials = (displayName) => {
  if (!displayName) return 'TT'
  return displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
