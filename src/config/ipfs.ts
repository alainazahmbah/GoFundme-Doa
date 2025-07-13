import { create } from 'ipfs-http-client'

// IPFS configuration
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/'
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'

// Create IPFS client - you can use Infura, Pinata, or your own node
export const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: process.env.VITE_IPFS_AUTH || ''
  }
})

export interface IPFSUploadResult {
  hash: string
  url: string
}

export const uploadToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  try {
    const added = await ipfs.add(file, {
      progress: (prog) => console.log(`Uploading: ${prog} bytes`)
    })
    
    const hash = added.cid.toString()
    const url = `${IPFS_GATEWAY}${hash}`
    
    return { hash, url }
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw new Error('Failed to upload to IPFS')
  }
}

export const uploadJSONToIPFS = async (data: any): Promise<IPFSUploadResult> => {
  try {
    const jsonString = JSON.stringify(data)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const file = new File([blob], 'metadata.json', { type: 'application/json' })
    
    return await uploadToIPFS(file)
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error)
    throw new Error('Failed to upload JSON to IPFS')
  }
}

export const getIPFSUrl = (hash: string): string => {
  return `${IPFS_GATEWAY}${hash}`
}

export const getPinataUrl = (hash: string): string => {
  return `${PINATA_GATEWAY}${hash}`
}