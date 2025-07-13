import React from 'react';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  const progressPercentage = (campaign.raised / campaign.goal) * 100;
  const daysLeft = Math.ceil((new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getStatusColor = () => {
    switch (campaign.status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {campaign.status === 'active' ? 'Active' : campaign.status === 'completed' ? 'Funded' : 'Cancelled'}
          </span>
          {campaign.verified && (
            <div className="bg-blue-600 text-white px-2 py-1 rounded-full flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
          {campaign.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {campaign.raised} {campaign.currency} raised
            </span>
            <span className="text-sm text-gray-500">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>Goal: {campaign.goal} {campaign.currency}</span>
            <span>{campaign.donorCount} donors</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt={campaign.creator}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">{campaign.creator}</span>
          </div>
        </div>
      </div>
    </div>
  );
};