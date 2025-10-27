// src/methods/session.ts

export interface Session {
    id: string;
    topic: string;
    peer: string;
    expiry: number;
    status: SessionStatus;
}

export enum SessionStatus {
    Active = "active",
    Inactive = "inactive",
    Terminated = "terminated",
}

export function createSession(topic: string, peer: string, expiry: number): Session {
    return {
        id: generateSessionId(),
        topic,
        peer,
        expiry,
        status: SessionStatus.Active,
    };
}

export function updateSession(session: Session, newExpiry: number): Session {
    return {
        ...session,
        expiry: newExpiry,
    };
}

export function terminateSession(session: Session): Session {
    return {
        ...session,
        status: SessionStatus.Terminated,
    };
}

function generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9);
}