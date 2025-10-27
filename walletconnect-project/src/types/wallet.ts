// src/types/wallet.ts

export interface WalletConnectOptions {
    bridge: string; // Bridge server URL
    qrcodeModal: any; // QR code modal implementation
    chainId: number; // Chain ID for the wallet connection
}

export interface WalletAccount {
    address: string; // Wallet address
    balance: string; // Wallet balance in the specified currency
}