import axiosClient from './axiosClient'

const promotionApi = {
  list: () => axiosClient.get('/promotions'),
}

export default promotionApi
