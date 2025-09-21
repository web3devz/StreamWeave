// Main Dashboard Component
// Real-time streaming dashboard with Filecoin integration

import React, { useState, useEffect } from 'react'
// import { StreamingInfrastructure } from '../core/streaming-infrastructure'
// import { FilecoinClient } from '../core/filecoin-client'
// import { WalletManager } from '../core/wallet-manager'

interface DashboardState {
  activeStreams: any[]
  totalRevenue: number
  viewerCount: number
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
  wallet: any
}

interface StreamMetrics {
  streamId: string
  title: string
  viewerCount: number
  revenue: number
  duration: number
  status: string
}

export const Dashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    activeStreams: [],
    totalRevenue: 0,
    viewerCount: 0,
    connectionStatus: 'disconnected',
    wallet: null
  })
  
  const [streaming] = useState(new StreamingInfrastructure())
  const [filecoin] = useState(new FilecoinClient({ network: 'mainnet' }))
  const [walletManager] = useState(new WalletManager())
  const [isLive, setIsLive] = useState(false)
  const [streamMetrics, setStreamMetrics] = useState<StreamMetrics[]>([])

  useEffect(() => {
    // Initialize dashboard
    initializeDashboard()
    
    // Setup event listeners
    setupEventListeners()
    
    return () => {
      cleanup()
    }
  }, [])

  const initializeDashboard = async () => {
    try {
      setState(prev => ({ ...prev, connectionStatus: 'connecting' }))
      
      // Load active streams
      const activeStreams = streaming.getActiveStreams()
      
      // Calculate metrics
      const totalViewers = activeStreams.reduce((sum, stream) => sum + stream.viewers.size, 0)
      
      setState(prev => ({
        ...prev,
        activeStreams,
        viewerCount: totalViewers,
        connectionStatus: 'connected'
      }))
      
      console.log('📊 Dashboard initialized')
    } catch (error) {
      console.error('Dashboard initialization failed:', error)
      setState(prev => ({ ...prev, connectionStatus: 'disconnected' }))
    }
  }

  const setupEventListeners = () => {
    // Streaming events
    streaming.on('streamStarted', handleStreamStarted)
    streaming.on('streamEnded', handleStreamEnded)
    streaming.on('viewerJoined', handleViewerJoined)
    streaming.on('viewerLeft', handleViewerLeft)
    
    // Wallet events
    walletManager.on('walletConnected', handleWalletConnected)
    walletManager.on('walletDisconnected', handleWalletDisconnected)
    walletManager.on('transactionConfirmed', handleTransactionConfirmed)
  }

  const cleanup = () => {
    streaming.removeAllListeners()
    walletManager.removeAllListeners()
  }

  // Event handlers
  const handleStreamStarted = (stream: any) => {
    setState(prev => ({
      ...prev,
      activeStreams: [...prev.activeStreams, stream]
    }))
    
    const metrics: StreamMetrics = {
      streamId: stream.id,
      title: stream.title,
      viewerCount: 0,
      revenue: 0,
      duration: 0,
      status: stream.status
    }
    
    setStreamMetrics(prev => [...prev, metrics])
    console.log('🔴 Stream started:', stream.id)
  }

  const handleStreamEnded = (stream: any) => {
    setState(prev => ({
      ...prev,
      activeStreams: prev.activeStreams.filter(s => s.id !== stream.id)
    }))
    
    setStreamMetrics(prev => 
      prev.map(m => 
        m.streamId === stream.id 
          ? { ...m, status: 'ended' }
          : m
      )
    )
    
    console.log('⏹️ Stream ended:', stream.id)
    setIsLive(false)
  }

  const handleViewerJoined = ({ streamId, viewerId, viewerCount }: any) => {
    setState(prev => ({
      ...prev,
      viewerCount: prev.viewerCount + 1
    }))
    
    setStreamMetrics(prev =>
      prev.map(m =>
        m.streamId === streamId
          ? { ...m, viewerCount }
          : m
      )
    )
    
    console.log(`👤 Viewer joined: ${viewerId}`)
  }

  const handleViewerLeft = ({ streamId, viewerId, viewerCount }: any) => {
    setState(prev => ({
      ...prev,
      viewerCount: Math.max(0, prev.viewerCount - 1)
    }))
    
    setStreamMetrics(prev =>
      prev.map(m =>
        m.streamId === streamId
          ? { ...m, viewerCount }
          : m
      )
    )
    
    console.log(`👤 Viewer left: ${viewerId}`)
  }

  const handleWalletConnected = (wallet: any) => {
    setState(prev => ({ ...prev, wallet }))
    console.log('💰 Wallet connected:', wallet.address)
  }

  const handleWalletDisconnected = () => {
    setState(prev => ({ ...prev, wallet: null }))
    console.log('💰 Wallet disconnected')
  }

  const handleTransactionConfirmed = (tx: any) => {
    console.log('✅ Transaction confirmed:', tx.hash)
    // Update revenue metrics
    updateRevenueMetrics()
  }

  // Action handlers
  const startStream = async (title: string, quality: string) => {
    try {
      if (!state.wallet) {
        throw new Error('Please connect wallet first')
      }
      
      const stream = await streaming.startStream({
        streamerId: state.wallet.address,
        title,
        quality: quality as any
      })
      
      setIsLive(true)
      console.log('🔴 Starting stream:', stream.id)
      
      // Archive stream metadata to IPFS/Filecoin
      await filecoin.archiveStream({
        id: stream.id,
        title: stream.title,
        creator: stream.streamerId,
        data: Buffer.from(JSON.stringify({
          startTime: stream.startTime.toISOString(),
          config: stream.config
        })),
        size: 1024,
        duration: 0,
        format: 'json'
      })
      
    } catch (error) {
      console.error('Failed to start stream:', error)
      alert('Failed to start stream: ' + (error as Error).message)
    }
  }

  const endStream = async (streamId: string) => {
    try {
      await streaming.endStream(streamId)
      console.log('⏹️ Stream ended:', streamId)
    } catch (error) {
      console.error('Failed to end stream:', error)
    }
  }

  const connectWallet = async (provider: string) => {
    try {
      let wallet
      switch (provider) {
        case 'metamask':
          wallet = await walletManager.connectMetaMask()
          break
        case 'walletconnect':
          wallet = await walletManager.connectWalletConnect()
          break
        case 'glif':
          wallet = await walletManager.connectGlif()
          break
        default:
          throw new Error('Unsupported wallet provider')
      }
      
      console.log('Wallet connected:', wallet)
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert('Wallet connection failed: ' + (error as Error).message)
    }
  }

  const updateRevenueMetrics = async () => {
    try {
      // Calculate total revenue from all streams
      let totalRevenue = 0
      
      for (const stream of state.activeStreams) {
        const stats = streaming.getStreamStats(stream.id)
        if (stats) {
          // In real implementation, would fetch actual revenue from smart contract
          const mockRevenue = stats.viewerCount * 0.01 // 0.01 FIL per view
          totalRevenue += mockRevenue
          
          // Update stream metrics
          setStreamMetrics(prev =>
            prev.map(m =>
              m.streamId === stream.id
                ? { ...m, revenue: mockRevenue, duration: stats.duration }
                : m
            )
          )
        }
      }
      
      setState(prev => ({ ...prev, totalRevenue }))
    } catch (error) {
      console.error('Failed to update revenue metrics:', error)
    }
  }

  const formatCurrency = (amount: number): string => {
    return `${amount.toFixed(4)} FIL`
  }

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>StreamWeave Dashboard</h1>
        <div className="connection-status">
          <span className={`status-indicator ${state.connectionStatus}`}>
            {state.connectionStatus === 'connected' ? '🟢' : 
             state.connectionStatus === 'connecting' ? '🟡' : '🔴'}
          </span>
          <span>{state.connectionStatus}</span>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="wallet-section">
        <h2>Wallet</h2>
        {state.wallet ? (
          <div className="wallet-info">
            <p><strong>Address:</strong> {state.wallet.address}</p>
            <p><strong>Balance:</strong> {state.wallet.balance} FIL</p>
            <p><strong>Provider:</strong> {state.wallet.provider}</p>
            <button onClick={() => walletManager.disconnect()}>
              Disconnect
            </button>
          </div>
        ) : (
          <div className="wallet-connect">
            <p>Connect your wallet to start streaming</p>
            <button onClick={() => connectWallet('metamask')}>
              🦊 MetaMask
            </button>
            <button onClick={() => connectWallet('walletconnect')}>
              🔗 WalletConnect
            </button>
            <button onClick={() => connectWallet('glif')}>
              🌐 Glif Wallet
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Streams</h3>
          <div className="stat-value">{state.activeStreams.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Viewers</h3>
          <div className="stat-value">{state.viewerCount}</div>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <div className="stat-value">{formatCurrency(state.totalRevenue)}</div>
        </div>
        <div className="stat-card">
          <h3>Status</h3>
          <div className="stat-value">{isLive ? '🔴 LIVE' : '⚪ OFFLINE'}</div>
        </div>
      </div>

      {/* Stream Controls */}
      <div className="stream-controls">
        <h2>Stream Controls</h2>
        {!isLive ? (
          <div className="start-stream">
            <input
              type="text"
              placeholder="Stream title"
              id="stream-title"
            />
            <select id="stream-quality">
              <option value="720p60">720p 60fps</option>
              <option value="1080p60">1080p 60fps</option>
              <option value="480p30">480p 30fps</option>
              <option value="360p30">360p 30fps</option>
            </select>
            <button
              onClick={() => {
                const title = (document.getElementById('stream-title') as HTMLInputElement)?.value || 'Untitled Stream'
                const quality = (document.getElementById('stream-quality') as HTMLSelectElement)?.value || '720p60'
                startStream(title, quality)
              }}
              disabled={!state.wallet}
            >
              🔴 Start Stream
            </button>
          </div>
        ) : (
          <div className="live-controls">
            <p>🔴 You are currently live</p>
            <button
              onClick={() => {
                const activeStream = state.activeStreams[0]
                if (activeStream) {
                  endStream(activeStream.id)
                }
              }}
            >
              ⏹️ End Stream
            </button>
          </div>
        )}
      </div>

      {/* Stream Metrics */}
      <div className="stream-metrics">
        <h2>Stream Metrics</h2>
        {streamMetrics.length === 0 ? (
          <p>No streams yet. Start your first stream!</p>
        ) : (
          <div className="metrics-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Viewers</th>
                  <th>Duration</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {streamMetrics.map(metric => (
                  <tr key={metric.streamId}>
                    <td>{metric.title}</td>
                    <td>
                      <span className={`status-badge ${metric.status}`}>
                        {metric.status}
                      </span>
                    </td>
                    <td>{metric.viewerCount}</td>
                    <td>{formatDuration(metric.duration)}</td>
                    <td>{formatCurrency(metric.revenue)}</td>
                    <td>
                      {metric.status === 'live' && (
                        <button onClick={() => endStream(metric.streamId)}>
                          End
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Streams */}
      <div className="active-streams">
        <h2>Active Streams</h2>
        {state.activeStreams.length === 0 ? (
          <p>No active streams</p>
        ) : (
          <div className="streams-grid">
            {state.activeStreams.map(stream => (
              <div key={stream.id} className="stream-card">
                <h3>{stream.title}</h3>
                <p><strong>Streamer:</strong> {stream.streamerId}</p>
                <p><strong>Viewers:</strong> {stream.viewers.size}</p>
                <p><strong>Quality:</strong> {stream.config.quality}</p>
                <p><strong>Status:</strong> {stream.status}</p>
                <div className="stream-actions">
                  <button onClick={() => endStream(stream.id)}>
                    End Stream
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard