'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useRolesStore } from '@/src/store/useRolesStore';
import { RoleStats } from '../components/role-stats';
import { SearchBar } from '@/src/shared/components';
import { RoleCard } from '../components/role-card';
import { RoleModal } from '../components/role-modal';
import { Role } from '../types';
import { RoleFormData } from '../schemas/role.schema';

export function RolesPage() {
  const { roles, addRole, updateRole, deleteRole } = useRolesStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Filter roles based on search query
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleAddClick = () => {
    setModalMode('add');
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (role: Role) => {
    setModalMode('edit');
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    if (role.isSystem) {
      alert('System roles cannot be deleted');
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${role.name}?`)) {
      deleteRole(role.id);
    }
  };

  const handleSubmit = (data: RoleFormData) => {
    if (modalMode === 'edit' && selectedRole) {
      updateRole(selectedRole.id, {
        name: data.name,
        description: data.description,
        permissionIds: data.permissions,
        status: data.status,
      });
    } else {
      addRole({
        name: data.name,
        description: data.description,
        type: 'custom',
        userCount: 0,
        canEdit: true,
        canDelete: true,
        permissions: data.permissions.map((permId) => ({ name: permId, enabled: true })),
        permissionIds: data.permissions,
        status: data.status || 'active',
      });
    }
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  // Calculate stats
  const totalRoles = filteredRoles.length;
  const systemRoles = filteredRoles.filter((r) => r.type === 'system').length;
  const customRoles = filteredRoles.filter((r) => r.type === 'custom').length;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Roles & Permissions</h1>
            <p className="text-[#B0B6C1]">
              Manage user roles and access control
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Create Role
          </button>
        </div>

        {/* Stats */}
        <RoleStats 
          totalRoles={totalRoles}
          systemRoles={systemRoles}
          customRoles={customRoles}
        />

  {/* Search Bar */}
  <SearchBar onSearch={handleSearch} placeholder="Search roles..." />

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-lg font-semibold mb-2">No roles found</div>
            <p className="text-[#B0B6C1]">
              {searchQuery
                ? 'Try adjusting your search'
                : 'Get started by creating your first role'}
            </p>
          </div>
        )}
      </div>

      {/* Role Modal */}
      <RoleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSubmit}
        role={selectedRole}
        mode={modalMode}
      />
    </div>
  );
}

