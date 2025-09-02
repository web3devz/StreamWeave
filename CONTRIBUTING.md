# Contributing to StreamWeave

Thank you for your interest in contributing to StreamWeave! This document provides guidelines for contributing to our Filecoin-powered creator platform.

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic understanding of React, TypeScript, and blockchain concepts

### Local Development
1. **Clone the repository**
   ```bash
   git clone https://github.com/sambitsargam/StreamWeave.git
   cd StreamWeave
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables
```bash
# Filecoin Configuration
FILECOIN_RPC_URL=https://api.node.glif.io/rpc/v1
LOTUS_ENDPOINT=wss://api.node.glif.io/rpc/v1
LOTUS_TOKEN=your_lotus_token

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/streamweave

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Storage
IPFS_ENDPOINT=https://ipfs.infura.io:5001
WEB3_STORAGE_TOKEN=your_web3_storage_token
```

## Project Structure

```
StreamWeave/
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── api/            # API routes
│   │   ├── creator/        # Creator dashboard pages
│   │   └── viewer/         # Viewer interface pages
│   ├── components/         # Reusable React components
│   │   ├── ui/            # Basic UI components
│   │   ├── creator/       # Creator-specific components
│   │   └── viewer/        # Viewer-specific components
│   ├── core/              # StreamWeave core logic
│   │   ├── filecoin/      # Filecoin integration
│   │   ├── streaming/     # Streaming infrastructure
│   │   └── payments/      # Payment processing
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── docs/                  # Documentation
├── contracts/             # Smart contracts
└── tests/                 # Test files
```

## Contributing Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat(payments): add Filecoin Pay integration
fix(streaming): resolve CDN latency issues
docs(readme): update installation instructions
test(core): add unit tests for storage functions
```

### Pull Request Process
1. **Fork the repository** and create a feature branch
2. **Make your changes** following our coding standards
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Submit a pull request** with a clear description

### Testing
We use Jest and React Testing Library for testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Filecoin Integration Guidelines

### WarmStorage Integration
When working with storage features:
- Always verify data integrity after upload
- Implement proper error handling for storage failures
- Use content addressing (IPFS CIDs) for referencing stored data
- Monitor storage deal status and handle renewals

```typescript
// Example: Proper storage integration
const archiveContent = async (content: StreamData) => {
  try {
    // 1. Upload to IPFS first
    const ipfsResult = await ipfs.add(content.data)
    
    // 2. Create Filecoin storage deal
    const deal = await lotus.createStorageDeal({
      data: ipfsResult.cid,
      duration: '2 years',
      price: '0.0001 FIL/GB/month'
    })
    
    // 3. Monitor deal status
    await monitorDealStatus(deal.proposalCid)
    
    return { success: true, cid: ipfsResult.cid, dealId: deal.proposalCid }
  } catch (error) {
    console.error('Storage failed:', error)
    throw new StorageError('Failed to archive content', error)
  }
}
```

### Payment Integration
For payment-related features:
- Use payment channels for micropayments
- Implement proper gas estimation
- Handle transaction failures gracefully
- Ensure payment security and validation

```typescript
// Example: Secure payment processing
const processViewerPayment = async (
  channelId: string, 
  watchTime: number
) => {
  // Validate payment parameters
  if (watchTime <= 0) throw new Error('Invalid watch time')
  
  // Calculate payment amount
  const amount = watchTime * RATE_PER_MINUTE
  
  // Process with error handling
  try {
    const result = await filecoinPay.processPayment({
      channelId,
      amount,
      recipient: creatorAddress
    })
    
    // Distribute revenue (97% to creator, 3% platform)
    await distributeRevenue(result.transactionHash, amount)
    
    return result
  } catch (error) {
    // Log error and handle gracefully
    logger.error('Payment processing failed', { channelId, amount, error })
    throw new PaymentError('Payment processing failed', error)
  }
}
```

## Feature Development

### Creator Features
When developing creator-focused features:
- Prioritize user experience and simplicity
- Provide clear analytics and insights
- Ensure real-time updates for earnings and metrics
- Support customization and branding options

### Viewer Features
For viewer-facing functionality:
- Optimize for low latency and high quality
- Make payment flows seamless and intuitive
- Support multiple payment methods and currencies
- Provide clear value proposition for paid content

### Platform Features
For platform-level improvements:
- Consider scalability and performance impact
- Maintain backward compatibility
- Document breaking changes clearly
- Include migration guides for major updates

## Documentation

### Code Documentation
- Add JSDoc comments for all public APIs
- Include usage examples for complex functions
- Document configuration options and parameters
- Explain business logic and design decisions

### User Documentation
- Write clear, step-by-step guides
- Include screenshots and videos where helpful
- Provide troubleshooting sections
- Keep documentation up-to-date with code changes

## Bug Reports

When reporting bugs, please include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, browser, Node.js version)
- **Console logs and error messages**
- **Screenshots or videos** if applicable

Use our bug report template:

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS 13.0]
- Browser: [e.g., Chrome 108]
- Node.js: [e.g., 18.12.0]
- StreamWeave version: [e.g., 0.1.0]

## Additional Context
Any other relevant information
```

## Feature Requests

For new feature requests:
- **Describe the problem** the feature would solve
- **Explain the proposed solution** in detail
- **Consider alternative approaches**
- **Estimate the impact** on users and platform
- **Provide use cases and examples**

## Community

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community chat
- **Discord**: Real-time community discussions
- **Twitter**: Updates and announcements

### Code of Conduct
We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Recognition
Contributors who make significant improvements will be:
- Listed in our CONTRIBUTORS.md file
- Mentioned in release notes
- Invited to join our community advisory board
- Eligible for community rewards and recognition

## License

By contributing to StreamWeave, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Feel free to reach out to our team or open a discussion on GitHub. We're here to help and appreciate your contributions to building the future of creator-owned platforms!

Happy coding! 🚀
