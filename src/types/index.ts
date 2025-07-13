export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  goal: number;
  raised: number;
  currency: string;
  creator: string;
  creatorAddress: string;
  category: string;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  verified: boolean;
  donorCount: number;
  createdAt: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  amount: number;
  currency: string;
  donor: string;
  donorAddress: string;
  timestamp: string;
  txHash: string;
}

export interface User {
  address: string;
  name: string;
  avatar: string;
  verified: boolean;
  totalDonated: number;
  totalRaised: number;
  campaignsCreated: number;
}