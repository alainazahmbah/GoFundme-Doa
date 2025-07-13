# CryptoCause - Web3 GoFundMe Platform

A decentralized fundraising platform built on Ethereum with real Web3 integration, IPFS storage, and Reown AppKit wallet connection.

## Features

- **Real Web3 Integration**: Connect with MetaMask, WalletConnect, and other wallets via Reown AppKit
- **Smart Contracts**: Secure, transparent campaign management on Ethereum
- **IPFS Storage**: Decentralized image and metadata storage
- **Multi-Chain Support**: Ethereum, Polygon, Arbitrum support
- **Real Donations**: Actual ETH transactions with smart contract security
- **Campaign Management**: Create, fund, and manage campaigns on-chain

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required variables:
- `VITE_REOWN_PROJECT_ID`: Get from [Reown Cloud](https://cloud.reown.com)
- `VITE_IPFS_AUTH`: IPFS credentials (Infura, Pinata, etc.)
- `VITE_CAMPAIGN_FACTORY_ADDRESS`: Deployed contract address

### 2. Smart Contract Deployment

Deploy the smart contracts to your chosen network:

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy contracts
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. IPFS Setup

Choose an IPFS provider:

**Option A: Infura IPFS**
1. Sign up at [Infura](https://infura.io)
2. Create an IPFS project
3. Get your Project ID and Secret
4. Encode as Base64: `echo -n "PROJECT_ID:SECRET" | base64`
5. Add to `.env`: `VITE_IPFS_AUTH=Basic_YOUR_BASE64_STRING`

**Option B: Pinata**
1. Sign up at [Pinata](https://pinata.cloud)
2. Get API keys
3. Update `src/config/ipfs.ts` with Pinata configuration

### 4. Reown AppKit Setup

1. Go to [Reown Cloud](https://cloud.reown.com)
2. Create a new project
3. Copy the Project ID to your `.env` file
4. Configure your domain in the project settings

### 5. Install Dependencies

```bash
npm install
```

### 6. Start Development Server

```bash
npm run dev
```

## Smart Contract Architecture

### CampaignFactory.sol
- Creates new campaign contracts
- Tracks all deployed campaigns
- Emits events for campaign creation

### Campaign.sol
- Individual campaign logic
- Handles donations and withdrawals
- Implements refund mechanism
- Milestone-based fund release

## Key Features Implemented

### Real Wallet Connection
- Reown AppKit integration
- Support for 300+ wallets
- Network switching
- Balance display

### IPFS Integration
- Decentralized image storage
- Metadata storage
- Drag & drop upload
- Progress indicators

### Smart Contract Integration
- Campaign creation on-chain
- Real ETH donations
- Transparent fund tracking
- Automatic refunds

### Security Features
- Smart contract validation
- IPFS content addressing
- Wallet signature verification
- Network validation

## Development Workflow

1. **Local Development**: Use Hardhat local network
2. **Testing**: Deploy to Sepolia testnet
3. **Production**: Deploy to Ethereum mainnet

## Deployment Checklist

- [ ] Smart contracts deployed and verified
- [ ] IPFS provider configured
- [ ] Reown project created
- [ ] Environment variables set
- [ ] Domain configured in Reown
- [ ] Network settings verified

## Security Considerations

- Smart contracts should be audited before mainnet deployment
- Use multi-signature wallets for contract ownership
- Implement proper access controls
- Regular security updates for dependencies
- Monitor for unusual transaction patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details