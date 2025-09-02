'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, DollarSign, Users, Clock, TrendingUp } from 'lucide-react'

// Mock data for demonstration
const mockCreator = {
  id: '1',
  username: 'cryptodev',
  displayName: 'CryptoDev Academy',
  avatar: '/avatars/cryptodev.jpg',
  followers: 15420,
  totalEarnings: 2847.32,
  isVerified: true,
  isLive: true,
  currentViewers: 342
}

const mockStreams = [
  {
    id: '1',
    title: 'Building DeFi Protocols: Live Coding Session',
    viewerCount: 342,
    earnings: 127.50,
    status: 'live' as const,
    duration: '2h 15m',
    category: 'Education'
  },
  {
    id: '2', 
    title: 'NFT Smart Contract Security Audit',
    viewerCount: 0,
    earnings: 89.30,
    status: 'archived' as const,
    duration: '1h 45m',
    category: 'Tutorial'
  }
]

export default function CreatorDashboard() {
  const [currentEarnings, setCurrentEarnings] = useState(127.50)
  const [liveViewers, setLiveViewers] = useState(342)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEarnings(prev => prev + Math.random() * 0.5)
      setLiveViewers(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">CD</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {mockCreator.displayName}
                {mockCreator.isVerified && (
                  <span className="text-blue-400">✓</span>
                )}
              </h1>
              <p className="text-gray-300">@{mockCreator.username}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {mockCreator.isLive && (
              <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">LIVE</span>
              </div>
            )}
            <button className="bg-gradient-to-r from-pink-600 to-violet-600 px-6 py-2 rounded-lg font-medium hover:from-pink-700 hover:to-violet-700 transition-all">
              Start Stream
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Live Viewers</h3>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold">{liveViewers.toLocaleString()}</p>
            <p className="text-green-400 text-sm">+12% from last stream</p>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Current Earnings</h3>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold">${currentEarnings.toFixed(2)}</p>
            <p className="text-green-400 text-sm">+$2.35 in last 5min</p>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Total Followers</h3>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-2xl font-bold">{mockCreator.followers.toLocaleString()}</p>
            <p className="text-green-400 text-sm">+47 today</p>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm">Monthly Revenue</h3>
              <DollarSign className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold">${mockCreator.totalEarnings.toFixed(2)}</p>
            <p className="text-green-400 text-sm">97% retention rate</p>
          </motion.div>
        </div>

        {/* Recent Streams */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold mb-6">Your Streams</h2>
          
          <div className="space-y-4">
            {mockStreams.map((stream) => (
              <motion.div
                key={stream.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{stream.title}</h3>
                    <p className="text-gray-400 text-sm">{stream.category} • {stream.duration}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Viewers</p>
                    <p className="font-medium">{stream.viewerCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Earned</p>
                    <p className="font-medium text-green-400">${stream.earnings}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {stream.status === 'live' ? (
                      <span className="bg-red-600 px-2 py-1 rounded text-xs">LIVE</span>
                    ) : (
                      <span className="bg-gray-600 px-2 py-1 rounded text-xs">ARCHIVED</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filecoin Integration Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold mb-4">Storage Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">WarmStorage</span>
                <span className="text-green-400">✓ Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Content Archived</span>
                <span className="text-white">2.3 TB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Storage Deals</span>
                <span className="text-white">12 Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Replication</span>
                <span className="text-white">3x Global</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold mb-4">Payment Analytics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Payment Channels</span>
                <span className="text-green-400">18 Open</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Avg. Revenue/Min</span>
                <span className="text-white">$0.37</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Platform Fee</span>
                <span className="text-white">3% (vs 45% YouTube)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Instant Payouts</span>
                <span className="text-green-400">✓ Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
