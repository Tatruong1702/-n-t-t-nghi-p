import axiosClient from './axiosClient'

const userApi = {
  profile: () => axiosClient.get('/users/profile'),
  updateProfile: (data) => axiosClient.put('/users/profile', data),
  stats: () => axiosClient.get('/users/stats'),
  dashboard: () => axiosClient.get('/users/dashboard'),
  list: () => axiosClient.get('/users'),
  create: (data) => axiosClient.post('/users', data),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/users/${id}`),
}

export default userApi
