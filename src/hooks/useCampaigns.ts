import { useState, useEffect } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { Campaign } from '../types'
import { getIPFSUrl } from '../config/ipfs'

// Contract addresses - replace with your deployed contract addresses
const CAMPAIGN_FACTORY_ADDRESS = process.env.VITE_CAMPAIGN_FACTORY_ADDRESS as `0x${string}`

const CAMPAIGN_FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_title", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string", "name": "_imageHash", "type": "string"},
      {"internalType": "uint256", "name": "_goal", "type": "uint256"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"},
      {"internalType": "string", "name": "_category", "type": "string"}
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDeployedCampaigns",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

const CAMPAIGN_ABI = [
  {
    "inputs": [],
    "name": "getCampaignDetails",
    "outputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "imageHash", "type": "string"},
      {"internalType": "uint256", "name": "goal", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "string", "name": "category", "type": "string"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "amountRaised", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "goalReached", "type": "bool"},
      {"internalType": "uint256", "name": "donorCount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  const { writeContract, data: hash, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  // Get deployed campaigns
  const { data: campaignAddresses, refetch: refetchCampaigns } = useReadContract({
    address: CAMPAIGN_FACTORY_ADDRESS,
    abi: CAMPAIGN_FACTORY_ABI,
    functionName: 'getDeployedCampaigns',
  })

  const createCampaign = async (campaignData: {
    title: string
    description: string
    imageHash: string
    goal: string
    deadline: string
    category: string
  }) => {
    try {
      const goalInWei = parseEther(campaignData.goal)
      const deadlineTimestamp = Math.floor(new Date(campaignData.deadline).getTime() / 1000)

      writeContract({
        address: CAMPAIGN_FACTORY_ADDRESS,
        abi: CAMPAIGN_FACTORY_ABI,
        functionName: 'createCampaign',
        args: [
          campaignData.title,
          campaignData.description,
          campaignData.imageHash,
          goalInWei,
          BigInt(deadlineTimestamp),
          campaignData.category
        ]
      })
    } catch (error) {
      console.error('Error creating campaign:', error)
      throw error
    }
  }

  const donateToCampaign = async (campaignAddress: `0x${string}`, amount: string) => {
    try {
      const amountInWei = parseEther(amount)
      
      writeContract({
        address: campaignAddress,
        abi: CAMPAIGN_ABI,
        functionName: 'donate',
        value: amountInWei
      })
    } catch (error) {
      console.error('Error donating to campaign:', error)
      throw error
    }
  }

  // Fetch campaign details for each address
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!campaignAddresses || campaignAddresses.length === 0) {
        setLoading(false)
        return
      }

      try {
        const campaignPromises = campaignAddresses.map(async (address) => {
          // This would need to be implemented with multiple contract calls
          // For now, we'll use a placeholder
          return null
        })

        const campaignDetails = await Promise.all(campaignPromises)
        // Process and set campaigns
        setLoading(false)
      } catch (error) {
        console.error('Error fetching campaign details:', error)
        setLoading(false)
      }
    }

    fetchCampaignDetails()
  }, [campaignAddresses])

  return {
    campaigns,
    loading,
    createCampaign,
    donateToCampaign,
    isCreating: isPending,
    isConfirming,
    isConfirmed,
    refetchCampaigns
  }
}