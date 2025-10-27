import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

// Check if already connected
if (!connector.connected) {
  // create new session
  connector.createSession().then(() => {
    // get uri for QR Code modal
    const uri = connector.uri;
    // display QR Code modal
    QRCodeModal.open(uri, () => {
      console.log("QR Code Modal closed");
    });
  });
}

export default connector;