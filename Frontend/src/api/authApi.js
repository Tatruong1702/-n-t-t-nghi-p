import axiosClient from './axiosClient'

const authApi = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),
  profile: () => axiosClient.get('/auth/profile'),
}

export default authApi
