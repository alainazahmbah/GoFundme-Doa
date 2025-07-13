import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Calendar, 
  Users, 
  CheckCircle, 
  Globe,
  Wallet,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Campaign } from '../types';

interface CampaignDetailProps {
  campaign: Campaign;
  onBack: () => void;
  onDonate: (amount: number) => void;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({ 
  campaign, 
  onBack, 
  onDonate 
}) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);

  const progressPercentage = (campaign.raised / campaign.goal) * 100;
  const daysLeft = Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const handleDonate = () => {
    const amount = parseFloat(donationAmount);
    if (amount && amount > 0) {
      onDonate(amount);
      setShowDonateModal(false);
      setDonationAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Campaigns</span>
            </button>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.category}
                </span>
                {campaign.verified && (
                  <div className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt={campaign.creator}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{campaign.creator}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>Blockchain verified</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  This campaign utilizes smart contract technology to ensure complete transparency 
                  and automatic fund distribution. All donations are securely stored on the blockchain 
                  and can only be withdrawn when campaign milestones are met.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Join our mission to make a difference. Every contribution matters and brings us 
                  closer to achieving our goal. Your donation is secure, transparent, and will 
                  directly impact the lives of those we're trying to help.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {campaign.raised} <span className="text-lg text-gray-600">{campaign.currency}</span>
                </div>
                <div className="text-gray-600">
                  raised of {campaign.goal} {campaign.currency} goal
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{progressPercentage.toFixed(1)}% funded</span>
                  <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Campaign ended'}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{campaign.donorCount}</div>
                  <div className="text-sm text-gray-600">Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{daysLeft}</div>
                  <div className="text-sm text-gray-600">Days Left</div>
                </div>
              </div>

              {/* Donate Button */}
              <button
                onClick={() => setShowDonateModal(true)}
                disabled={campaign.status !== 'active'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {campaign.status === 'completed' ? 'Campaign Completed' : 'Donate Now'}
              </button>

              {/* Creator Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
                      alt={campaign.creator}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{campaign.creator}</div>
                      <div className="text-sm text-gray-500">Campaign Creator</div>
                    </div>
                  </div>
                  {campaign.verified && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Campaign Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Progress</span>
                  </div>
                  <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">Supporters</span>
                  </div>
                  <span className="text-sm font-medium">{campaign.donorCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Time Left</span>
                  </div>
                  <span className="text-sm font-medium">{daysLeft > 0 ? `${daysLeft} days` : 'Ended'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Blockchain</span>
                  </div>
                  <span className="text-sm font-medium">Ethereum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Make a Donation</h3>
            <p className="text-gray-600 mb-6">
              Support "{campaign.title}" with your contribution
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                placeholder="0.1"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDonateModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Donate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};