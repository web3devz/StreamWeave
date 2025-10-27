# WalletConnect SDK

## Overview

The WalletConnect SDK provides a simple and secure way to connect decentralized applications (dApps) to mobile wallets. It enables users to interact with dApps using their wallets without compromising their private keys.

## Installation

To install the WalletConnect SDK, you can use npm or yarn:

```bash
npm install @walletconnect/client
```

or

```bash
yarn add @walletconnect/client
```

## Usage

Here's a basic example of how to use the WalletConnect SDK:

```typescript
import { Client } from "@walletconnect/client";

// Create a new client instance
const connector = new Client({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal, // Optional
});

// Connect to a wallet
connector.connect().then((uri) => {
  console.log(`Connect to ${uri}`);
});

// Subscribe to connection events
connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }
  // Handle successful connection
});

// Disconnect from the wallet
connector.killSession();
```

## API Reference

For detailed information about the SDK's API, please refer to the documentation available in the `docs` directory.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for more information on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.