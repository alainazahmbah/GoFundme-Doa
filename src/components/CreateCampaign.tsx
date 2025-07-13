import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, Tag, FileText, Loader2 } from 'lucide-react';
import { categories } from '../data/mockData';
import { IPFSImageUpload } from './IPFSImageUpload';
import { uploadJSONToIPFS } from '../config/ipfs';
import { useCampaigns } from '../hooks/useCampaigns';
import { useWeb3 } from '../hooks/useWeb3';

interface CreateCampaignProps {
  onBack: () => void;
}

export const CreateCampaign: React.FC<CreateCampaignProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    category: '',
    deadline: '',
    imageHash: '',
  });
  
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createCampaign, isCreating, isConfirming, isConfirmed } = useCampaigns();
  const { isConnected, connectWallet } = useWeb3();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      connectWallet();
      return;
    }
    
    if (!formData.imageHash) {
      alert('Please upload an image for your campaign');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload campaign metadata to IPFS
      const metadata = {
        title: formData.title,
        description: formData.description,
        image: formData.imageHash,
        category: formData.category,
        createdAt: new Date().toISOString()
      };
      
      const metadataResult = await uploadJSONToIPFS(metadata);
      
      // Create campaign on blockchain
      await createCampaign({
        title: formData.title,
        description: formData.description,
        imageHash: metadataResult.hash,
        goal: formData.goal,
        deadline: formData.deadline,
        category: formData.category
      });
      
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (hash: string, url: string) => {
    setFormData(prev => ({ ...prev, imageHash: hash }));
    setImageUrl(url);
  };

  // Redirect back when campaign is confirmed
  React.useEffect(() => {
    if (isConfirmed) {
      onBack();
    }
  }, [isConfirmed, onBack]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Campaign</h1>
              <p className="text-gray-600">
                Launch your fundraising campaign on the blockchain with complete transparency
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Title */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Campaign Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a compelling title for your campaign"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Campaign Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell your story. Explain why this campaign matters and how the funds will be used."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Image URL */}
              <IPFSImageUpload
                onImageUploaded={handleImageUploaded}
                currentImageUrl={imageUrl}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Funding Goal */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Funding Goal (ETH)</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    placeholder="10.0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4" />
                    <span>Category</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadline */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Campaign Deadline</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Smart Contract Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Blockchain Security</h3>
                <p className="text-sm text-blue-700">
                  Your campaign will be deployed as a smart contract on the Ethereum blockchain. 
                  This ensures complete transparency, automatic fund distribution, and protection 
                  against fraud. All transactions are publicly verifiable.
                </p>
              </div>

              {/* Transaction Status */}
              {(isCreating || isConfirming) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
                    <span className="text-yellow-800">{isCreating ? 'Creating campaign...' : 'Confirming transaction...'}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isCreating || isConfirming || !isConnected}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                >
                  {!isConnected ? 'Connect Wallet' : 
                   isSubmitting || isCreating || isConfirming ? 'Creating...' : 
                   'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};