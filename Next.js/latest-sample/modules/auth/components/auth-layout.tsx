'use client';

import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00F5C6]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Column - Branding */}
        <div className="hidden lg:flex flex-col items-start justify-center gap-12">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] mb-8 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#0A0F1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-white text-5xl font-bold mb-4">Welcome to Sample</h1>
            <p className="text-[#B0B6C1] text-lg">Empowering AI evaluation and benchmarking for the future.</p>
          </div>
          
          {/* Feature Points */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#00F5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Advanced Analytics</h3>
                <p className="text-[#B0B6C1] text-sm">Track and analyze AI model performance with comprehensive metrics.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#00F5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Secure & Reliable</h3>
                <p className="text-[#B0B6C1] text-sm">Enterprise-grade security with 99.9% uptime guarantee.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#00F5C6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Lightning Fast</h3>
                <p className="text-[#B0B6C1] text-sm">Optimized performance for seamless evaluation workflows.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl border border-white/10 rounded-2xl p-8 transition-all w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] mx-auto mb-4"></div>
            <h2 className="text-white text-2xl">Sample</h2>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-white text-2xl mb-2">{title}</h2>
            {description && <p className="text-[#B0B6C1]">{description}</p>}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
};
