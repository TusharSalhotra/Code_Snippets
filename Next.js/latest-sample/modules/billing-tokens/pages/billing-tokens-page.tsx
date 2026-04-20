'use client';

import { useState } from 'react';
import { CreditCard, Zap, Plus, Check, Download } from 'lucide-react';
import { useBillingTokensStore } from '@/src/store/useBillingTokensStore';
import { PurchaseTokensModal } from '../components/purchase-tokens-modal';
import { TOKEN_PACKAGES } from '../constants/token-packages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for daily usage
const dailyUsage = [
  { date: '2024-11-10', evaluations: 1200, coaching: 800, analytics: 400, total: 2400 },
  { date: '2024-11-09', evaluations: 1500, coaching: 1000, analytics: 500, total: 3000 },
  { date: '2024-11-08', evaluations: 1100, coaching: 700, analytics: 350, total: 2150 },
  { date: '2024-11-07', evaluations: 1300, coaching: 900, analytics: 450, total: 2650 },
  { date: '2024-11-06', evaluations: 1400, coaching: 850, analytics: 420, total: 2670 },
];

// Mock data for billing history
const billingHistory = [
  { date: '2024-11-01', description: 'Pro Plan - Monthly', amount: 299, status: 'paid' },
  { date: '2024-10-01', description: 'Pro Plan - Monthly', amount: 299, status: 'paid' },
  { date: '2024-09-01', description: 'Pro Plan - Monthly', amount: 299, status: 'paid' },
  { date: '2024-08-01', description: 'Starter Plan - Monthly', amount: 99, status: 'paid' },
];

// Mock data for pricing plans
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    tokens: '10,000',
    features: [
      'Up to 50 users',
      'Basic AI evaluations',
      'Standard reports',
      'Email support'
    ],
    buttonText: 'Upgrade',
    highlighted: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 299,
    tokens: '50,000',
    features: [
      'Up to 200 users',
      'Advanced AI features',
      'Custom reports',
      'Priority support',
      'API access'
    ],
    buttonText: 'Current Plan',
    highlighted: true,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    tokens: '200,000',
    features: [
      'Unlimited users',
      'Custom AI models',
      'White-label options',
      'Dedicated support',
      'Advanced API',
      'SLA guarantee'
    ],
    buttonText: 'Upgrade',
    highlighted: false
  }
];

export function BillingTokensPage() {
  const { billing, purchaseTokens } = useBillingTokensStore();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  const availableTokens = (billing?.tokens || 0) - (billing?.tokensUsed || 0);
  const tokenPercentage = billing ? ((billing.tokensUsed / billing.tokens) * 100) : 0;

  const handlePurchase = (packageId: string) => {
    const selectedPackage = TOKEN_PACKAGES.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      purchaseTokens(packageId, selectedPackage.tokens);
      console.log('Purchased:', selectedPackage);
    }
  };

  const handleBuyTokens = () => {
    setIsPurchaseModalOpen(true);
  };

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
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Method
            </Button>
            <Button
              onClick={handleBuyTokens}
              className="bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buy Tokens
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Plan Card */}
          <div className="relative group">
            <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white">Current Plan</h3>
                    <Badge className="mt-1 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]">
                      Professional
                    </Badge>
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
                <p className="text-[#B0B6C1] text-sm mb-2">
                  Next billing date: December 1, 2024
                </p>
                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5"
                >
                  Change Plan
                </Button>
              </div>
            </div>
          </div>

          {/* Token Usage Card */}
          <div className="relative group">
            <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
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
                    <span className="text-white">
                      {availableTokens.toLocaleString()} / {billing?.tokens.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={100 - tokenPercentage} className="h-3" />
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

                <Button
                  onClick={handleBuyTokens}
                  className="w-full mt-4 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Purchase Additional Tokens
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="usage" className="space-y-6">
          <TabsList className="w-fit bg-white/5 border border-white/10">
            <TabsTrigger
              value="usage"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00F5C6] data-[state=active]:to-[#00AEEF] data-[state=active]:text-[#0A0F1C]"
            >
              Token Usage
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00F5C6] data-[state=active]:to-[#00AEEF] data-[state=active]:text-[#0A0F1C]"
            >
              Billing History
            </TabsTrigger>
            <TabsTrigger
              value="plans"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00F5C6] data-[state=active]:to-[#00AEEF] data-[state=active]:text-[#0A0F1C]"
            >
              Plans & Pricing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage">
            <div className="relative group">
              <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white">Daily Token Usage</h3>
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-[#B0B6C1]">Date</TableHead>
                        <TableHead className="text-[#B0B6C1]">Evaluations</TableHead>
                        <TableHead className="text-[#B0B6C1]">Coaching</TableHead>
                        <TableHead className="text-[#B0B6C1]">Analytics</TableHead>
                        <TableHead className="text-[#B0B6C1]">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyUsage.map((day) => (
                        <TableRow key={day.date} className="border-white/10">
                          <TableCell className="text-white">{day.date}</TableCell>
                          <TableCell className="text-[#B0B6C1]">
                            {day.evaluations.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-[#B0B6C1]">
                            {day.coaching.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-[#B0B6C1]">
                            {day.analytics.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-white">
                            {day.total.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <div className="relative group">
              <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white">Billing History</h3>
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-[#B0B6C1]">Date</TableHead>
                        <TableHead className="text-[#B0B6C1]">Description</TableHead>
                        <TableHead className="text-[#B0B6C1]">Amount</TableHead>
                        <TableHead className="text-[#B0B6C1]">Status</TableHead>
                        <TableHead className="text-[#B0B6C1]">Invoice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.map((bill, index) => (
                        <TableRow key={index} className="border-white/10">
                          <TableCell className="text-white">{bill.date}</TableCell>
                          <TableCell className="text-white">{bill.description}</TableCell>
                          <TableCell className="text-white">${bill.amount}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {bill.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#00F5C6] hover:text-[#00F5C6]"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative group ${
                    plan.highlighted
                      ? 'ring-2 ring-[#00F5C6] shadow-lg shadow-[#00F5C6]/20'
                      : ''
                  }`}
                >
                  <div className="relative p-4 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                    {plan.popular && (
                      <Badge className="mb-4 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]">
                        Most Popular
                      </Badge>
                    )}
                    
                    <h3 className="text-white text-xl mb-2">{plan.name}</h3>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-white text-4xl">${plan.price}</span>
                      <span className="text-[#B0B6C1]">/month</span>
                    </div>
                    
                    <p className="text-[#B0B6C1] text-sm mb-4">
                      {plan.tokens} tokens/month
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-[#00F5C6]" />
                          <span className="text-[#B0B6C1]">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90'
                          : 'border-white/10 text-white hover:bg-white/5'
                      }`}
                      variant={plan.highlighted ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Purchase Tokens Modal */}
        <PurchaseTokensModal
          open={isPurchaseModalOpen}
          onOpenChange={setIsPurchaseModalOpen}
          onPurchase={handlePurchase}
        />
      </div>
    </div>
  );
}
