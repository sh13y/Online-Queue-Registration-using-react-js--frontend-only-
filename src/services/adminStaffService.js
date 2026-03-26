import api from '../api/config'

export const adminStaffService = {
  registerAdminStaff: (staffData) => {
    return api.post('/v1/admin-staff/register', staffData)
  },

  getAllAdminStaff: () => {
    return api.get('/v1/admin-staff')
  },

  getAdminStaffById: (staffId) => {
    return api.get(`/v1/admin-staff/${staffId}`)
  },

  updateAdminStaff: (staffId, staffData) => {
    return api.put(`/v1/admin-staff/${staffId}`, staffData)
  },

  deleteAdminStaff: (staffId) => {
    return api.delete(`/v1/admin-staff/${staffId}`)
  },
}
