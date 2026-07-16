import axiosClient from './axiosClient'

const venueApi = {
  list: (params) => axiosClient.get('/venues', { params }),
  search: (params) => axiosClient.get('/venues', { params }),
  get: (id) => axiosClient.get(`/venues/${id}`),
  create: (data) => axiosClient.post('/venues', data),
  update: (id, data) => axiosClient.put(`/venues/${id}`, data),
  delete: (id) => axiosClient.delete(`/venues/${id}`),
}

export default venueApi
