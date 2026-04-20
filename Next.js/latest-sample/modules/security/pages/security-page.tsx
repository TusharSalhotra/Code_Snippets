'use client'

import { useState } from 'react'
import { Shield, CircleCheck, FileCheck, TriangleAlert, Download, Lock, Key, Eye, Clock } from 'lucide-react'
import { Button } from '@/src/shared/components'

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('security')
  
  // Authentication & Access toggles
  const [twoFactor, setTwoFactor] = useState(true)
  const [passwordExpiry, setPasswordExpiry] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [ipWhitelisting, setIpWhitelisting] = useState(false)
  
  // Data Protection toggles
  const [encryptionAtRest, setEncryptionAtRest] = useState(true)
  const [auditLogging, setAuditLogging] = useState(true)
  const [dataRetention, setDataRetention] = useState(true)
  const [dataAnonymization, setDataAnonymization] = useState(false)

  const auditLogs = [
    {
      user: 'Sarah Johnson',
      action: 'Updated KPI targets',
      timestamp: '2024-11-10 14:30',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      user: 'Michael Chen',
      action: 'Created new assessment',
      timestamp: '2024-11-10 13:15',
      ip: '192.168.1.101',
      status: 'success'
    },
    {
      user: 'Emily Rodriguez',
      action: 'Failed login attempt',
      timestamp: '2024-11-10 12:45',
      ip: '192.168.1.102',
      status: 'failed'
    },
    {
      user: 'David Kim',
      action: 'Exported user data',
      timestamp: '2024-11-10 11:20',
      ip: '192.168.1.103',
      status: 'success'
    },
    {
      user: 'Jessica Taylor',
      action: 'Modified role permissions',
      timestamp: '2024-11-10 10:10',
      ip: '192.168.1.104',
      status: 'success'
    }
  ]

  const securityEvents = [
    {
      icon: TriangleAlert,
      title: 'Multiple failed login attempts detected',
      time: '5 minutes ago',
      type: 'warning',
      color: 'yellow'
    },
    {
      icon: Eye,
      title: 'Security patch applied successfully',
      time: '2 hours ago',
      type: 'info',
      color: 'blue'
    },
    {
      icon: CircleCheck,
      title: 'Backup completed successfully',
      time: '6 hours ago',
      type: 'success',
      color: 'green'
    }
  ]

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Security & Compliance</h1>
            <p className="text-[#B0B6C1]">Manage security settings and compliance standards</p>
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export Compliance Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Security Score</p>
                <p className="text-white text-2xl">92%</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                <CircleCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Compliant Standards</p>
                <p className="text-white text-2xl">2/4</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0066CC] flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Audit Logs</p>
                <p className="text-white text-2xl">5</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <TriangleAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Security Events</p>
                <p className="text-white text-2xl">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-[3px] w-fit">
            <button
              onClick={() => setActiveTab('security')}
              className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:text-[#00F5C6]'
              }`}
            >
              Security Settings
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'compliance'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:text-[#00F5C6]'
              }`}
            >
              Compliance
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'audit'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:text-[#00F5C6]'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                  : 'text-white hover:text-[#00F5C6]'
              }`}
            >
              Security Events
            </button>
          </div>

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Authentication & Access */}
                <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className="w-5 h-5 text-[#00F5C6]" />
                    <h3 className="text-white">Authentication & Access</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <label className="text-sm font-medium text-white">Two-Factor Authentication</label>
                        <p className="text-[#B0B6C1] text-xs mt-1">Require 2FA for all users</p>
                      </div>
                      <button
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                          twoFactor ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                        }`}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${
                          twoFactor ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <label className="text-sm font-medium text-white">Password Expiry</label>
                        <p className="text-[#B0B6C1] text-xs mt-1">Passwords expire every 90 days</p>
                      </div>
                      <button
                        onClick={() => setPasswordExpiry(!passwordExpiry)}
                        className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                          passwordExpiry ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                        }`}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${
                          passwordExpiry ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <label className="text-sm font-medium text-white">Session Timeout</label>
                        <p className="text-[#B0B6C1] text-xs mt-1">Auto logout after 30 minutes</p>
                      </div>
                      <button
                        onClick={() => setSessionTimeout(!sessionTimeout)}
                        className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                          sessionTimeout ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                        }`}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${
                          sessionTimeout ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <label className="text-sm font-medium text-white">IP Whitelisting</label>
                        <p className="text-[#B0B6C1] text-xs mt-1">Restrict access to specific IPs</p>
                      </div>
                      <button
                        onClick={() => setIpWhitelisting(!ipWhitelisting)}
                        className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                          ipWhitelisting ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                        }`}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${
                          ipWhitelisting ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Data Protection */}
                <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                  <div className="flex items-center gap-2 mb-6">
                    <Key className="w-5 h-5 text-[#00AEEF]" />
                    <h3 className="text-white">Data Protection</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <label className="text-sm font-medium text-white">Encryption at Rest</label>
                        <p className="text-[#B0B6C1] text-xs mt-1">Encrypt all stored data</p>
                      </div>
                      <button
                        onClick={() => setEncryptionAtRest(!encryptionAtRest)}
                        className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                          encryptionAtRest ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                        }`}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${
                          encryptionAtRest ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <label className="text-sm font-medium text-white">Audit Logging</label>
                        <p className="text-[#B0B6C1] text-xs mt-1">Log all user activities</p>
                      </div>
                      <button
                        onClick={() => setAuditLogging(!auditLogging)}
                        className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                          auditLogging ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                        }`}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${
                          auditLogging ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <label className="text-sm font-medium text-white">Data Retention</label>
                        <p className="text-[#B0B6C1] text-xs mt-1">Retain data for 7 years</p>
                      </div>
                      <button
                        onClick={() => setDataRetention(!dataRetention)}
                        className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                          dataRetention ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                        }`}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${
                          dataRetention ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <label className="text-sm font-medium text-white">Data Anonymization</label>
                        <p className="text-[#B0B6C1] text-xs mt-1">Anonymize sensitive data</p>
                      </div>
                      <button
                        onClick={() => setDataAnonymization(!dataAnonymization)}
                        className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                          dataAnonymization ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                        }`}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${
                          dataAnonymization ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="secondary">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GDPR */}
              <div className="relative group">
                <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white mb-1">GDPR</h3>
                      <p className="text-[#B0B6C1] text-sm">General Data Protection Regulation</p>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 border-green-500/30">
                      compliant
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[#B0B6C1] text-sm">Coverage</span>
                    <span className="text-white">95%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '95%' }}></div>
                  </div>
                  <Button variant="primary" fullWidth>
                    View Details
                  </Button>
                </div>
              </div>

              {/* SOC 2 */}
              <div className="relative group">
                <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white mb-1">SOC 2</h3>
                      <p className="text-[#B0B6C1] text-sm">Service Organization Control 2</p>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 border-green-500/30">
                      compliant
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[#B0B6C1] text-sm">Coverage</span>
                    <span className="text-white">92%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{ width: '92%' }}></div>
                  </div>
                  <Button variant="primary" fullWidth>
                    View Details
                  </Button>
                </div>
              </div>

              {/* ISO 27001 */}
              <div className="relative group">
                <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white mb-1">ISO 27001</h3>
                      <p className="text-[#B0B6C1] text-sm">Information Security Management</p>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-[#00AEEF]/20 text-[#00AEEF] border-[#00AEEF]/30">
                      in progress
                    </span>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[#B0B6C1] text-sm">Coverage</span>
                    <span className="text-white">78%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]" style={{ width: '78%' }}></div>
                  </div>
                  <Button variant="primary" fullWidth>
                    View Details
                  </Button>
                </div>
              </div>

              {/* HIPAA */}
              <div className="relative group">
                <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white mb-1">HIPAA</h3>
                      <p className="text-[#B0B6C1] text-sm">Health Insurance Portability</p>
                    </div>
                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium bg-white/10 text-[#B0B6C1] border-white/10">
                      not applicable
                    </span>
                  </div>
                  <Button variant="primary" fullWidth>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="relative group">
            <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  className="w-full h-9 px-3 py-1 rounded-md border bg-white/5 border-white/10 text-white placeholder:text-[#B0B6C1] focus:outline-none focus:border-[#00F5C6]/50 focus:ring-[#00F5C6]/20 focus:ring-[3px] transition-all"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1] whitespace-nowrap">User</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1] whitespace-nowrap">Action</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1] whitespace-nowrap">Timestamp</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1] whitespace-nowrap">IP Address</th>
                      <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1] whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="p-2 align-middle whitespace-nowrap text-white">{log.user}</td>
                        <td className="p-2 align-middle whitespace-nowrap text-white">{log.action}</td>
                        <td className="p-2 align-middle whitespace-nowrap text-[#B0B6C1]">{log.timestamp}</td>
                        <td className="p-2 align-middle whitespace-nowrap text-[#B0B6C1]">{log.ip}</td>
                        <td className="p-2 align-middle whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                            log.status === 'success'
                              ? 'border-green-500/30 text-green-400'
                              : 'border-red-500/30 text-red-400'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Security Events Tab */}
        {activeTab === 'events' && (
          <div className="relative group">
            <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all p-6">
              <div className="space-y-4">
                {securityEvents.map((event, index) => {
                  const Icon = event.icon
                  const bgColors = {
                    yellow: 'bg-yellow-500/20',
                    blue: 'bg-[#00AEEF]/20',
                    green: 'bg-green-500/20'
                  }
                  const textColors = {
                    yellow: 'text-yellow-400',
                    blue: 'text-[#00AEEF]',
                    green: 'text-green-400'
                  }
                  
                  return (
                    <div key={index} className="p-4 rounded-lg border border-white/10 bg-white/5 flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColors[event.color as keyof typeof bgColors]}`}>
                        <Icon className={`w-5 h-5 ${textColors[event.color as keyof typeof textColors]}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white mb-1">{event.title}</p>
                        <p className="text-[#B0B6C1] text-sm flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
