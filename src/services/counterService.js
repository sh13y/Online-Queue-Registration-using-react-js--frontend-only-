import api from '../api/config'

export const counterService = {
  getAllCounters: () => {
    return api.get('/v1/counter')
  },

  getCountersByService: (serviceId) => {
    return api.get(`/v1/counter/service/${serviceId}`)
  },

  addCounter: (counterData) => {
    return api.post('/v1/counter', counterData)
  },

  updateCounterStatus: (counterId, status) => {
    return api.patch(`/v1/counter/${counterId}/status`, { status })
  },
}
