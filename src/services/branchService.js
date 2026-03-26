import api from '../api/config'

export const branchService = {
  getAllBranches: () => {
    return api.get('/v1/branches')
  },

  getBranchById: (id) => {
    return api.get(`/v1/branches/${id}`)
  },

  createBranch: (branchData) => {
    return api.post('/v1/branches', branchData)
  },

  updateBranch: (id, branchData) => {
    return api.put(`/v1/branches/${id}`, branchData)
  },

  deleteBranch: (id) => {
    return api.delete(`/v1/branches/${id}`)
  },
}
