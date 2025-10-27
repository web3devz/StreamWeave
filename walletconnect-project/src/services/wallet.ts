import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

export class WalletService {
    private connector: WalletConnect | null = null;

    constructor() {
        this.connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: QRCodeModal,
        });
    }

    public async connect() {
        if (!this.connector || !this.connector.connected) {
            // create new session
            await this.connector.createSession();
        }

        const { accounts } = this.connector;
        return accounts;
    }

    public async disconnect() {
        if (this.connector) {
            await this.connector.killSession();
        }
    }

    public getAccounts() {
        return this.connector ? this.connector.accounts : [];
    }
}