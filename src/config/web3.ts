import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, polygon, sepolia } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.VITE_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID'

if (!projectId) {
  throw new Error('VITE_REOWN_PROJECT_ID is not set')
}

// Create a metadata object
const metadata = {
  name: 'CryptoCause',
  description: 'Decentralized Fundraising Platform',
  url: 'https://cryptocause.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum, polygon, sepolia],
  projectId,
  ssr: false
})

// Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum, polygon, sepolia],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: false,
    emailShowWallets: true
  }
})

export const queryClient = new QueryClient()

export const config = wagmiAdapter.wagmiConfig