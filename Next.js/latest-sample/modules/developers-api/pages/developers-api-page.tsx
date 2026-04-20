'use client';

import { useState } from 'react';
import { Key, Zap, Code, ExternalLink as ExternalLinkIcon, BookOpen, Plus, Eye, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/src/shared/components';
import { CreateAPIKeyModal } from '../components/create-api-key-modal';
import type { CreateAPIKeyInput } from '../types';

export default function DevelopersApiPage() {
  const [activeTab, setActiveTab] = useState('keys');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const apiKeys = [
    {
      id: 1,
      name: 'Production API',
      key: 'sk_live_••••••••••••••••••••••••••',
      permissions: 'read-write',
      created: '2024-01-15',
      lastUsed: '2024-11-10'
    },
    {
      id: 2,
      name: 'Development API',
      key: 'sk_test_••••••••••••••••••••••••••',
      permissions: 'read-only',
      created: '2024-03-20',
      lastUsed: '2024-11-09'
    }
  ];

  const endpoints = [
    { method: 'GET', path: '/api/v1/evaluations', description: 'List all evaluations' },
    { method: 'POST', path: '/api/v1/evaluations', description: 'Create a new evaluation' },
    { method: 'GET', path: '/api/v1/evaluations/{id}', description: 'Get evaluation details' },
    { method: 'PUT', path: '/api/v1/evaluations/{id}', description: 'Update an evaluation' },
    { method: 'DELETE', path: '/api/v1/evaluations/{id}', description: 'Delete an evaluation' },
    { method: 'GET', path: '/api/v1/users', description: 'List all users' },
    { method: 'GET', path: '/api/v1/kpis', description: 'Get KPI data' },
    { method: 'POST', path: '/api/v1/webhooks', description: 'Register a webhook' }
  ];

  const webhooks = [
    {
      id: 1,
      name: 'Assessment Complete',
      url: 'https://api.example.com/webhooks/assessment',
      events: ['assessment.completed', 'assessment.updated'],
      status: 'active'
    },
    {
      id: 2,
      name: 'KPI Alert',
      url: 'https://api.example.com/webhooks/kpi',
      events: ['kpi.threshold_reached'],
      status: 'active'
    }
  ];

  const handleCreateAPIKey = (data: CreateAPIKeyInput) => {
    console.log('Creating API key:', data);
    // TODO: Add API key creation logic here
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Developers API</h1>
            <p className="text-[#B0B6C1]">Integrate Sample into your applications</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center justify-center gap-2 h-9 px-4 py-2 rounded-md text-sm font-medium border border-white/10 text-white hover:bg-white/5 transition-all">
              <BookOpen className="w-4 h-4" />
              Documentation
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 h-9 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create API Key
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">API Keys</p>
                <p className="text-white text-2xl">{apiKeys.length}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0066CC] flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">API Calls (Today)</p>
                <p className="text-white text-2xl">1.2K</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Endpoints</p>
                <p className="text-white text-2xl">{endpoints.length}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6]/30 to-[#00AEEF]/30 flex items-center justify-center">
                <ExternalLinkIcon className="w-6 h-6 text-[#00F5C6]" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Webhooks</p>
                <p className="text-white text-2xl">{webhooks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-2 space-y-6">
          <div className="flex gap-[3px] p-[3px] bg-white/5 border border-white/10 rounded-xl w-fit h-9">
            <button
              onClick={() => setActiveTab('keys')}
              className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
                activeTab === 'keys'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('endpoints')}
              className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
                activeTab === 'endpoints'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              Endpoints
            </button>
            <button
              onClick={() => setActiveTab('webhooks')}
              className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
                activeTab === 'webhooks'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              Webhooks
            </button>
            <button
              onClick={() => setActiveTab('quickstart')}
              className={`inline-flex items-center justify-center gap-1.5 h-[calc(100%-1px)] px-2 py-1 text-sm font-medium whitespace-nowrap rounded-xl border border-transparent transition-all ${
                activeTab === 'quickstart'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:bg-white/5'
              }`}
            >
              Quick Start
            </button>
          </div>

          {/* API Keys Tab */}
          {activeTab === 'keys' && (
            <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <h3 className="text-white mb-4">Your API Keys</h3>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 rounded-lg border border-white/10 bg-white/5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white mb-1">{apiKey.name}</h4>
                        <div className="flex gap-2">
                          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-[#00F5C6]/30 text-[#00F5C6]">
                            {apiKey.permissions === 'read-only' && 'Read Only'}
                            {apiKey.permissions === 'read-write' && 'Read & Write'}
                            {apiKey.permissions === 'full-access' && 'Full Access'}
                          </span>
                        </div>
                      </div>
                      <button className="inline-flex items-center justify-center size-9 rounded-md text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        readOnly
                        value={apiKey.key}
                        className="flex-1 h-9 px-3 py-1 rounded-md border border-white/10 bg-white/5 text-white font-mono text-sm outline-none"
                      />
                      <button className="inline-flex items-center justify-center size-9 rounded-md border border-white/10 text-white hover:bg-white/5 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="inline-flex items-center justify-center size-9 rounded-md border border-white/10 text-white hover:bg-white/5 transition-all">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-4 text-sm text-[#B0B6C1]">
                      <span>Created: {apiKey.created}</span>
                      <span>Last used: {apiKey.lastUsed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Endpoints Tab */}
          {activeTab === 'endpoints' && (
            <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <h3 className="text-white mb-4">Available Endpoints</h3>
              <div className="space-y-3">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all">
                    <div className="flex items-start gap-3">
                      <span
                        className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium font-mono ${
                          endpoint.method === 'GET'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : endpoint.method === 'POST'
                            ? 'bg-[#00AEEF]/20 text-[#00AEEF] border border-[#00AEEF]/30'
                            : endpoint.method === 'PUT'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <div className="flex-1">
                        <code className="text-white font-mono text-sm">{endpoint.path}</code>
                        <p className="text-[#B0B6C1] text-sm mt-1">{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <h3 className="text-white mb-4">Configured Webhooks</h3>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 rounded-lg border border-white/10 bg-white/5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white mb-1">{webhook.name}</h4>
                        <code className="text-[#B0B6C1] text-sm font-mono">{webhook.url}</code>
                      </div>
                      <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 border-green-500/30">
                        {webhook.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event) => (
                        <span
                          key={event}
                          className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-white/10 text-white border-white/10"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Start Tab */}
          {activeTab === 'quickstart' && (
            <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <h3 className="text-white mb-4">Quick Start Guide</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white mb-2">1. Authentication</h4>
                  <p className="text-[#B0B6C1] text-sm mb-3">
                    Include your API key in the Authorization header:
                  </p>
                  <div className="p-4 rounded-lg bg-[#0A0F1C] border border-white/10 font-mono text-sm">
                    <pre className="text-[#00F5C6]">
                      <code>
{`curl -X GET "https://api.Sample.com/v1/evaluations" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-white mb-2">2. Make Your First Request</h4>
                  <p className="text-[#B0B6C1] text-sm mb-3">
                    Fetch a list of evaluations:
                  </p>
                  <div className="p-4 rounded-lg bg-[#0A0F1C] border border-white/10 font-mono text-sm">
                    <pre className="text-[#00F5C6]">
                      <code>
{`const response = await fetch('https://api.Sample.com/v1/evaluations', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();`}
                      </code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-white mb-2">3. Create an Evaluation</h4>
                  <p className="text-[#B0B6C1] text-sm mb-3">
                    POST request to create a new evaluation:
                  </p>
                  <div className="p-4 rounded-lg bg-[#0A0F1C] border border-white/10 font-mono text-sm">
                    <pre className="text-[#00F5C6]">
                      <code>
{`const evaluation = await fetch('https://api.Sample.com/v1/evaluations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Q4 Performance Review',
    userId: '12345',
    dueDate: '2024-12-31'
  })
});`}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create API Key Modal */}
        <CreateAPIKeyModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onCreateKey={handleCreateAPIKey}
        />
      </div>
    </div>
  );
}
