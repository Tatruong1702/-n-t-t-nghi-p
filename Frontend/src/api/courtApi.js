import axiosClient from './axiosClient'

const courtApi = {
  list: (params) => axiosClient.get('/courts', { params }),
  get: (id) => axiosClient.get(`/courts/${id}`),
  create: (data) => axiosClient.post('/courts', data),
  update: (id, data) => axiosClient.put(`/courts/${id}`, data),
  delete: (id) => axiosClient.delete(`/courts/${id}`),
}

export default courtApi
