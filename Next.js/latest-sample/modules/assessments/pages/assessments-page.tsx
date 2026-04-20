/**
 * AssessmentsPage Component
 */

'use client';

import { Calendar, Users, CircleCheck, Plus, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/src/shared/components';
import { useState } from 'react';
import { useAssessmentsStore } from '../../../store/useAssessmentsStore';
import { AssessmentModal } from '../components/assessment-modal';
import type { AssessmentFormData } from '../schemas/assessment.schema';
import type { Assessment } from '../types';

export default function AssessmentsPage() {
  const { assessments, addAssessment, updateAssessment } = useAssessmentsStore();
  
  const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'completed'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | undefined>(undefined);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Filter assessments by status
  const activeAssessments = assessments.filter((a: Assessment) => a.status === 'active');
  const draftAssessments = assessments.filter((a: Assessment) => a.status === 'draft');
  const archivedAssessments = assessments.filter((a: Assessment) => a.status === 'archived');

  // Get the most recent active assessment
  const activeCycle = activeAssessments[0];

  // Calculate stats
  const stats = [
    {
      label: 'Active Cycles',
      value: activeAssessments.length.toString(),
      icon: Calendar,
    },
    {
      label: 'Total Participants',
      value: activeAssessments.reduce((sum: number, a: Assessment) => sum + a.assignedTo, 0).toString(),
      icon: Users,
    },
    {
      label: 'Completion Rate',
      value: activeAssessments.length > 0
        ? `${Math.round((activeAssessments.reduce((sum: number, a: Assessment) => sum + a.completedBy, 0) / activeAssessments.reduce((sum: number, a: Assessment) => sum + a.assignedTo, 0)) * 100)}%`
        : '0%',
      icon: CircleCheck,
    },
  ];

  const pendingReviews = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Engineering Manager',
      progress: 60,
      dueIn: '2 days',
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Senior Developer',
      progress: 30,
      dueIn: '5 days',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      progress: 0,
      dueIn: '7 days',
    },
  ];

  const handleAddClick = () => {
    setSelectedAssessment(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClick = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSubmit = (data: AssessmentFormData) => {
    if (modalMode === 'create') {
      addAssessment({
        title: data.name,
        description: data.description,
        type: data.type,
        departmentId: '1', // Default for now
        departmentName: data.participants === 'all' ? 'All Departments' : 'Engineering',
        status: data.status || 'draft',
        totalQuestions: 0,
        duration: 0,
        passingScore: 0,
        assignedTo: data.participants === 'all' ? 100 : 50,
        completedBy: 0,
      });
    } else if (selectedAssessment) {
      updateAssessment(selectedAssessment.id, {
        title: data.name,
        description: data.description,
        type: data.type,
        status: data.status,
      });
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Assessments</h1>
            <p className="text-[#B0B6C1]">Create and manage performance assessment cycles</p>
          </div>
          <button 
            onClick={handleAddClick}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Create Assessment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[#B0B6C1] text-sm">{stat.label}</p>
                      <p className="text-white text-2xl">{stat.value}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-2 w-full">
          <div className="h-9 w-fit items-center justify-center rounded-xl p-[3px] flex bg-white/5">
            <button
              onClick={() => setActiveTab('active')}
              className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'active'
                  ? 'bg-[rgba(255,255,255,0.04)] border-white/10'
                  : 'border-transparent text-[#B0B6C1]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'scheduled'
                  ? 'bg-[rgba(255,255,255,0.04)] border-white/10'
                  : 'border-transparent text-[#B0B6C1]'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-1 text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'completed'
                  ? 'bg-[rgba(255,255,255,0.04)] border-white/10'
                  : 'border-transparent text-[#B0B6C1]'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Active Tab Content */}
          {activeTab === 'active' && (
            <div className="flex-1 outline-none space-y-4 mt-6">
              {activeCycle ? (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-white text-lg">{activeCycle.title}</h3>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-[#00F5C6]/50 text-[#00F5C6]">
                              {activeCycle.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-[#B0B6C1] mb-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{activeCycle.assignedTo} participants</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Due {new Date(activeCycle.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#B0B6C1]">Progress</span>
                              <span className="text-white">{activeCycle.completedBy} / {activeCycle.assignedTo} completed</span>
                            </div>
                            <div className="relative w-full overflow-hidden rounded-full h-2 bg-[#00F5C6]/20">
                              <div 
                                className="h-full transition-all bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]" 
                                style={{ width: `${(activeCycle.completedBy / activeCycle.assignedTo) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditClick(activeCycle)}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 border border-white/10 text-white hover:bg-white/5"
                          >
                            Edit
                          </button>
                          <Button variant="secondary">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[#B0B6C1] text-center py-8">No active assessments</p>
              )}
            </div>
          )}

          {/* Scheduled Tab Content */}
          {activeTab === 'scheduled' && (
            <div className="flex-1 outline-none space-y-4 mt-6">
              {draftAssessments.length > 0 ? (
                <div className="space-y-4">
                  {draftAssessments.map((assessment: Assessment) => (
                    <div key={assessment.id} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white text-lg mb-2">{assessment.title}</h3>
                              <p className="text-[#B0B6C1] text-sm">{assessment.description}</p>
                            </div>
                            <button 
                              onClick={() => handleEditClick(assessment)}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 border border-white/10 text-white hover:bg-white/5"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#B0B6C1] text-center py-8">No scheduled assessments</p>
              )}
            </div>
          )}

          {/* Completed Tab Content */}
          {activeTab === 'completed' && (
            <div className="flex-1 outline-none space-y-4 mt-6">
              {archivedAssessments.length > 0 ? (
                <div className="space-y-4">
                  {archivedAssessments.map((assessment: Assessment) => (
                    <div key={assessment.id} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white text-lg mb-2">{assessment.title}</h3>
                              <p className="text-[#B0B6C1] text-sm">{assessment.description}</p>
                            </div>
                            <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium border-white/20 text-white/60">
                              Archived
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#B0B6C1] text-center py-8">No completed assessments</p>
              )}
            </div>
          )}
        </div>

        {/* Pending Reviews */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F5C6]/20 to-[#00AEEF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-[rgba(255,255,255,0.04)] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#00F5C6]/30 transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg">Pending Reviews</h3>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 text-[#00F5C6] hover:text-[#00F5C6]/80">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-3">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <p className="text-white mb-1">{review.name}</p>
                      <p className="text-[#B0B6C1] text-sm">{review.role}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-white text-sm mb-1">{review.progress}% complete</p>
                        <div className="flex items-center gap-2 text-[#B0B6C1] text-xs">
                          <Clock className="w-3 h-3" />
                          <span>In {review.dueIn}</span>
                        </div>
                      </div>
                      <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all h-8 rounded-md gap-1.5 px-3 border border-[#00F5C6]/50 text-[#00F5C6] hover:bg-[#00F5C6]/10">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Modal */}
      <AssessmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        assessment={selectedAssessment}
        mode={modalMode}
      />
    </div>
  );
}
