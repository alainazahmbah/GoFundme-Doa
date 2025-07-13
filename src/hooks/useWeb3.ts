import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { formatEther } from 'viem'

export const useWeb3 = () => {
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { open } = useAppKit()
  
  const { data: balance } = useBalance({
    address: address,
  })

  const connectWallet = () => {
    open()
  }

  const disconnectWallet = () => {
    disconnect()
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const getFormattedBalance = () => {
    if (!balance) return '0'
    return parseFloat(formatEther(balance.value)).toFixed(4)
  }

  return {
    address,
    isConnected,
    isConnecting,
    chainId,
    balance: balance?.value,
    formattedBalance: getFormattedBalance(),
    formattedAddress: address ? formatAddress(address) : '',
    connectWallet,
    disconnectWallet,
    openModal: () => open()
  }
}