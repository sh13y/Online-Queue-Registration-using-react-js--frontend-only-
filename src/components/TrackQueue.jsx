import { useState, useEffect } from 'react'
import { Clock, AlertCircle, Bell, RefreshCw } from 'lucide-react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { queueService } from '../services/queueService'

export default function TrackQueue({ onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToCrowdLevel, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings }) {
  const { user } = useAuth()
  const [queueData, setQueueData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Fetch user's queue on mount
  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setLoading(true)
        const response = await queueService.getUserQueues(user?.id || 1)
        const queues = response.data || []
        const activeQueue = queues.find(q => q.status === 'PENDING' || q.status === 'CALLED') || queues[0]
        
        if (activeQueue) {
          setQueueData(activeQueue)
        } else {
          setError('No active queue found. Join a queue first.')
        }
      } catch (err) {
        setError('Failed to fetch queue data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchQueue()
  }, [user?.id])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      if (queueData?.token) {
        const response = await queueService.trackQueue(queueData.token)
        setQueueData(response.data || response)
      }
    } catch (err) {
      setError('Failed to refresh queue status')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="trackQueue"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToJoinQueue={onNavigateToJoinQueue}
        onNavigateToTrackQueue={onNavigateToTrackQueue}
        onNavigateToCrowdLevel={onNavigateToCrowdLevel}
        onNavigateToNotifications={onNavigateToNotifications}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToPriorityQueue={onNavigateToPriorityQueue}
        onNavigateToSettings={onNavigateToSettings}
      />

      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header */}
        <header className="bg-[#1a1f3a]/50 backdrop-blur-sm border-b border-[#2a3060] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Track Queue</h1>
              <p className="text-slate-400 text-sm">Monitor your position in real-time</p>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 rounded-xl bg-[#2a3060] hover:bg-[#3a4080] border border-[#3a4080] transition-all text-slate-300 hover:text-white disabled:opacity-50"
            >
              <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400">Loading queue information...</p>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl flex gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-semibold">{error}</p>
                  <button
                    onClick={onNavigateToJoinQueue}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white transition-all"
                  >
                    Join Queue Now
                  </button>
                </div>
              </div>
            ) : queueData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Tracking */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Token Card */}
                  <div className="bg-gradient-to-br from-[#1a2f4a] to-[#1a1f3a] border border-blue-500/20 rounded-2xl p-8">
                    <p className="text-slate-400 text-sm mb-2">Your Token</p>
                    <p className="text-7xl font-black text-blue-400 mb-4 font-mono">{queueData.token}</p>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Position</p>
                        <p className="text-white font-semibold">#{queueData.position}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Est. Wait Time</p>
                        <p className="text-white font-semibold flex items-center gap-1">
                          <Clock size={16} className="text-blue-400" />
                          {queueData.estimatedWaitTime || '~15 min'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-[#1a1f3a]/70 border border-[#2a3060] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white">Queue Status</h3>
                      <span className="text-sm font-semibold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full">
                        {queueData.status}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Your Position</span>
                        <span className="text-white font-semibold">#{queueData.position}</span>
                      </div>
                      <div className="w-full h-2 bg-[#0a0e27] rounded-full overflow-hidden border border-[#2a3060]">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (10 - queueData.position) * 10)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Joined Time */}
                  <div className="bg-[#1a1f3a]/70 border border-[#2a3060] rounded-2xl p-6">
                    <h3 className="font-bold text-white mb-4">Queue Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Joined At</span>
                        <span className="text-white">{queueData.joinedTime || new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status</span>
                        <span className="text-white capitalize">{queueData.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Queue ID</span>
                        <span className="text-white font-mono">{queueData.queueId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-[#1a1f3a]/70 border border-[#2a3060] rounded-2xl p-6 sticky top-8">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                      <Bell size={20} className="text-amber-400" />
                      Tips
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-blue-200">
                          ? Keep this token number handy
                        </p>
                      </div>
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-200">
                          ? Stay nearby - you will be called soon
                        </p>
                      </div>
                      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <p className="text-purple-200">
                          ? Click refresh to get latest updates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-slate-400 mb-6">No queue information available</p>
                <button
                  onClick={onNavigateToJoinQueue}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-all"
                >
                  Join a Queue
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
