// Global TypeScript declarations for the StreamWeave project

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

// Global window extensions
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
    Buffer: typeof Buffer
    process: typeof process
  }
  
  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      REACT_APP_FILECOIN_NETWORK?: 'mainnet' | 'calibration'
      REACT_APP_IPFS_PROJECT_ID?: string
      REACT_APP_IPFS_PROJECT_SECRET?: string
      REACT_APP_LOTUS_RPC_URL?: string
      REACT_APP_GLIF_API_URL?: string
    }
  }
  
  // WebRTC types for streaming
  interface RTCPeerConnection {
    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>
    createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit>
    setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>
    setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>
    addIceCandidate(candidate: RTCIceCandidate): Promise<void>
    getStats(): Promise<RTCStatsReport>
    close(): void
    connectionState: RTCPeerConnectionState
    iceConnectionState: RTCIceConnectionState
    signalingState: RTCSignalingState
  }
  
  // IPFS types
  interface IPFSHTTPClient {
    add(data: any, options?: any): Promise<{ path: string; cid: any; size: number }>
    pin: {
      add(cid: string): Promise<void>
      rm(cid: string): Promise<void>
    }
    files: {
      write(path: string, content: any, options?: any): Promise<void>
      read(path: string): AsyncIterable<Uint8Array>
    }
  }
  
  // Media Stream types for live streaming
  interface MediaStream {
    getTracks(): MediaStreamTrack[]
    getVideoTracks(): MediaStreamTrack[]
    getAudioTracks(): MediaStreamTrack[]
    addTrack(track: MediaStreamTrack): void
    removeTrack(track: MediaStreamTrack): void
  }
  
  interface MediaStreamTrack {
    kind: 'audio' | 'video'
    enabled: boolean
    readyState: 'live' | 'ended'
    stop(): void
  }
  
  // HLS.js types
  interface Hls {
    loadSource(url: string): void
    attachMedia(media: HTMLVideoElement): void
    on(event: string, callback: (...args: any[]) => void): void
    destroy(): void
  }
  
  // Service Worker types
  interface ServiceWorkerRegistration {
    update(): Promise<void>
    unregister(): Promise<boolean>
  }
  
  // Notification API
  interface NotificationOptions {
    body?: string
    icon?: string
    badge?: string
    tag?: string
    data?: any
  }
  
  // File System Access API (for video upload)
  interface FileSystemFileHandle {
    getFile(): Promise<File>
    createWritable(): Promise<FileSystemWritableFileStream>
  }
  
  interface FileSystemWritableFileStream extends WritableStream {
    write(data: BufferSource | Blob | string): Promise<void>
    close(): Promise<void>
  }
}

// Module augmentations for third-party libraries
declare module 'ipfs-http-client' {
  export function create(options?: any): IPFSHTTPClient
  export default create
}

declare module 'hls.js' {
  class Hls {
    static isSupported(): boolean
    constructor(config?: any)
    loadSource(url: string): void
    attachMedia(media: HTMLVideoElement): void
    on(event: string, callback: (...args: any[]) => void): void
    destroy(): void
  }
  export default Hls
}

declare module 'video.js' {
  interface VideoJsPlayer {
    ready(callback: () => void): void
    play(): Promise<void>
    pause(): void
    dispose(): void
  }
  
  function videojs(element: string | Element, options?: any): VideoJsPlayer
  export default videojs
}

// Custom utility types for StreamWeave
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

export type NonNullable<T> = T extends null | undefined ? never : T

// Event emitter types
export interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): this
  off(event: string, listener: (...args: any[]) => void): this
  emit(event: string, ...args: any[]): boolean
  removeAllListeners(event?: string): this
}

// Crypto and blockchain types
export type Address = `0x${string}`
export type Hash = `0x${string}`
export type Signature = `0x${string}`

export interface TransactionReceipt {
  blockHash: Hash
  blockNumber: number
  contractAddress?: Address
  gasUsed: bigint
  status: 'success' | 'reverted'
  transactionHash: Hash
  transactionIndex: number
}

// StreamWeave specific types
export interface StreamWeaveEnvironment {
  NETWORK: 'mainnet' | 'calibration' | 'development'
  IPFS_GATEWAY: string
  LOTUS_RPC_URL: string
  CONTRACT_ADDRESS?: Address
  DEBUG: boolean
}

export {};