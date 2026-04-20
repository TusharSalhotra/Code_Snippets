'use client';

import { Lock, Shield, Key } from 'lucide-react';
import { useSecurity } from '../hooks/use-security';

export function SecurityCompliancePage() {
  const { settings, loading } = useSecurity();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Security & Compliance</h1>
        <p className="text-[#B0B6C1]">Manage security settings and compliance</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Two-Factor Authentication</h3>
              <p className="text-[#B0B6C1] text-sm">Additional security layer for user accounts</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">{settings?.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
            <div className={`px-3 py-1 rounded-full text-xs ${settings?.twoFactorEnabled ? 'bg-cyan-400/20 text-cyan-400' : 'bg-gray-400/20 text-gray-400'}`}>
              {settings?.twoFactorEnabled ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Single Sign-On (SSO)</h3>
              <p className="text-[#B0B6C1] text-sm">Enterprise authentication</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">{settings?.ssoEnabled ? 'Enabled' : 'Disabled'}</span>
            <div className={`px-3 py-1 rounded-full text-xs ${settings?.ssoEnabled ? 'bg-cyan-400/20 text-cyan-400' : 'bg-gray-400/20 text-gray-400'}`}>
              {settings?.ssoEnabled ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Password Policy</h3>
              <p className="text-[#B0B6C1] text-sm">Password strength requirements</p>
            </div>
          </div>
          <div className="text-white capitalize">{settings?.passwordPolicy}</div>
        </div>
      </div>
    </div>
  );
}
