import useAuth from './useAuth'

export default function useRole() {
  const { user } = useAuth()
  const role = user?.role || 'guest'

  return {
    role,
    isAdmin: role === 'admin',
    isOwner: role === 'owner',
    isCustomer: role === 'customer',
  }
}
