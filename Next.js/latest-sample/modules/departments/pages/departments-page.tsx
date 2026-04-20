/**
 * DepartmentsPage Component
 * Main page for department management
 */

'use client';

import { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useDepartmentsStore } from '@/src/store/useDepartmentsStore';
import { DepartmentStats } from '../components/department-stats';
import { SearchBar } from '@/src/shared/components';
import { DepartmentCard } from '../components/department-card';
import { DepartmentModal } from '../components/department-modal';
import { getDepartmentStats } from '../lib/departments-helpers';
import { Department } from '../types';
import { DepartmentFormData } from '../schemas/department.schema';

export function DepartmentsPage() {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartmentsStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  
  const stats = getDepartmentStats(departments);

  // Filter departments based on search query
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (department: Department) => {
    setModalMode('edit');
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (department: Department) => {
    if (window.confirm(`Are you sure you want to delete ${department.name}?`)) {
      deleteDepartment(department.id);
    }
  };

  const handleSubmit = (data: DepartmentFormData) => {
    if (modalMode === 'edit' && selectedDepartment) {
      updateDepartment(selectedDepartment.id, data);
    } else {
      addDepartment({
        name: data.name,
        description: data.description,
        headOfDepartment: data.manager || 'Unassigned',
        headOfDepartmentId: data.manager || '0',
        manager: data.manager,
        managerName: data.manager,
        employeeCount: 0,
        kpiCount: 0,
        status: data.status || 'active',
        goals: data.goals,
      });
    }
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Departments</h1>
            <p className="text-[#B0B6C1]">Manage organizational departments and team structure</p>
          </div>
          <button 
            onClick={handleAddClick}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Add Department
          </button>
        </div>

        {/* Stats */}
        <DepartmentStats
          totalDepartments={stats.totalDepartments}
          activeDepartments={stats.activeDepartments}
          totalEmployees={stats.totalEmployees}
        />

  {/* Search Bar */}
  <SearchBar value={searchQuery} onChange={handleSearch} placeholder="Search departments..." />

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-[#B0B6C1] mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No departments found</h3>
            <p className="text-[#B0B6C1] mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first department'}
            </p>
          </div>
        )}
      </div>

      {/* Department Modal */}
      <DepartmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        department={selectedDepartment}
        mode={modalMode}
      />
    </div>
  );
}
