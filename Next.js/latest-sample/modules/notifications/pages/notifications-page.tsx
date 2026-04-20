'use client';

import { useState } from 'react';
import { Bell, CircleAlert, Target, CheckCheck, FileText, Users, Brain, Settings, Check, Trash2 } from 'lucide-react';
import { Button } from '@/src/shared/components';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [assessmentReminders, setAssessmentReminders] = useState(true);
  const [kpiAlerts, setKpiAlerts] = useState(true);
  const [userActivity, setUserActivity] = useState(false);
  const [aiInsights, setAiInsights] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);

  const notifications = [
    {
      id: 1,
      icon: FileText,
      title: 'New Assessment Due',
      message: 'Q4 Performance Review for Engineering team is due in 3 days',
      time: '10 minutes ago',
      priority: 'high',
      unread: true,
      type: 'assessment'
    },
    {
      id: 2,
      icon: Target,
      title: 'KPI Goal Achieved',
      message: 'Engineering team has achieved 95% of their quarterly KPI targets',
      time: '2 hours ago',
      priority: 'medium',
      unread: true,
      type: 'kpi'
    },
    {
      id: 3,
      icon: Users,
      title: 'New User Added',
      message: 'John Doe has been added to the Product team',
      time: '5 hours ago',
      priority: 'low',
      unread: false,
      type: 'user'
    },
    {
      id: 4,
      icon: Brain,
      title: 'AI Model Training Complete',
      message: 'Performance prediction model has completed training with 92% accuracy',
      time: '1 day ago',
      priority: 'medium',
      unread: false,
      type: 'ai'
    },
    {
      id: 5,
      icon: CircleAlert,
      title: 'System Update Available',
      message: 'A new version of Sample is available with enhanced features',
      time: '2 days ago',
      priority: 'low',
      unread: false,
      type: 'system'
    },
    {
      id: 6,
      icon: FileText,
      title: 'Assessment Completed',
      message: 'Sarah Johnson completed the leadership assessment',
      time: '3 days ago',
      priority: 'low',
      unread: false,
      type: 'assessment'
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return notification.unread;
    if (activeTab === 'assessment') return notification.type === 'assessment';
    if (activeTab === 'kpi') return notification.type === 'kpi';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'border-red-500/30 text-red-400';
    if (priority === 'medium') return 'border-[#00AEEF]/30 text-[#00AEEF]';
    return 'border-white/30 text-[#B0B6C1]';
  };

  const getNotificationBg = (unread: boolean) => {
    return unread 
      ? 'bg-gradient-to-r from-[#00F5C6]/10 to-[#00AEEF]/10 border-[#00F5C6]/30' 
      : 'bg-white/5 border-white/10';
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Notifications</h1>
            <p className="text-[#B0B6C1]">Stay updated with your team's activities</p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary">
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Total Notifications</p>
                <p className="text-white text-2xl">{notifications.length}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <CircleAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">Unread</p>
                <p className="text-white text-2xl">{unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0066CC] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[#B0B6C1] text-sm">High Priority</p>
                <p className="text-white text-2xl">{highPriorityCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              {/* Tabs */}
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-[3px] mb-6 w-fit">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                      : 'text-white hover:text-[#00F5C6]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'unread'
                      ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                      : 'text-white hover:text-[#00F5C6]'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setActiveTab('assessment')}
                  className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'assessment'
                      ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                      : 'text-white hover:text-[#00F5C6]'
                  }`}
                >
                  Assessments
                </button>
                <button
                  onClick={() => setActiveTab('kpi')}
                  className={`px-2 py-1 text-sm font-medium rounded-xl transition-all ${
                    activeTab === 'kpi'
                      ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C]'
                      : 'text-white hover:text-[#00F5C6]'
                  }`}
                >
                  KPIs
                </button>
              </div>

              {/* Notifications Scroll Area */}
              <div className="h-[600px] overflow-y-auto pr-4 space-y-3">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all ${getNotificationBg(notification.unread)}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-[#00F5C6]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-white">{notification.title}</h4>
                            <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className="text-[#B0B6C1] text-sm mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#B0B6C1] text-xs">{notification.time}</span>
                            <div className="flex gap-2">
                              {notification.unread && (
                                <button className="inline-flex items-center justify-center h-8 px-2 rounded-md text-[#00F5C6] hover:text-[#00F5C6] hover:bg-[#00F5C6]/10 transition-all">
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button className="inline-flex items-center justify-center h-8 px-2 rounded-md text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <div className="p-6 bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-[#00F5C6]" />
                <h3 className="text-white">Notification Settings</h3>
              </div>

              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">Email Notifications</label>
                    <p className="text-[#B0B6C1] text-xs">Receive notifications via email</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                      emailNotifications ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                    }`}
                  >
                    <span className={`block size-4 rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">Push Notifications</label>
                    <p className="text-[#B0B6C1] text-xs">Browser push notifications</p>
                  </div>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                      pushNotifications ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                    }`}
                  >
                    <span className={`block size-4 rounded-full bg-white transition-transform ${
                      pushNotifications ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="h-px bg-white/10 my-4" />

                {/* Assessment Reminders */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">Assessment Reminders</label>
                  <button
                    onClick={() => setAssessmentReminders(!assessmentReminders)}
                    className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                      assessmentReminders ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                    }`}
                  >
                    <span className={`block size-4 rounded-full bg-white transition-transform ${
                      assessmentReminders ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* KPI Alerts */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">KPI Alerts</label>
                  <button
                    onClick={() => setKpiAlerts(!kpiAlerts)}
                    className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                      kpiAlerts ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                    }`}
                  >
                    <span className={`block size-4 rounded-full bg-white transition-transform ${
                      kpiAlerts ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* User Activity */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">User Activity</label>
                  <button
                    onClick={() => setUserActivity(!userActivity)}
                    className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                      userActivity ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                    }`}
                  >
                    <span className={`block size-4 rounded-full bg-white transition-transform ${
                      userActivity ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* AI Insights */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">AI Insights</label>
                  <button
                    onClick={() => setAiInsights(!aiInsights)}
                    className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                      aiInsights ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                    }`}
                  >
                    <span className={`block size-4 rounded-full bg-white transition-transform ${
                      aiInsights ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* System Updates */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">System Updates</label>
                  <button
                    onClick={() => setSystemUpdates(!systemUpdates)}
                    className={`inline-flex h-[1.15rem] w-8 items-center rounded-full transition-all ${
                      systemUpdates ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/20'
                    }`}
                  >
                    <span className={`block size-4 rounded-full bg-white transition-transform ${
                      systemUpdates ? 'translate-x-[calc(100%-2px)]' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

                            <Button variant="secondary" fullWidth>
                Save Notification Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
