import axiosClient from './axiosClient'

const reviewApi = {
  list: (params) => axiosClient.get('/reviews', { params }),
}

export default reviewApi
