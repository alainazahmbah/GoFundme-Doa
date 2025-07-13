import React, { useState } from 'react';
import { Search, User, Plus, Globe } from 'lucide-react';
import { useWeb3 } from '../hooks/useWeb3';

interface HeaderProps {
  onCreateCampaign: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateCampaign,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isConnected, address, formattedAddress, connectWallet, openModal } = useWeb3();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CryptoCause</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCreateCampaign}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>

            {isConnected ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={openModal}
                  className="bg-gray-100 px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {formattedAddress}
                  </span>
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};