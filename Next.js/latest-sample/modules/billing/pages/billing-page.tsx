'use client';

import { useState } from 'react';
import { CreditCard, Plus, Zap, Download, Check } from 'lucide-react';
import { Button } from '@/src/shared/components';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('usage');

  const usageData = [
    { date: '2024-11-10', evaluations: '1,200', coaching: '800', analytics: '400', total: '2,400' },
    { date: '2024-11-09', evaluations: '1,500', coaching: '1,000', analytics: '500', total: '3,000' },
    { date: '2024-11-08', evaluations: '1,100', coaching: '700', analytics: '350', total: '2,150' },
    { date: '2024-11-07', evaluations: '1,300', coaching: '900', analytics: '450', total: '2,650' },
    { date: '2024-11-06', evaluations: '1,400', coaching: '850', analytics: '420', total: '2,670' },
  ];

  const billingHistory = [
    { date: '2024-11-01', description: 'Pro Plan - Monthly', amount: '$299', status: 'paid' },
    { date: '2024-10-01', description: 'Pro Plan - Monthly', amount: '$299', status: 'paid' },
    { date: '2024-09-01', description: 'Pro Plan - Monthly', amount: '$299', status: 'paid' },
    { date: '2024-08-01', description: 'Starter Plan - Monthly', amount: '$99', status: 'paid' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$99',
      tokens: '10,000 tokens/month',
      features: ['Up to 50 users', 'Basic AI evaluations', 'Standard reports', 'Email support'],
      isCurrent: false,
    },
    {
      name: 'Professional',
      price: '$299',
      tokens: '50,000 tokens/month',
      features: ['Up to 200 users', 'Advanced AI features', 'Custom reports', 'Priority support', 'API access'],
      isCurrent: true,
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: '$999',
      tokens: '200,000 tokens/month',
      features: ['Unlimited users', 'Custom AI models', 'White-label options', 'Dedicated support', 'Advanced API', 'SLA guarantee'],
      isCurrent: false,
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Billing & Tokens</h1>
            <p className="text-[#B0B6C1]">Manage your subscription and token usage</p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </Button>
                        <Button variant="secondary">
              <CreditCard className="w-4 h-4" />
              Add Payment Method
            </Button>
          </div>
        </div>

        {/* Current Plan & Token Usage Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Plan Card */}
          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white">Current Plan</h3>
                  <span className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium mt-1 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]">
                    Professional
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#B0B6C1] text-sm">Monthly</p>
                <p className="text-white text-2xl">$299</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#00F5C6]" />
                <span className="text-[#B0B6C1]">Up to 200 users</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#00F5C6]" />
                <span className="text-[#B0B6C1]">50,000 AI tokens/month</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#00F5C6]" />
                <span className="text-[#B0B6C1]">Advanced AI features</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-[#00F5C6]" />
                <span className="text-[#B0B6C1]">Priority support</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-[#B0B6C1] text-sm mb-2">Next billing date: December 1, 2024</p>
              <Button variant="primary" fullWidth>
                Change Plan
              </Button>
            </div>
          </div>

          {/* Token Usage Card */}
          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0066CC] flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white">Token Usage</h3>
                <p className="text-[#B0B6C1] text-sm">Current billing period</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">Available Tokens</span>
                  <span className="text-white">35,000 / 50,000</span>
                </div>
                <div className="relative w-full overflow-hidden rounded-full h-3 bg-white/20">
                  <div 
                    className="h-full transition-all bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]" 
                    style={{ width: '70%' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-[#B0B6C1] text-xs mb-1">Evaluations</p>
                  <p className="text-white">12.5K</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-[#B0B6C1] text-xs mb-1">Coaching</p>
                  <p className="text-white">8.2K</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-[#B0B6C1] text-xs mb-1">Analytics</p>
                  <p className="text-white">4.3K</p>
                </div>
              </div>

                            <Button variant="secondary" fullWidth className="mt-4">
                <Plus className="w-4 h-4" />
                Add New Token Package
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-[3px] w-fit">
            <button
              onClick={() => setActiveTab('usage')}
              className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'usage'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:text-[#00F5C6]'
              }`}
            >
              Token Usage
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'billing'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:text-[#00F5C6]'
              }`}
            >
              Billing History
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:text-[#00F5C6]'
              }`}
            >
              Plans & Pricing
            </button>
          </div>

          {/* Token Usage Tab */}
          {activeTab === 'usage' && (
            <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Daily Token Usage</h3>
                <Button variant="primary">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Date</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Evaluations</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Coaching</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Analytics</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageData.map((row, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="p-2 align-middle text-white">{row.date}</td>
                        <td className="p-2 align-middle text-[#B0B6C1]">{row.evaluations}</td>
                        <td className="p-2 align-middle text-[#B0B6C1]">{row.coaching}</td>
                        <td className="p-2 align-middle text-[#B0B6C1]">{row.analytics}</td>
                        <td className="p-2 align-middle text-white">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Billing History Tab */}
          {activeTab === 'billing' && (
            <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white">Billing History</h3>
                <Button variant="primary">
                  <Download className="w-4 h-4" />
                  Download All
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="hover:bg-muted/50 border-b transition-colors border-white/10">
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-[#B0B6C1]">Date</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-[#B0B6C1]">Description</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-[#B0B6C1]">Amount</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-[#B0B6C1]">Status</th>
                      <th className="h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-[#B0B6C1]">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {billingHistory.map((row, index) => (
                      <tr key={index} className="hover:bg-muted/50 border-b transition-colors border-white/10">
                        <td className="p-2 align-middle whitespace-nowrap text-white">{row.date}</td>
                        <td className="p-2 align-middle whitespace-nowrap text-white">{row.description}</td>
                        <td className="p-2 align-middle whitespace-nowrap text-white">{row.amount}</td>
                        <td className="p-2 align-middle whitespace-nowrap">
                          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap bg-green-500/20 text-green-400 border-green-500/30">
                            {row.status}
                          </span>
                        </td>
                        <td className="p-2 align-middle whitespace-nowrap">
                          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-8 rounded-md gap-1.5 px-3 text-[#00F5C6] hover:text-[#00F5C6] hover:bg-white/5">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Plans & Pricing Tab */}
          {activeTab === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative group ${plan.isCurrent ? 'ring-2 ring-[#00F5C6] shadow-lg shadow-[#00F5C6]/20' : ''}`}
                >
                  <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all p-6">
                    {plan.isPopular && (
                      <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap mb-4 border-transparent bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-white text-xl mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-white text-4xl">{plan.price}</span>
                      <span className="text-[#B0B6C1]">/month</span>
                    </div>
                    <p className="text-[#B0B6C1] text-sm mb-4">{plan.tokens}</p>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-[#00F5C6]" />
                          <span className="text-[#B0B6C1]">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 w-full ${
                        plan.isCurrent
                          ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90'
                          : 'border border-white/10 text-white hover:bg-white/5'
                      }`}
                    >
                      {plan.isCurrent ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
