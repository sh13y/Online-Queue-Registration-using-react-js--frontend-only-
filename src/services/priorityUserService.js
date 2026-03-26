import api from '../api/config'

export const priorityUserService = {
  getPriorityUserById: (priorityId) => {
    return api.get(`/v1/priority-users/${priorityId}`)
  },

  getPriorityUserByUserId: (userId) => {
    return api.get(`/v1/priority-users/user/${userId}`)
  },

  createPriorityUser: (priorityData) => {
    return api.post('/v1/priority-users', priorityData)
  },

  updatePriorityUser: (priorityId, priorityData) => {
    return api.put(`/v1/priority-users/${priorityId}`, priorityData)
  },

  deletePriorityUser: (priorityId) => {
    return api.delete(`/v1/priority-users/${priorityId}`)
  },
}
