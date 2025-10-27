// src/types/client.ts

export interface ClientOptions {
    projectId: string;
    relayUrl?: string;
    metadata?: {
        name: string;
        description?: string;
        url?: string;
        icons?: string[];
    };
}

export interface ClientEvents {
    onConnect: (uri: string) => void;
    onDisconnect: () => void;
    onSessionUpdate: (session: Session) => void;
}

export interface Session {
    id: string;
    accounts: string[];
    chainId: number;
    peerId: string;
    peerMeta: {
        name: string;
        description?: string;
        url?: string;
        icons?: string[];
    };
}

export type SessionStatus = 'pending' | 'approved' | 'rejected' | 'expired';