import api from '../api/config'

export const serviceService = {
  getAllServices: () => {
    return api.get('/v1/service')
  },

  getServiceById: (id) => {
    return api.get(`/v1/service/${id}`)
  },

  createService: (serviceData) => {
    return api.post('/v1/service', serviceData)
  },

  updateService: (serviceData) => {
    return api.put('/v1/service', serviceData)
  },

  deleteService: (id) => {
    return api.delete(`/v1/service/${id}`)
  },
}
