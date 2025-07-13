import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CampaignGrid } from './components/CampaignGrid';
import { CampaignDetail } from './components/CampaignDetail';
import { CreateCampaign } from './components/CreateCampaign';
import { mockCampaigns, mockUser } from './data/mockData';
import { useWeb3 } from './hooks/useWeb3';
import { Campaign } from './types';

type View = 'home' | 'campaigns' | 'campaign-detail' | 'create-campaign';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const { isConnected, connectWallet } = useWeb3();

  const handleCreateCampaign = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }
    setCurrentView('create-campaign');
  };

  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCurrentView('campaign-detail');
  };

  const handleBack = () => {
    if (currentView === 'campaign-detail') {
      setCurrentView('campaigns');
    } else {
      setCurrentView('home');
    }
    setSelectedCampaign(null);
  };

  const handleDonate = (amount: number) => {
    if (selectedCampaign) {
      // Update campaign with new donation
      const updatedCampaigns = campaigns.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, raised: c.raised + amount, donorCount: c.donorCount + 1 }
          : c
      );
      setCampaigns(updatedCampaigns);
      
      // Update selected campaign
      const updatedCampaign = updatedCampaigns.find(c => c.id === selectedCampaign.id);
      if (updatedCampaign) {
        setSelectedCampaign(updatedCampaign);
      }
    }
  };

  const handleGetStarted = () => {
    setCurrentView('campaigns');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'create-campaign' && (
        <Header
          onCreateCampaign={handleCreateCampaign}
        />
      )}

      {currentView === 'home' && (
        <>
          <Hero onGetStarted={handleGetStarted} />
          <CampaignGrid campaigns={campaigns.slice(0, 6)} onCampaignClick={handleCampaignClick} />
        </>
      )}

      {currentView === 'campaigns' && (
        <CampaignGrid campaigns={campaigns} onCampaignClick={handleCampaignClick} />
      )}

      {currentView === 'campaign-detail' && selectedCampaign && (
        <CampaignDetail
          campaign={selectedCampaign}
          onBack={handleBack}
          onDonate={handleDonate}
        />
      )}

      {currentView === 'create-campaign' && (
        <CreateCampaign
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;