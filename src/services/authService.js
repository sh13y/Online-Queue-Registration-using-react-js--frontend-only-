import api from '../api/config'

export const authService = {
  signup: (userData) => {
    return api.post('/v1/user', userData)
  },

  getUser: (userId) => {
    return api.get(`/v1/user/${userId}`)
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  verifyToken: () => {
    return api.get('/v1/auth/verify')
  },
}
