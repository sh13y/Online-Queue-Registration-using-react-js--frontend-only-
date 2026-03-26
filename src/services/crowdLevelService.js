import api from '../api/config'

export const crowdLevelService = {
  getAllCrowdLevels: () => {
    return api.get('/v1/crowd-levels')
  },

  getCrowdLevelByBranch: (branchId) => {
    return api.get(`/v1/crowd-levels/${branchId}`)
  },

  updateCrowdLevel: (branchId, crowdData) => {
    return api.put(`/v1/crowd-levels/update/${branchId}`, crowdData)
  },
}
