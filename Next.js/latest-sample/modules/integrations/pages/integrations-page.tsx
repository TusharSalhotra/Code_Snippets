'use client';

import { useState } from 'react';
import { Plug, Check, Settings as SettingsIcon, ExternalLink } from 'lucide-react';
import { SearchBar, Button } from '@/src/shared/components';

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const integrations = [
    {
      id: 1,
      name: 'Slack',
      emoji: '💬',
      description: 'Send notifications and updates to Slack channels',
      category: 'communication',
      connected: true,
      popular: true
    },
    {
      id: 2,
      name: 'Workday',
      emoji: '👥',
      description: 'Sync employee data and HR records',
      category: 'hr',
      connected: true,
      popular: false
    },
    {
      id: 3,
      name: 'BambooHR',
      emoji: '🌿',
      description: 'Import employee information and org structure',
      category: 'hr',
      connected: false,
      popular: true
    },
    {
      id: 4,
      name: 'Microsoft Teams',
      emoji: '🎯',
      description: 'Collaborate and receive notifications in Teams',
      category: 'communication',
      connected: false,
      popular: false
    },
    {
      id: 5,
      name: 'Zoom',
      emoji: '📹',
      description: 'Schedule and conduct evaluation meetings',
      category: 'communication',
      connected: false,
      popular: false
    },
    {
      id: 6,
      name: 'Google Workspace',
      emoji: '📧',
      description: 'Sync with Google Calendar and Drive',
      category: 'productivity',
      connected: true,
      popular: false
    },
    {
      id: 7,
      name: 'Jira',
      emoji: '📊',
      description: 'Track performance against project metrics',
      category: 'productivity',
      connected: false,
      popular: false
    },
    {
      id: 8,
      name: 'Tableau',
      emoji: '📈',
      description: 'Visualize evaluation data in Tableau',
      category: 'analytics',
      connected: false,
      popular: false
    },
    {
      id: 9,
      name: 'Power BI',
      emoji: '💡',
      description: 'Connect to Power BI for advanced analytics',
      category: 'analytics',
      connected: false,
      popular: false
    },
    {
      id: 10,
      name: 'AWS S3',
      emoji: '☁️',
      description: 'Store and backup evaluation data',
      category: 'storage',
      connected: false,
      popular: false
    }
  ];

  const connectedCount = integrations.filter(i => i.connected).length;
  const categories = 5;

  const filteredIntegrations = activeTab === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === activeTab);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Integrations</h1>
            <p className="text-[#B0B6C1]">Connect Sample with your favorite tools</p>
          </div>
          <Button variant="primary">
            <ExternalLink className="w-4 h-4" />
            Request Integration
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                <Plug className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Available Integrations</p>
                <p className="text-white text-2xl">{integrations.length}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Connected</p>
                <p className="text-white text-2xl">{connectedCount}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0066CC] flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Categories</p>
                <p className="text-white text-2xl">{categories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <SearchBar placeholder="Search integrations..." />

        {/* Tabs */}
        <div className="flex flex-wrap gap-[3px] p-[3px] bg-white/5 border border-white/10 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                : 'text-white hover:bg-white/5'
            }`}
          >
            All Integrations
          </button>
          <button
            onClick={() => setActiveTab('hr')}
            className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
              activeTab === 'hr'
                ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                : 'text-white hover:bg-white/5'
            }`}
          >
            HR Systems
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
              activeTab === 'communication'
                ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                : 'text-white hover:bg-white/5'
            }`}
          >
            Communication
          </button>
          <button
            onClick={() => setActiveTab('productivity')}
            className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
              activeTab === 'productivity'
                ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                : 'text-white hover:bg-white/5'
            }`}
          >
            Productivity
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                : 'text-white hover:bg-white/5'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
              activeTab === 'storage'
                ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                : 'text-white hover:bg-white/5'
            }`}
          >
            Storage
          </button>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className={`p-6 transition-all ${
                integration.connected ? 'ring-2 ring-[#00F5C6]' : ''
              }`}
            >
              <div className="p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                      {integration.emoji}
                    </div>
                    <div>
                      <h3 className="text-white mb-1">{integration.name}</h3>
                      {integration.popular && (
                        <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-transparent bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  {integration.connected && (
                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 border-green-500/30">
                      Connected
                    </span>
                  )}
                </div>
                <p className="text-[#B0B6C1] text-sm mb-4 min-h-[40px]">
                  {integration.description}
                </p>
                <div className="flex gap-2">
                  {integration.connected ? (
                    <>
                      <Button variant="primary" fullWidth>
                        Disconnect
                      </Button>
                      <button className="inline-flex items-center justify-center size-9 rounded-md border border-white/10 text-white hover:bg-white/5 transition-all">
                        <SettingsIcon className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <Button variant="secondary" fullWidth className="flex-1">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
