import { useState, useEffect } from 'react'
import { UserPlus, Clock, Users, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { serviceService } from '../services/serviceService'
import { branchService } from '../services/branchService'
import { queueService } from '../services/queueService'

export default function JoinQueue({ onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToCrowdLevel, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings }) {
  const { user } = useAuth()
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceId: '',
    location: '',
    branchId: '',
    priority: 'normal',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [tokenNumber, setTokenNumber] = useState(null)
  const [services, setServices] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log('Fetching services and branches...')
        const [servicesRes, branchesRes] = await Promise.all([
          serviceService.getAllServices(),
          branchService.getAllBranches(),
        ])
        
        console.log('Services response:', servicesRes)
        console.log('Branches response:', branchesRes)
        
        const servicesList = servicesRes?.data || servicesRes || []
        const branchesList = branchesRes?.data || branchesRes || []
        
        console.log('Services list:', servicesList)
        console.log('Branches list:', branchesList)
        
        setServices(Array.isArray(servicesList) ? servicesList : [])
        setBranches(Array.isArray(branchesList) ? branchesList : [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(`Failed to load: ${err.message || 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSelect = (service) => {
    setSelectedService(service)
    setFormData({ ...formData, serviceName: service.name, serviceId: service.id })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedService || !formData.branchId) {
      setError('Please select a service and location')
      return
    }

    setSubmitting(true)
    try {
      const response = await queueService.joinQueue({
        userId: user?.id || 1,
        serviceId: formData.serviceId,
        branchId: formData.branchId,
      })

      const queueData = response.data || response
      const token = queueData.token || queueData.queueId
      
      setTokenNumber(token)
      setIsSubmitted(true)

      setTimeout(() => {
        setIsSubmitted(false)
        setSelectedService(null)
        setFormData({ serviceName: '', serviceId: '', location: '', branchId: '', priority: 'normal' })
      }, 5000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join queue')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (isSubmitted && tokenNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#0a0e27] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                <CheckCircle size={48} className="text-green-400 animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Queue Joined!</h1>
            <p className="text-slate-400 mb-8">You're successfully added to the queue</p>

            <div className="bg-[#1a1f3a]/70 backdrop-blur-xl border border-[#2a3060] rounded-2xl p-8 mb-6">
              <p className="text-slate-400 text-sm mb-2">Your Token Number</p>
              <p className="text-6xl font-black text-green-400 mb-6 font-mono">{tokenNumber}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                  <p className="text-slate-400 text-sm">Service</p>
                  <p className="text-white font-semibold ml-auto">{formData.serviceName}</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                  <p className="text-slate-400 text-sm">Location</p>
                  <p className="text-white font-semibold ml-auto">{formData.location}</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                  <p className="text-slate-400 text-sm">Position</p>
                  <p className="text-white font-semibold ml-auto">#{selectedService?.people + 1}</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                  <p className="text-slate-400 text-sm">Est. Wait Time</p>
                  <p className="text-white font-semibold ml-auto">{selectedService?.waitTime}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Keep this token number handy. You'll be called when it's your turn.
              </p>
            </div>

            <button
              onClick={onNavigateToDashboard}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="joinQueue"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToJoinQueue={() => {}}
        onNavigateToTrackQueue={onNavigateToTrackQueue}
        onNavigateToCrowdLevel={onNavigateToCrowdLevel}
        onNavigateToNotifications={onNavigateToNotifications}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToPriorityQueue={onNavigateToPriorityQueue}
        onNavigateToSettings={onNavigateToSettings}
      />

      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        <header className="bg-[#1a1f3a]/50 backdrop-blur-sm border-b border-[#2a3060] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Join Queue</h1>
              <p className="text-slate-400 text-sm">Get a token and join the waiting line</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {error ? (
              <div className="p-6 bg-red-500/20 border border-red-500/50 rounded-xl text-center">
                <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-300 mb-2">Oops! Something went wrong</h2>
                <p className="text-red-200 mb-4">{error}</p>
                <p className="text-red-100 text-sm">Please make sure your backend server is running at http://localhost:8080</p>
                <button
                  onClick={() => {
                    setError('')
                    setLoading(true)
                    const fetchData = async () => {
                      try {
                        const [servicesRes, branchesRes] = await Promise.all([
                          serviceService.getAllServices(),
                          branchService.getAllBranches(),
                        ])
                        setServices(servicesRes?.data || [])
                        setBranches(branchesRes?.data || [])
                      } catch (err) {
                        setError(`Failed to load: ${err.message}`)
                      } finally {
                        setLoading(false)
                      }
                    }
                    fetchData()
                  }}
                  className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-white transition-all"
                >
                  Retry
                </button>
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-300">Loading services and branches...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <UserPlus size={24} className="text-blue-400" />
                  Select a Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loading ? (
                    <div className="col-span-2 flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : services.length > 0 ? (
                    services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleSelect(service)}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                          selectedService?.id === service.id
                            ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'bg-[#1a1f3a] border-[#2a3060] hover:border-blue-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl">📋</span>
                          {selectedService?.id === service.id && (
                            <CheckCircle size={20} className="text-blue-400" />
                          )}
                        </div>
                        <h3 className="font-bold text-white mb-3">{service.name}</h3>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={14} />
                            Service available
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="col-span-2 py-12 text-center">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8">
                        <AlertCircle size={48} className="text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-yellow-300 mb-2">No Services Available</h3>
                        <p className="text-slate-400 mb-4">
                          Services haven't been added to the system yet. The backend needs to have services configured.
                        </p>
                        <div className="bg-[#0a0e27] border border-[#2a3060] rounded-lg p-4 mb-4 text-left">
                          <p className="text-xs text-slate-500 font-mono mb-2">To fix this:</p>
                          <ul className="text-sm text-slate-300 space-y-2">
                            <li>✓ Make sure backend is running on http://localhost:8080</li>
                            <li>✓ Create services via backend API: POST /v1/service</li>
                            <li>✓ Or add services directly to H2 database</li>
                          </ul>
                        </div>
                        <button
                          onClick={() => {
                            setLoading(true)
                            const fetchData = async () => {
                              try {
                                const [servicesRes, branchesRes] = await Promise.all([
                                  serviceService.getAllServices(),
                                  branchService.getAllBranches(),
                                ])
                                setServices(servicesRes?.data || [])
                                setBranches(branchesRes?.data || [])
                                setError('')
                              } catch (err) {
                                setError(`Failed to load: ${err.message}`)
                              } finally {
                                setLoading(false)
                              }
                            }
                            fetchData()
                          }}
                          className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold text-white transition-all"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-[#1a1f3a]/70 backdrop-blur-xl border border-[#2a3060] rounded-2xl p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-white mb-6">Queue Details</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">Selected Service</label>
                      <div className="p-4 bg-[#0a0e27] border border-[#2a3060] rounded-xl">
                        <p className="text-white font-semibold">
                          {formData.serviceName || 'No service selected'}
                        </p>
                        {selectedService && (
                          <p className="text-blue-400 text-sm mt-1">
                            {selectedService.waitTime} wait � {selectedService.people} ahead
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">Location</label>
                      <select
                        value={formData.branchId}
                        onChange={(e) => {
                          const branch = branches.find(b => b.id === parseInt(e.target.value))
                          setFormData({ ...formData, branchId: parseInt(e.target.value), location: branch?.name })
                        }}
                        className="w-full bg-[#0a0e27] border border-[#2a3060] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        required
                      >
                        <option value="">Choose a location</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Zap size={16} className="text-amber-400" />
                        Priority
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'normal', label: 'Normal' },
                          { value: 'priority', label: 'Priority (if eligible)' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              value={option.value}
                              checked={formData.priority === option.value}
                              onChange={(e) =>
                                setFormData({ ...formData, priority: e.target.value })
                              }
                              className="w-4 h-4 accent-blue-500"
                            />
                            <span className="text-sm text-slate-400">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-2">
                        <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-200">{error}</p>
                      </div>
                    )}

                    <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                      <div className="flex gap-2">
                        <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-200">
                          You'll receive notifications when your turn approaches. Keep your token number safe.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedService || !formData.branchId || submitting}
                      className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Joining...
                        </>
                      ) : (
                        'Join Queue Now'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
