import axiosClient from './axiosClient'

const bookingApi = {
  create: (data) => axiosClient.post('/bookings', data),
  list: (params) => axiosClient.get('/bookings', { params }),
  search: (params) => axiosClient.get('/bookings/search', { params }),
  update: (id, data) => axiosClient.put(`/bookings/${id}`, data),
  delete: (id) => axiosClient.delete(`/bookings/${id}`),
}

export default bookingApi
