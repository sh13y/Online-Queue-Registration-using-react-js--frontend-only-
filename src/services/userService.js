import api from '../api/config'

export const userService = {
  getAllUsers: () => {
    return api.get('/v1/user')
  },

  getUserById: (userId) => {
    return api.get(`/v1/user/${userId}`)
  },

  updateUser: (userData) => {
    return api.put('/v1/user', userData)
  },

  deleteUser: (userId) => {
    return api.delete(`/v1/user/${userId}`)
  },
}
