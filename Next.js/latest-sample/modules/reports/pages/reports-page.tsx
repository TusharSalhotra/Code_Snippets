/**
 * ReportsPage Component
 */

'use client';

import { TrendingUp, Users, Target, Award, Share2, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '@/src/shared/components';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const kpiTrendsData = [
    { month: 'Jan', dept1: 70, dept2: 66, dept3: 73, dept4: 68 },
    { month: 'Feb', dept1: 73, dept2: 70, dept3: 76, dept4: 72 },
    { month: 'Mar', dept1: 76, dept2: 73, dept3: 78, dept4: 73 },
    { month: 'Apr', dept1: 78, dept2: 76, dept3: 80, dept4: 76 },
    { month: 'May', dept1: 80, dept2: 78, dept3: 83, dept4: 78 },
    { month: 'Jun', dept1: 83, dept2: 80, dept3: 85, dept4: 80 },
  ];

  const skillsData = [
    { skill: 'Technical', value: 85 },
    { skill: 'Communication', value: 78 },
    { skill: 'Leadership', value: 68 },
    { skill: 'Problem Solving', value: 82 },
    { skill: 'Collaboration', value: 92 },
  ];

  const weeklyEngagementData = [
    { day: 'Mon', value: 75 },
    { day: 'Tue', value: 82 },
    { day: 'Wed', value: 78 },
    { day: 'Thu', value: 88 },
    { day: 'Fri', value: 85 },
    { day: 'Sat', value: 55 },
    { day: 'Sun', value: 62 },
  ];

  const departmentPerformanceData = [
    { name: 'Engineering', value: 85 },
    { name: 'Sales', value: 82 },
    { name: 'Support', value: 87 },
    { name: 'HR', value: 82 },
    { name: 'Product', value: 80 },
  ];

  const stats = [
    {
      label: 'Overall Performance',
      value: '83.5',
      badge: '+12%',
      icon: TrendingUp,
    },
    {
      label: 'Employee Engagement',
      value: '78%',
      badge: '+8%',
      icon: Users,
    },
    {
      label: 'KPI Achievement',
      value: '85%',
      badge: '+15%',
      icon: Target,
    },
    {
      label: 'Skill Development',
      value: '92%',
      badge: '+5%',
      icon: Award,
    },
  ];

  const insights = [
    {
      title: 'Top Performer',
      description: 'Support team shows 15% improvement in customer satisfaction scores',
      icon: TrendingUp,
    },
    {
      title: 'Attention Needed',
      description: 'Sales team engagement dropped 5% - consider coaching intervention',
      icon: Target,
    },
    {
      title: 'Opportunity',
      description: 'Engineering team ready for advanced training in cloud technologies',
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Reports &amp; Analytics</h1>
            <p className="text-[#B0B6C1]">Comprehensive insights into organizational performance</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">
              <Share2 className="w-4 h-4" />
              Share Report
            </Button>
                        <Button variant="secondary">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="relative group">
          <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <select className="w-full h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white">
                    <option>Last 6 Months</option>
                    <option>Last 3 Months</option>
                    <option>Last Month</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                <select className="lg:w-[200px] h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Support</option>
                </select>
                <Button variant="primary">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                        <StatIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-[#00F5C6]/50 text-[#00F5C6]">
                        {stat.badge}
                      </span>
                    </div>
                    <p className="text-[#B0B6C1] text-sm mb-2">{stat.label}</p>
                    <p className="text-white text-2xl">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPI Trends */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <div className="p-6">
                <h3 className="text-white text-lg mb-6">Department KPI Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={kpiTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#B0B6C1" />
                    <YAxis stroke="#B0B6C1" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(10, 15, 28, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Line type="monotone" dataKey="dept1" stroke="#00F5C6" strokeWidth={2} dot={{ fill: '#fff' }} />
                    <Line type="monotone" dataKey="dept2" stroke="#00AEEF" strokeWidth={2} dot={{ fill: '#fff' }} />
                    <Line type="monotone" dataKey="dept3" stroke="#A855F7" strokeWidth={2} dot={{ fill: '#fff' }} />
                    <Line type="monotone" dataKey="dept4" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Skills Overview */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <div className="p-6">
                <h3 className="text-white text-lg mb-6">Team Skills Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={skillsData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="skill" stroke="#B0B6C1" />
                    <PolarRadiusAxis stroke="#B0B6C1" />
                    <Radar name="Skills" dataKey="value" stroke="#00F5C6" fill="#00F5C6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Weekly Engagement */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <div className="p-6">
                <h3 className="text-white text-lg mb-6">Weekly Engagement Pattern</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="#B0B6C1" />
                    <YAxis stroke="#B0B6C1" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(10, 15, 28, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00F5C6" />
                        <stop offset="100%" stopColor="#00AEEF" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Department Performance */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <div className="p-6">
                <h3 className="text-white text-lg mb-6">Department Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentPerformanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#B0B6C1" />
                    <YAxis dataKey="name" type="category" stroke="#B0B6C1" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(10, 15, 28, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="value" fill="#00F5C6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="p-6">
              <h3 className="text-white text-lg mb-4">AI-Generated Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight, index) => {
                  const InsightIcon = insight.icon;
                  return (
                    <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center flex-shrink-0">
                          <InsightIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white text-sm mb-1">{insight.title}</p>
                          <p className="text-[#B0B6C1] text-xs">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
