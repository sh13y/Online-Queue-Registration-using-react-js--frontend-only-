import api from '../api/config'

export const userPreferencesService = {
  getUserPreferences: (userId) => {
    return api.get(`/v1/user-preferences/${userId}`)
  },

  saveUserPreferences: (preferencesData) => {
    return api.put('/v1/user-preferences', preferencesData)
  },

  deleteUserPreferences: (preferenceId) => {
    return api.delete(`/v1/user-preferences/${preferenceId}`)
  },
}
