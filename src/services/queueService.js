import api from '../api/config'

export const queueService = {
  joinQueue: (queueData) => {
    return api.post('/v1/queues/join', queueData)
  },

  trackQueue: (token) => {
    return api.get(`/v1/queues/track/${token}`)
  },

  getActiveQueuesByBranch: (branchId) => {
    return api.get(`/v1/queues/active/branch/${branchId}`)
  },

  getUserQueues: (userId) => {
    return api.get(`/v1/queues/user/${userId}`)
  },

  updateQueueStatus: (queueId, status) => {
    return api.patch(`/v1/queues/${queueId}/status`, { status })
  },

  cancelQueue: (queueId) => {
    return api.delete(`/v1/queues/${queueId}/cancel`)
  },
}
