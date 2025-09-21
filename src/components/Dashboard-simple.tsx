// Main Dashboard Component - Simplified MVP Version
// Real-time streaming dashboard with Filecoin integration and TFIL/USDFC conversion

import React, { useState, useEffect } from 'react'
import { CurrencyConverter } from '../core/currency-converter'

interface DashboardState {
  activeStreams: number
  totalRevenue: number
  viewerCount: number
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
  wallet: any
  preferredCurrency: 'TFIL' | 'USDFC' | 'FIL'
}

export const Dashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    activeStreams: 0,
    totalRevenue: 0,
    viewerCount: 0,
    connectionStatus: 'disconnected',
    wallet: null,
    preferredCurrency: 'TFIL'
  })
  
  const [isLive, setIsLive] = useState(false)
  const [currencyConverter] = useState(new CurrencyConverter())
  const [exchangeRates, setExchangeRates] = useState<any>(null)
  
  // Exchange interface state
  const [exchangeAmount, setExchangeAmount] = useState('')
  const [exchangeFrom, setExchangeFrom] = useState<'TFIL' | 'USDFC'>('TFIL')
  const [exchangeTo, setExchangeTo] = useState<'TFIL' | 'USDFC'>('USDFC')
  const [exchangeResult, setExchangeResult] = useState<number>(0)
  const [isExchanging, setIsExchanging] = useState(false)
  const [exchangeHistory, setExchangeHistory] = useState<Array<{
    id: string
    from: string
    to: string
    fromAmount: number
    toAmount: number
    rate: number
    timestamp: number
  }>>([])
  
  interface ExchangeTransaction {
    id: string
    from: 'TFIL' | 'USDFC'
    to: 'TFIL' | 'USDFC'
    fromAmount: number
    toAmount: number
    rate: number
    timestamp: number
  }

  useEffect(() => {
    // Check online status and set connection
    const checkConnection = () => {
      if (navigator.onLine) {
        setState(prev => ({ ...prev, connectionStatus: 'connected' }))
      } else {
        setState(prev => ({ ...prev, connectionStatus: 'disconnected' }))
      }
    }
    
    // Initial connection check
    checkConnection()
    
    // Listen for online/offline events
    window.addEventListener('online', checkConnection)
    window.addEventListener('offline', checkConnection)
    
    // Load initial exchange rates
    const rates = currencyConverter.getMarketSummary()
    setExchangeRates(rates)
    console.log('💱 Initial exchange rates loaded:', rates)
    
    // Update rates every 5 seconds for more responsive UI
    const rateInterval = setInterval(() => {
      const updatedRates = currencyConverter.getMarketSummary()
      setExchangeRates(updatedRates)
      console.log('💱 Exchange rates updated:', updatedRates)
    }, 5000)
    
    return () => {
      clearInterval(rateInterval)
      window.removeEventListener('online', checkConnection)
      window.removeEventListener('offline', checkConnection)
    }
  }, [])
  
  // Recalculate exchange when rates update
  useEffect(() => {
    if (exchangeAmount && exchangeRates) {
      calculateExchange(exchangeAmount, exchangeFrom, exchangeTo)
    }
  }, [exchangeRates])

  const connectWallet = async (provider: string) => {
    try {
      setState(prev => ({ ...prev, connectionStatus: 'connecting' }))
      
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockWallet = {
        address: '0x' + Math.random().toString(16).substr(2, 40),
        balance: (Math.random() * 100).toFixed(4),
        provider
      }
      
      setState(prev => ({ 
        ...prev, 
        wallet: mockWallet,
        connectionStatus: 'connected'
      }))
      
      console.log('Wallet connected:', mockWallet)
    } catch (error) {
      console.error('Wallet connection failed:', error)
      setState(prev => ({ ...prev, connectionStatus: 'disconnected' }))
    }
  }

  const startStream = async (title: string, quality: string) => {
    try {
      if (!state.wallet) {
        alert('Please connect wallet first')
        return
      }
      
      setIsLive(true)
      setState(prev => ({ 
        ...prev, 
        activeStreams: prev.activeStreams + 1,
        viewerCount: Math.floor(Math.random() * 100)
      }))
      
      console.log('🔴 Stream started:', title, quality)
    } catch (error) {
      console.error('Failed to start stream:', error)
      alert('Failed to start stream')
    }
  }

  const endStream = async () => {
    setIsLive(false)
    setState(prev => ({ 
      ...prev, 
      activeStreams: Math.max(0, prev.activeStreams - 1),
      totalRevenue: prev.totalRevenue + Math.random() * 10
    }))
    console.log('⏹️ Stream ended')
  }

  const formatCurrency = (amount: number): string => {
    return currencyConverter.getDualCurrencyDisplay(amount, state.preferredCurrency)
  }

  const formatSingleCurrency = (amount: number, currency: 'TFIL' | 'USDFC' | 'FIL'): string => {
    return currencyConverter.formatCurrency(amount, currency)
  }

  const toggleCurrency = () => {
    setState(prev => ({
      ...prev,
      preferredCurrency: prev.preferredCurrency === 'TFIL' ? 'USDFC' : 'TFIL'
    }))
  }

  // Exchange functions
  const calculateExchange = (amount: string, from: 'TFIL' | 'USDFC', to: 'TFIL' | 'USDFC') => {
    if (!amount || isNaN(parseFloat(amount))) {
      setExchangeResult(0)
      return
    }
    
    const numAmount = parseFloat(amount)
    try {
      let result: number
      if (from === 'TFIL' && to === 'USDFC') {
        result = currencyConverter.convertTFilToUsdfc(numAmount).convertedAmount.amount
      } else if (from === 'USDFC' && to === 'TFIL') {
        result = currencyConverter.convertUsdfcToTFil(numAmount).convertedAmount.amount
      } else {
        result = numAmount // Same currency
      }
      setExchangeResult(result)
    } catch (error) {
      console.error('Exchange calculation error:', error)
      setExchangeResult(0)
    }
  }

  const handleExchangeAmountChange = (value: string) => {
    setExchangeAmount(value)
    calculateExchange(value, exchangeFrom, exchangeTo)
  }

  const swapExchangeCurrencies = () => {
    const newFrom = exchangeTo
    const newTo = exchangeFrom
    setExchangeFrom(newFrom)
    setExchangeTo(newTo)
    calculateExchange(exchangeAmount, newFrom, newTo)
  }

  const executeExchange = async () => {
    if (!state.wallet || !exchangeAmount || parseFloat(exchangeAmount) <= 0) {
      alert('Please connect wallet and enter a valid amount')
      return
    }

    setIsExchanging(true)
    try {
      // Simulate exchange transaction
      console.log(`🔄 Exchanging ${exchangeAmount} ${exchangeFrom} to ${exchangeTo}`)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction time
      
      // Add to transaction history
      const transaction: ExchangeTransaction = {
        id: Date.now().toString(),
        from: exchangeFrom,
        to: exchangeTo,
        fromAmount: parseFloat(exchangeAmount),
        toAmount: exchangeResult,
        rate: exchangeFrom === 'TFIL' 
          ? exchangeRates?.tfilToUsdfc || 0 
          : 1 / (exchangeRates?.tfilToUsdfc || 1),
        timestamp: Date.now()
      }
      
      setExchangeHistory(prev => [transaction, ...prev.slice(0, 4)]) // Keep last 5 transactions
      
      alert(`✅ Successfully exchanged ${exchangeAmount} ${exchangeFrom} to ${exchangeResult.toFixed(4)} ${exchangeTo}`)
      
      // Clear exchange form
      setExchangeAmount('')
      setExchangeResult(0)
      
    } catch (error) {
      console.error('Exchange failed:', error)
      alert('❌ Exchange failed. Please try again.')
    } finally {
      setIsExchanging(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>StreamWeave Dashboard</h1>
        <div className="header-controls">
          <div className="currency-toggle">
            <button onClick={toggleCurrency} className="currency-btn">
              💱 {state.preferredCurrency}
            </button>
            {exchangeRates && (
              <div className="exchange-rate-info">
                <span>1 TFIL = {exchangeRates.tfilToUsdfc.toFixed(4)} USDFC</span>
              </div>
            )}
          </div>
          <div className="connection-status">
            <span className={`status-indicator ${state.connectionStatus}`}>
              {state.connectionStatus === 'connected' ? '🟢' : 
               state.connectionStatus === 'connecting' ? '🟡' : '🔴'}
            </span>
            <span>{state.connectionStatus}</span>
          </div>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="wallet-section">
        <h2>Wallet</h2>
        {state.wallet ? (
          <div className="wallet-info">
            <p><strong>Address:</strong> {state.wallet.address}</p>
            <p><strong>Balance:</strong> {formatSingleCurrency(parseFloat(state.wallet.balance), 'TFIL')}</p>
            <p><strong>USDFC Value:</strong> {formatSingleCurrency(currencyConverter.convertTFilToUsdfc(parseFloat(state.wallet.balance)).convertedAmount.amount, 'USDFC')}</p>
            <p><strong>Provider:</strong> {state.wallet.provider}</p>
            <button onClick={() => setState(prev => ({ ...prev, wallet: null }))}>
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

      {/* Currency Exchange Widget */}
      <div className="currency-converter-widget">
        <h2>💱 Currency Exchange</h2>
        
        {/* Exchange Interface */}
        <div className="exchange-interface">
          <div className="exchange-form">
            <div className="exchange-input-group">
              <label>From</label>
              <div className="currency-input-row">
                <input
                  type="number"
                  placeholder="0.0000"
                  value={exchangeAmount}
                  onChange={(e) => handleExchangeAmountChange(e.target.value)}
                  step="0.0001"
                  min="0"
                />
                <select 
                  value={exchangeFrom} 
                  onChange={(e) => {
                    const newFrom = e.target.value as 'TFIL' | 'USDFC'
                    setExchangeFrom(newFrom)
                    if (newFrom === exchangeTo) {
                      setExchangeTo(newFrom === 'TFIL' ? 'USDFC' : 'TFIL')
                    }
                    calculateExchange(exchangeAmount, newFrom, exchangeTo)
                  }}
                >
                  <option value="TFIL">TFIL</option>
                  <option value="USDFC">USDFC</option>
                </select>
              </div>
            </div>

            <div className="exchange-swap">
              <button onClick={swapExchangeCurrencies} className="swap-btn">
                ⇅
              </button>
            </div>

            <div className="exchange-input-group">
              <label>To</label>
              <div className="currency-input-row">
                <input
                  type="number"
                  value={exchangeResult.toFixed(4)}
                  readOnly
                  className="result-input"
                />
                <select 
                  value={exchangeTo} 
                  onChange={(e) => {
                    const newTo = e.target.value as 'TFIL' | 'USDFC'
                    setExchangeTo(newTo)
                    if (newTo === exchangeFrom) {
                      setExchangeFrom(newTo === 'TFIL' ? 'USDFC' : 'TFIL')
                    }
                    calculateExchange(exchangeAmount, exchangeFrom, newTo)
                  }}
                >
                  <option value="USDFC">USDFC</option>
                  <option value="TFIL">TFIL</option>
                </select>
              </div>
            </div>
          </div>

          <div className="exchange-actions">
            <button 
              onClick={executeExchange}
              disabled={!state.wallet || !exchangeAmount || parseFloat(exchangeAmount) <= 0 || isExchanging}
              className="exchange-btn"
            >
              {isExchanging ? (
                <>
                  <span className="loading-spinner"></span>
                  Exchanging...
                </>
              ) : (
                `Exchange ${exchangeAmount || '0'} ${exchangeFrom} → ${exchangeTo}`
              )}
            </button>
            
            {!state.wallet && (
              <p className="exchange-note">Connect wallet to enable exchange</p>
            )}
            
            {exchangeRates && (
              <div className="current-rate">
                <span>Current Rate: 1 {exchangeFrom} = {
                  exchangeFrom === 'TFIL' 
                    ? exchangeRates.tfilToUsdfc?.toFixed(4) 
                    : (1 / exchangeRates.tfilToUsdfc)?.toFixed(4)
                } {exchangeTo}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Transaction History */}
        {exchangeHistory.length > 0 && (
          <div className="transaction-history">
            <h3>Recent Exchanges</h3>
            <div className="transaction-list">
              {exchangeHistory.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className="transaction-main">
                    <span className="transaction-amount">
                      {tx.fromAmount} {tx.from} → {tx.toAmount.toFixed(4)} {tx.to}
                    </span>
                    <span className="transaction-time">
                      {new Date(tx.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="transaction-rate">
                    Rate: {tx.rate.toFixed(4)} {tx.to}/{tx.from}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {exchangeRates && (
          <div className="exchange-rates-summary">
            <h3>Current Rates</h3>
            <div className="rates-grid">
              <div className="rate-item">
                <span>TFIL → USDFC</span>
                <span>{exchangeRates.tfilToUsdfc.toFixed(4)}</span>
              </div>
              <div className="rate-item">
                <span>FIL → USDFC</span>
                <span>{exchangeRates.filToUsdfc.toFixed(4)}</span>
              </div>
              <div className="rate-item">
                <span>Last Update</span>
                <span>{new Date(exchangeRates.lastUpdate).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Streams</h3>
          <div className="stat-value">{state.activeStreams}</div>
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
                const titleEl = document.getElementById('stream-title') as HTMLInputElement
                const qualityEl = document.getElementById('stream-quality') as HTMLSelectElement
                const title = titleEl?.value || 'Untitled Stream'
                const quality = qualityEl?.value || '720p60'
                startStream(title, quality)
              }}
              disabled={!state.wallet}
            >
              🔴 Start Stream
            </button>
          </div>
        ) : (
          <div className="live-controls">
            <p>🔴 You are currently live!</p>
            <button onClick={endStream}>
              ⏹️ End Stream
            </button>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>StreamWeave Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🗃️ Decentralized Storage</h3>
            <p>Your streams are stored on Filecoin network with guaranteed retrieval</p>
          </div>
          <div className="feature-card">
            <h3>💰 Direct Payments</h3>
            <p>Receive payments directly in FIL with smart contract automation</p>
          </div>
          <div className="feature-card">
            <h3>🌐 Global CDN</h3>
            <p>Low-latency streaming with IPFS-powered edge delivery</p>
          </div>
          <div className="feature-card">
            <h3>📊 Real-time Analytics</h3>
            <p>Track viewer engagement and revenue in real-time</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="status-section">
        <h2>System Status</h2>
        <div className="status-grid">
          <div className="status-item">
            <span>🌐 Network Connection</span>
            <span className={`status-${state.connectionStatus === 'connected' ? 'ok' : 'error'}`}>
              {state.connectionStatus === 'connected' ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>
          <div className="status-item">
            <span>💱 Exchange Rates</span>
            <span className={`status-${exchangeRates ? 'ok' : 'error'}`}>
              {exchangeRates ? '🟢 Live' : '🔴 Stale'}
            </span>
          </div>
          <div className="status-item">
            <span>⛓️ Filecoin Network</span>
            <span className="status-ok">🟢 Online</span>
          </div>
          <div className="status-item">
            <span>💳 Payment Channels</span>
            <span className="status-ok">🟢 Active</span>
          </div>
          <div className="status-item">
            <span>🚀 Streaming Infrastructure</span>
            <span className="status-ok">🟢 Ready</span>
          </div>
        </div>
        
        {/* Live Exchange Rates Display */}
        {exchangeRates && (
          <div className="live-rates-display">
            <h3>💱 Live Exchange Rates</h3>
            <div className="rates-display-grid">
              <div className="rate-card">
                <div className="rate-pair">TFIL → USDFC</div>
                <div className="rate-value">{exchangeRates.tfilToUsdfc?.toFixed(4) || 'Loading...'}</div>
                <div className="rate-timestamp">Updated {new Date(exchangeRates.lastUpdate).toLocaleTimeString()}</div>
              </div>
              <div className="rate-card">
                <div className="rate-pair">FIL → USDFC</div>
                <div className="rate-value">{exchangeRates.filToUsdfc?.toFixed(4) || 'Loading...'}</div>
                <div className="rate-timestamp">Updated {new Date(exchangeRates.lastUpdate).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard