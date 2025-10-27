import { generateKeyPair, signMessage } from '../src/core/crypto';

describe('Crypto Utility Functions', () => {
    test('generateKeyPair should return a valid key pair', () => {
        const keyPair = generateKeyPair();
        expect(keyPair).toHaveProperty('privateKey');
        expect(keyPair).toHaveProperty('publicKey');
    });

    test('signMessage should return a valid signature', () => {
        const keyPair = generateKeyPair();
        const message = 'Test message';
        const signature = signMessage(message, keyPair.privateKey);
        expect(signature).toBeDefined();
    });

    test('signMessage should throw an error for invalid private key', () => {
        const invalidPrivateKey = 'invalid_key';
        const message = 'Test message';
        expect(() => signMessage(message, invalidPrivateKey)).toThrow();
    });
});