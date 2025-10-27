// src/types/crypto.ts

export interface KeyPair {
    publicKey: string;
    privateKey: string;
}

export interface Signature {
    r: string;
    s: string;
    recoveryParam: number;
}