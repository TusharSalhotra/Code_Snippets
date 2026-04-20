/**
 * OrganizationSetupPage Component
 */

'use client';

import { Building2, Palette, Users, Shield, Target, UserCog, Lock, Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/src/shared/components';
import { useState } from 'react';

export default function OrganizationSetupPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, label: 'Organization Info', icon: Building2 },
    { id: 2, label: 'Branding', icon: Palette },
    { id: 3, label: 'Departments', icon: Users },
    { id: 4, label: 'Roles', icon: Shield },
    { id: 5, label: 'KPIs', icon: Target },
    { id: 6, label: 'Admins', icon: UserCog },
    { id: 7, label: 'Security', icon: Lock },
    { id: 8, label: 'AI Setup', icon: Brain },
  ];

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[900px] mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl mb-2">Organization Setup</h1>
          <p className="text-[#B0B6C1]">Step {currentStep} of {steps.length}: {steps[currentStep - 1].label}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative w-full overflow-hidden rounded-full h-2 bg-[#00F5C6]/20">
            <div 
              className="h-full transition-all bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00F5C6]/20 to-[#00AEEF]/20 border border-[#00F5C6]'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <StepIcon 
                  className={`w-5 h-5 ${
                    isActive ? 'text-[#00F5C6]' : 'text-[#B0B6C1]'
                  }`} 
                />
                <span 
                  className={`text-xs hidden md:block ${
                    isActive ? 'text-white' : 'text-[#B0B6C1]'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="p-8">
              <div className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <div>
                      <label className="text-white text-sm font-medium">Organization Name</label>
                      <input
                        type="text"
                        className="mt-2 w-full h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-[#B0B6C1]"
                        placeholder="Acme Corporation"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium">Industry</label>
                      <input
                        type="text"
                        className="mt-2 w-full h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-[#B0B6C1]"
                        placeholder="Technology"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium">Company Size</label>
                      <input
                        type="text"
                        className="mt-2 w-full h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-[#B0B6C1]"
                        placeholder="100-500 employees"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium">Website</label>
                      <input
                        type="url"
                        className="mt-2 w-full h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white placeholder:text-[#B0B6C1]"
                        placeholder="https://acme.com"
                      />
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium select-none text-white">Primary Color</label>
                      <div className="flex gap-3 mt-2">
                        <input type="color" className="flex min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] w-20 h-12 bg-white/5 border-white/10" value="#00F5C6" />
                        <input className="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex-1 bg-white/5 border-white/10 text-white" value="#00F5C6" />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium select-none text-white">Secondary Color</label>
                      <div className="flex gap-3 mt-2">
                        <input type="color" className="flex min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] w-20 h-12 bg-white/5 border-white/10" value="#00AEEF" />
                        <input className="flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] flex-1 bg-white/5 border-white/10 text-white" value="#00AEEF" />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm leading-none font-medium select-none text-white">Logo Upload</label>
                      <div className="mt-2 border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-[#00F5C6]/50 transition-colors cursor-pointer">
                        <p className="text-[#B0B6C1]">Drop your logo here or click to browse</p>
                        <p className="text-[#B0B6C1] text-xs mt-2">SVG, PNG, JPG (max 2MB)</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#B0B6C1]">Define your organizational structure</p>
                      <Button variant="secondary">
                        <Brain className="w-4 h-4" />
                        AI Auto-Suggest
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[#00F5C6]" />
                          <span className="text-white">Engineering</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Edit</button>
                      </div>
                      <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[#00F5C6]" />
                          <span className="text-white">Sales</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Edit</button>
                      </div>
                      <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[#00F5C6]" />
                          <span className="text-white">Support</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Edit</button>
                      </div>
                      <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[#00F5C6]" />
                          <span className="text-white">HR</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Edit</button>
                      </div>
                      <div className="p-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-[#00F5C6]" />
                          <span className="text-white">Product</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Edit</button>
                      </div>
                    </div>
                    <Button variant="primary" fullWidth>
                      + Add Department
                    </Button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#B0B6C1]">Configure roles and permissions</p>
                      <Button variant="secondary">
                        <Brain className="w-4 h-4" />
                        AI Auto-Configure
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-[#00AEEF]" />
                          <span className="text-white">Admin</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Configure</button>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-[#00AEEF]" />
                          <span className="text-white">Manager</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Configure</button>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-[#00AEEF]" />
                          <span className="text-white">Team Lead</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Configure</button>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-[#00AEEF]" />
                          <span className="text-white">Employee</span>
                        </div>
                        <button className="h-8 px-3 rounded-md text-sm text-[#B0B6C1] hover:bg-white/5 transition-all">Configure</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[#B0B6C1]">Select KPI packs for your organization</p>
                      <Button variant="secondary">
                        <Brain className="w-4 h-4" />
                        AI Recommendations
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">IT Support</h4>
                          <input type="checkbox" className="rounded border-white/20" />
                        </div>
                        <p className="text-sm text-[#B0B6C1]">8 KPIs</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">Sales</h4>
                          <input type="checkbox" className="rounded border-white/20" />
                        </div>
                        <p className="text-sm text-[#B0B6C1]">10 KPIs</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">HR</h4>
                          <input type="checkbox" className="rounded border-white/20" />
                        </div>
                        <p className="text-sm text-[#B0B6C1]">12 KPIs</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">Engineering</h4>
                          <input type="checkbox" className="rounded border-white/20" />
                        </div>
                        <p className="text-sm text-[#B0B6C1]">14 KPIs</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <p className="text-[#B0B6C1] mb-4">Add administrator accounts</p>
                    <div>
                      <label htmlFor="admin-email" className="block text-sm text-[#B0B6C1] mb-2">Email Address</label>
                      <input
                        id="admin-email"
                        type="email"
                        placeholder="admin@company.com"
                        className="w-full h-9 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder:text-[#B0B6C1]/50 focus:outline-none focus:border-[#00F5C6] transition-all"
                      />
                    </div>
                    <Button variant="secondary">
                      Add Another Admin
                    </Button>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="space-y-6">
                    <p className="text-[#B0B6C1] mb-4">Configure security settings</p>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="mt-0.5 rounded border-white/20" />
                        <div>
                          <p className="text-white">Enable SSO (Single Sign-On)</p>
                          <p className="text-sm text-[#B0B6C1]">Allow users to sign in with corporate credentials</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded border-white/20" />
                        <div>
                          <p className="text-white">Require Two-Factor Authentication</p>
                          <p className="text-sm text-[#B0B6C1]">Enhance security with 2FA for all users</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" className="mt-0.5 rounded border-white/20" />
                        <div>
                          <p className="text-white">IP Allowlist</p>
                          <p className="text-sm text-[#B0B6C1]">Restrict access to specific IP addresses</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {currentStep === 8 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">AI-Powered Features</h3>
                        <p className="text-sm text-[#B0B6C1]">Enable AI to enhance assessments</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded border-white/20" />
                        <div>
                          <p className="text-white">Performance Review Summaries</p>
                          <p className="text-sm text-[#B0B6C1]">Auto-generate summaries from assessment data</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded border-white/20" />
                        <div>
                          <p className="text-white">Skill Gap Analysis</p>
                          <p className="text-sm text-[#B0B6C1]">Identify areas for employee development</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded border-white/20" />
                        <div>
                          <p className="text-white">Coaching Recommendations</p>
                          <p className="text-sm text-[#B0B6C1]">Receive AI-powered coaching suggestions</p>
                        </div>
                      </label>
                    </div>
                    <Button variant="secondary" fullWidth size="lg">
                      Run AI Auto-Setup
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 border border-white/10 text-white hover:bg-white/5 disabled:opacity-50 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
