// Type definitions for StreamWeave platform

export interface StreamWeaveConfig {
  network?: 'mainnet' | 'calibration'
  rpcUrl?: string
  ipfsProjectId?: string
  ipfsProjectSecret?: string
}

export interface StreamData {
  id: string
  title: string
  creator: string
  data: Buffer
  size: number
  duration: number
  format: string
}

export interface StreamSegment {
  id: string
  data: Buffer
  duration: number
  timestamp: number
  sequenceNumber: number
}

export interface ArchiveResult {
  success: boolean
  dealId: string
  ipfsHashes: string[]
  proofCids: string[]
  totalSize: number
  estimatedCost: number
}

export interface StorageDealParams {
  data: StreamSegment[]
  duration: string
  replication: number
  price: string
}

export interface StorageDeal {
  dealId: string
  provider: string
  totalCost: number
  duration: string
  status: 'pending' | 'active' | 'completed' | 'failed'
}

export interface DeliveryConfig {
  streamUrl: string
  edgeLocations: EdgeLocation[]
  adaptiveBitrates: string[]
  latencyTarget: string
  slaGuarantee: string
}

export interface EdgeLocation {
  id: string
  region: string
  latency: number
  capacity: number
}

export interface PaymentChannel {
  channelId: string
  viewerAddress: string
  creatorAddress: string
  balance: number
  ratePerMinute: number
  autoTopUp: boolean
}

export interface PaymentResult {
  success: boolean
  transactionHash: string
  amount: number
  creatorEarnings: number
  platformFee: number
  timestamp: number
}

export interface RevenueSplit {
  address: string
  percentage: number
  label: string
}

export interface DistributionResult {
  totalDistributed: number
  distributions: Distribution[]
  timestamp: number
}

export interface Distribution {
  recipient: string
  amount: number
  percentage: number
  transactionHash: string
}

export interface Creator {
  id: string
  address: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  followers: number
  totalEarnings: number
  isVerified: boolean
  createdAt: Date
}

export interface Viewer {
  id: string
  address: string
  username: string
  totalSpent: number
  subscribedCreators: string[]
  favoriteGenres: string[]
  createdAt: Date
}

export interface Stream {
  id: string
  creatorId: string
  title: string
  description?: string
  thumbnailUrl?: string
  status: 'scheduled' | 'live' | 'ended' | 'archived'
  viewerCount: number
  earnings: number
  startTime: Date
  endTime?: Date
  tags: string[]
  category: string
  isPayPerView: boolean
  subscriptionRequired: boolean
  ratePerMinute?: number
}

export interface StreamAnalytics {
  streamId: string
  peakViewers: number
  averageViewTime: number
  totalRevenue: number
  viewerRetention: {
    '1min': number
    '5min': number
    '15min': number
    '30min': number
  }
  geographicBreakdown: Record<string, number>
  deviceBreakdown: Record<string, number>
  revenueByTimeSlot: Array<{
    timestamp: number
    revenue: number
    viewers: number
  }>
}

// Event types for real-time updates
export interface StreamEvent {
  type: 'viewer_joined' | 'viewer_left' | 'payment_received' | 'stream_started' | 'stream_ended'
  streamId: string
  data: any
  timestamp: number
}

export interface PaymentEvent {
  type: 'payment_initiated' | 'payment_completed' | 'payment_failed' | 'channel_created'
  channelId: string
  amount: number
  viewer: string
  creator: string
  timestamp: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: number
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Configuration types
export interface PlatformConfig {
  maxStreamDuration: number // in hours
  maxFileSize: number // in MB
  supportedFormats: string[]
  paymentChannelMinBalance: number
  platformFeePercentage: number
  creatorMinPayout: number
}

export interface FilecoinIntegration {
  storageProviders: string[]
  dealDuration: string
  replicationFactor: number
  retrievalTimeout: number
  gasLimit: number
  gasPriceMultiplier: number
}
