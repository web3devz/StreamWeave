// Wallet Integration for Filecoin Network
// Supports MetaMask, WalletConnect, and native Filecoin wallets

import { EventEmitter } from 'events'

interface WalletInfo {
  address: string
  balance: string // in FIL
  network: 'mainnet' | 'calibration'
  provider: 'metamask' | 'walletconnect' | 'lotus' | 'glif'
}

interface TransactionRequest {
  to: string
  value: string // in FIL
  data?: string
  gasLimit?: string
  gasPrice?: string
}

interface TransactionResult {
  hash: string
  blockHeight?: number
  confirmations: number
  status: 'pending' | 'confirmed' | 'failed'
}

export class WalletManager extends EventEmitter {
  private currentWallet: WalletInfo | null = null
  private web3Provider: any = null
  private isConnecting = false
  
  constructor() {
    super()
    console.log('💰 Wallet Manager initialized')
    this.detectWallets()
  }

  // Detect available wallets
  private detectWallets() {
    const available = {
      metamask: typeof window !== 'undefined' && !!(window as any).ethereum,
      walletconnect: true, // Always available via WalletConnect SDK
      glif: true // Web wallet always available
    }
    
    console.log('🔍 Available wallets:', available)
    this.emit('walletsDetected', available)
  }

  // Connect to MetaMask
  async connectMetaMask(): Promise<WalletInfo> {
    if (this.isConnecting) {
      throw new Error('Already connecting to wallet')
    }
    
    this.isConnecting = true
    
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('MetaMask not detected')
      }
      
