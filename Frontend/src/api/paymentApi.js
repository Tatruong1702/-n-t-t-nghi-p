import axiosClient from './axiosClient'

const paymentApi = {
  create: (data) => axiosClient.post('/payments', data),
  list: () => axiosClient.get('/payments'),
}

export default paymentApi
