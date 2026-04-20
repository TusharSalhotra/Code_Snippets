'use client';

import { Download, FileCheck, CircleAlert, Calendar, ChevronDown } from 'lucide-react';
import { SearchBar, Button } from '@/src/shared/components';

export default function AuditLogsPage() {
  const auditLogs = [
    {
      timestamp: '2024-11-10 14:35:22',
      user: 'Sarah Johnson',
      action: 'Updated',
      resource: 'KPI Target',
      details: 'Changed Q4 target from 85% to 90%',
      category: 'kpi',
      categoryColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      status: 'success',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      ip: '192.168.1.100'
    },
    {
      timestamp: '2024-11-10 14:30:15',
      user: 'Michael Chen',
      action: 'Created',
      resource: 'Assessment',
      details: 'Created Q4 Performance Review assessment',
      category: 'assessment',
      categoryColor: 'bg-[#00AEEF]/20 text-[#00AEEF] border-[#00AEEF]/30',
      status: 'success',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      ip: '192.168.1.101'
    },
    {
      timestamp: '2024-11-10 14:25:08',
      user: 'Unknown',
      action: 'Failed Login',
      resource: 'Authentication',
      details: 'Failed login attempt for user: admin@company.com',
      category: 'security',
      categoryColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      status: 'failed',
      statusColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      ip: '203.0.113.42'
    },
    {
      timestamp: '2024-11-10 14:20:33',
      user: 'Emily Rodriguez',
      action: 'Exported',
      resource: 'User Data',
      details: 'Exported user list to CSV',
      category: 'user',
      categoryColor: 'bg-[#00F5C6]/20 text-[#00F5C6] border-[#00F5C6]/30',
      status: 'success',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      ip: '192.168.1.102'
    },
    {
      timestamp: '2024-11-10 14:15:45',
      user: 'David Kim',
      action: 'Modified',
      resource: 'Role Permissions',
      details: 'Updated Team Lead role permissions',
      category: 'security',
      categoryColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      status: 'success',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      ip: '192.168.1.103'
    },
    {
      timestamp: '2024-11-10 14:10:12',
      user: 'Jessica Taylor',
      action: 'Deleted',
      resource: 'User Account',
      details: 'Deactivated user: john.doe@company.com',
      category: 'user',
      categoryColor: 'bg-[#00F5C6]/20 text-[#00F5C6] border-[#00F5C6]/30',
      status: 'warning',
      statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      ip: '192.168.1.104'
    },
    {
      timestamp: '2024-11-10 14:05:28',
      user: 'System',
      action: 'Backup',
      resource: 'Database',
      details: 'Automated database backup completed',
      category: 'system',
      categoryColor: 'bg-white/10 text-[#B0B6C1] border-white/10',
      status: 'success',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      ip: 'internal'
    },
    {
      timestamp: '2024-11-10 14:00:00',
      user: 'Robert Martinez',
      action: 'Created',
      resource: 'Department',
      details: 'Created new department: Customer Success',
      category: 'user',
      categoryColor: 'bg-[#00F5C6]/20 text-[#00F5C6] border-[#00F5C6]/30',
      status: 'success',
      statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      ip: '192.168.1.105'
    }
  ];

  const totalLogs = auditLogs.length;
  const successfulLogs = auditLogs.filter(log => log.status === 'success').length;
  const failedLogs = auditLogs.filter(log => log.status === 'failed').length;
  const warningLogs = auditLogs.filter(log => log.status === 'warning').length;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Audit Logs</h1>
            <p className="text-[#B0B6C1]">Track all system activities and changes</p>
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Total Logs</p>
                <p className="text-white text-2xl">{totalLogs}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Successful</p>
                <p className="text-white text-2xl">{successfulLogs}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <CircleAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Failed</p>
                <p className="text-white text-2xl">{failedLogs}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <CircleAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Warnings</p>
                <p className="text-white text-2xl">{warningLogs}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <SearchBar placeholder="Search logs..." />

            {/* Category Filter */}
            <div className="relative">
              <select className="w-full h-9 px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white appearance-none outline-none focus:border-[#00F5C6] transition-all">
                <option>All Categories</option>
                <option>KPI</option>
                <option>Assessment</option>
                <option>Security</option>
                <option>User</option>
                <option>System</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B6C1] pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select className="w-full h-9 px-3 py-2 rounded-md border border-white/10 bg-white/5 text-white appearance-none outline-none focus:border-[#00F5C6] transition-all">
                <option>All Status</option>
                <option>Success</option>
                <option>Failed</option>
                <option>Warning</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B6C1] pointer-events-none" />
            </div>

            {/* Date Picker */}
            <Button variant="primary">
              <Calendar className="w-4 h-4" />
              Pick a date
            </Button>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Timestamp</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">User</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Action</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Resource</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Details</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Category</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">Status</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-[#B0B6C1]">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-2 align-middle text-[#B0B6C1] text-sm whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-2 align-middle text-white whitespace-nowrap">{log.user}</td>
                    <td className="p-2 align-middle text-white whitespace-nowrap">{log.action}</td>
                    <td className="p-2 align-middle text-white whitespace-nowrap">{log.resource}</td>
                    <td className="p-2 align-middle text-[#B0B6C1] text-sm max-w-[300px] truncate">{log.details}</td>
                    <td className="p-2 align-middle whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${log.categoryColor}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="p-2 align-middle whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${log.statusColor}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-2 align-middle text-[#B0B6C1] text-sm font-mono whitespace-nowrap">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