      const ethereum = (window as any).ethereum
      this.web3Provider = ethereum
      
      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }
      
      // Switch to Filecoin network if needed
      await this.switchToFilecoinNetwork()
      
      // Get balance
      const balance = await this.getBalance(accounts[0])
      
      const walletInfo: WalletInfo = {
        address: accounts[0],
        balance,
        network: 'mainnet',
        provider: 'metamask'
      }
      
      this.currentWallet = walletInfo
      console.log('✅ MetaMask connected:', walletInfo.address)
      this.emit('walletConnected', walletInfo)
      
      // Listen for account changes
      ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this))
      ethereum.on('chainChanged', this.handleChainChanged.bind(this))
      
      return walletInfo
      
    } finally {
      this.isConnecting = false
    }
  }

  // Connect to WalletConnect
  async connectWalletConnect(): Promise<WalletInfo> {
    if (this.isConnecting) {
      throw new Error('Already connecting to wallet')
    }
    
    this.isConnecting = true
    
    try {
      // Note: In real implementation, would use @walletconnect/client
      // For MVP, we'll simulate the connection
      
      console.log('🔗 Initiating WalletConnect...')
      
      // Simulate QR code scanning and connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40)
      const balance = await this.getBalance(mockAddress)
      
      const walletInfo: WalletInfo = {
        address: mockAddress,
        balance,
        network: 'mainnet',
        provider: 'walletconnect'
      }
      
      this.currentWallet = walletInfo
      console.log('✅ WalletConnect connected:', walletInfo.address)
      this.emit('walletConnected', walletInfo)
      
      return walletInfo
      
    } finally {
      this.isConnecting = false
    }
  }

  // Connect to Glif web wallet
  async connectGlif(): Promise<WalletInfo> {
    if (this.isConnecting) {
      throw new Error('Already connecting to wallet')
    }
    
    this.isConnecting = true
    
    try {
      console.log('🌐 Opening Glif wallet...')
      
      // In real implementation, would open Glif popup
      const glifUrl = 'https://wallet.glif.io/'
      if (typeof window !== 'undefined') {
        window.open(glifUrl, 'glif', 'width=400,height=600')
      }
      
      // Simulate connection approval
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockAddress = 'f1' + Math.random().toString(36).substr(2, 38)
      const balance = await this.getBalance(mockAddress)
      
      const walletInfo: WalletInfo = {
        address: mockAddress,
        balance,
        network: 'mainnet',
        provider: 'glif'
      }
      
      this.currentWallet = walletInfo
      console.log('✅ Glif wallet connected:', walletInfo.address)
      this.emit('walletConnected', walletInfo)
      
      return walletInfo
      
    } finally {
      this.isConnecting = false
    }
  }

  // Disconnect wallet
  async disconnect(): Promise<void> {
    if (!this.currentWallet) {
      return
    }
    
    const provider = this.currentWallet.provider
    this.currentWallet = null
    this.web3Provider = null
    
    console.log('👋 Wallet disconnected')
    this.emit('walletDisconnected', { provider })
  }

  // Get wallet balance
  async getBalance(address?: string): Promise<string> {
    const targetAddress = address || this.currentWallet?.address
    if (!targetAddress) {
      throw new Error('No address provided')
    }
    
    try {
      if (this.web3Provider) {
        // Get balance via MetaMask
        const balanceWei = await this.web3Provider.request({
          method: 'eth_getBalance',
          params: [targetAddress, 'latest']
        })
        
        // Convert from wei to FIL (assuming 1 FIL = 10^18 wei)
        const balanceFil = (parseInt(balanceWei, 16) / 1e18).toFixed(4)
        return balanceFil
      } else {
        // Simulate balance fetch for other providers
        const randomBalance = (Math.random() * 100).toFixed(4)
        return randomBalance
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
      return '0.0000'
    }
  }

  // Send transaction
  async sendTransaction(request: TransactionRequest): Promise<TransactionResult> {
    if (!this.currentWallet) {
      throw new Error('No wallet connected')
    }
    
    console.log('📤 Sending transaction:', request)
    
    try {
      if (this.web3Provider && this.currentWallet.provider === 'metamask') {
        // Send via MetaMask
        const txHash = await this.web3Provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: this.currentWallet.address,
            to: request.to,
            value: this.filToWei(request.value),
            data: request.data || '0x',
            gas: request.gasLimit || '0x5208'
          }]
        })
        
        console.log('✅ Transaction sent:', txHash)
        
        const result: TransactionResult = {
          hash: txHash,
          confirmations: 0,
          status: 'pending'
        }
        
        this.emit('transactionSent', result)
        
        // Simulate confirmation
        setTimeout(() => {
          result.status = 'confirmed'
          result.confirmations = 1
          result.blockHeight = Math.floor(Math.random() * 1000000)
          this.emit('transactionConfirmed', result)
        }, 5000)
        
        return result
        
      } else {
        // Simulate transaction for other providers
        const txHash = '0x' + Math.random().toString(16).substr(2, 64)
        
        const result: TransactionResult = {
          hash: txHash,
          confirmations: 0,
          status: 'pending'
        }
        
        this.emit('transactionSent', result)
        
        // Simulate confirmation
        setTimeout(() => {
          result.status = 'confirmed'
          result.confirmations = 1
          result.blockHeight = Math.floor(Math.random() * 1000000)
          this.emit('transactionConfirmed', result)
        }, 3000)
        
        return result
      }
    } catch (error) {
      console.error('Transaction failed:', error)
      throw error
    }
  }

  // Sign message
  async signMessage(message: string): Promise<string> {
    if (!this.currentWallet) {
      throw new Error('No wallet connected')
    }
    
    try {
      if (this.web3Provider && this.currentWallet.provider === 'metamask') {
        const signature = await this.web3Provider.request({
          method: 'personal_sign',
          params: [message, this.currentWallet.address]
        })
        
        console.log('✍️ Message signed')
        return signature
      } else {
        // Simulate signing for other providers
        const signature = '0x' + Math.random().toString(16).substr(2, 130)
        console.log('✍️ Message signed (simulated)')
        return signature
      }
    } catch (error) {
      console.error('Signing failed:', error)
      throw error
    }
  }

  // Switch to Filecoin network
  private async switchToFilecoinNetwork(): Promise<void> {
    if (!this.web3Provider) {
      return
    }
    
    try {
      // Try to switch to Filecoin mainnet
      await this.web3Provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13a' }] // 314 in hex (Filecoin mainnet)
      })
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await this.web3Provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x13a',
            chainName: 'Filecoin Mainnet',
            nativeCurrency: {
              name: 'Filecoin',
              symbol: 'FIL',
              decimals: 18
            },
            rpcUrls: ['https://api.node.glif.io/rpc/v1'],
            blockExplorerUrls: ['https://filfox.info/en']
          }]
        })
      }
    }
  }

  // Handle account changes
  private handleAccountsChanged(accounts: string[]): void {
    if (!accounts || accounts.length === 0) {
      this.disconnect()
    } else if (this.currentWallet && accounts[0] !== this.currentWallet.address) {
      this.currentWallet.address = accounts[0]
      this.getBalance().then(balance => {
        if (this.currentWallet) {
          this.currentWallet.balance = balance
          this.emit('walletUpdated', this.currentWallet)
        }
      })
    }
  }

  // Handle chain changes
  private handleChainChanged(chainId: string): void {
    console.log('🔄 Chain changed:', chainId)
    // Update network info if needed
    this.emit('chainChanged', chainId)
  }

  // Convert FIL to Wei
  private filToWei(fil: string): string {
    const filAmount = parseFloat(fil)
    const weiAmount = (filAmount * 1e18).toString()
    return '0x' + parseInt(weiAmount).toString(16)
  }

  // Get current wallet info
  getCurrentWallet(): WalletInfo | null {
    return this.currentWallet
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.currentWallet !== null
  }

  // Get supported networks
  getSupportedNetworks(): string[] {
    return ['mainnet', 'calibration']
  }

  // Estimate gas for transaction
  async estimateGas(request: TransactionRequest): Promise<string> {
    if (!this.currentWallet) {
      throw new Error('No wallet connected')
    }
    
    try {
      if (this.web3Provider) {
        const gasEstimate = await this.web3Provider.request({
          method: 'eth_estimateGas',
          params: [{
            from: this.currentWallet.address,
            to: request.to,
            value: this.filToWei(request.value),
            data: request.data || '0x'
          }]
        })
        
        return gasEstimate
      } else {
        // Return default gas estimate
        return '0x5208' // 21000 gas
      }
    } catch (error) {
      console.error('Gas estimation failed:', error)
      return '0x5208'
    }
  }
}