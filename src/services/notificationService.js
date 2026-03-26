import api from '../api/config'

export const notificationService = {
  getUserNotifications: (userId) => {
    return api.get(`/v1/notification/user/${userId}`)
  },

  markAsRead: (notificationId) => {
    return api.patch(`/v1/notification/${notificationId}/read`)
  },

  deleteNotification: (notificationId) => {
    return api.delete(`/v1/notification/${notificationId}`)
  },
}
