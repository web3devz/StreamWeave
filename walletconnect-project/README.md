# WalletConnect Project

This project implements the WalletConnect SDK to facilitate wallet connections in a web application. It provides a structured approach to managing wallet interactions using TypeScript and React.

## Project Structure

```
walletconnect-project
├── src
│   ├── config
│   │   └── walletconnect.ts
│   ├── services
│   │   └── wallet.ts
│   ├── hooks
│   │   └── useWalletConnect.ts
│   ├── types
│   │   └── wallet.ts
│   └── utils
│       └── web3.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd walletconnect-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Import the `useWalletConnect` hook in your component:
   ```typescript
   import { useWalletConnect } from './hooks/useWalletConnect';
   ```

2. Use the hook to manage wallet connections:
   ```typescript
   const { connect, disconnect, accounts } = useWalletConnect();
   ```

3. Call `connect()` to initiate a wallet connection and `disconnect()` to disconnect.

## Configuration

The WalletConnect client is configured in `src/config/walletconnect.ts`. You can customize the initialization parameters as needed.

## License

This project is licensed under the MIT License.