'use client';

import { useState } from 'react';
import { Upload, UserPlus } from 'lucide-react';
import { UserTable } from '../components/user-table';
import { SearchBar, Button } from '@/src/shared/components';
import { UserDetailsDrawer } from '../components/user-details-drawer';
import { AddUserModal } from '../components/add-user-modal';
import { EditUserModal, EditUserFormData } from '../components/edit-user-modal';
import { User, CreateUserInput } from '../types';
import { useUsersStore } from '@/src/store/useUsersStore';

export function UsersPage() {
  const { users, addUser, updateUser } = useUsersStore();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsUserDrawerOpen(true);
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Handle search
  };

  const handleFilter = () => {
    console.log('Filter clicked');
    // Handle filter
  };

  const handleExport = () => {
    console.log('Export clicked');
    // Handle export
  };

  const handleImportCSV = () => {
    console.log('Import CSV clicked');
    // Handle CSV import
  };

  const handleAddUser = () => {
    setIsAddUserDialogOpen(true);
  };

  const handleUserSubmit = async (data: CreateUserInput) => {
    // Create user with Zustand store
    addUser({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: data.role,
      department: data.department,
      status: 'active',
      skillScore: 0,
    });
    console.log('User added:', data);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsUserDrawerOpen(false);
    setIsEditUserDialogOpen(true);
  };

  const handleDeactivateClick = (user: User) => {
    // Deactivate user - update status to inactive
    updateUser(user.id, {
      status: 'inactive',
    });
    console.log('User deactivated:', user.name);
  };

  const handleEditUserSubmit = async (data: EditUserFormData) => {
    if (!selectedUser) return;
    
    // Update user with Zustand store
    updateUser(selectedUser.id, {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: data.role,
      department: data.department,
      status: data.status,
    });
    
    console.log('User updated:', data);
    setIsEditUserDialogOpen(false);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl mb-2">Users & Teams</h1>
            <p className="text-[#B0B6C1]">Manage your organization's users and team structure</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={handleImportCSV}>
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
            <Button variant="secondary" onClick={handleAddUser}>
              <UserPlus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          onExport={handleExport}
          placeholder="Search users by name, email, or role..."
        />

        {/* Users Table */}
        <UserTable 
          users={users} 
          onUserClick={handleUserClick}
          onEditClick={handleEditClick}
          onDeactivateClick={handleDeactivateClick}
        />

        {/* Add User Modal */}
        <AddUserModal
          open={isAddUserDialogOpen}
          onOpenChange={setIsAddUserDialogOpen}
          onSubmit={handleUserSubmit}
        />

        {/* Edit User Modal */}
        <EditUserModal
          open={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
          onSubmit={handleEditUserSubmit}
          user={selectedUser}
        />

        {/* User Details Drawer */}
        <UserDetailsDrawer
          user={selectedUser}
          open={isUserDrawerOpen}
          onOpenChange={setIsUserDrawerOpen}
          onEditClick={handleEditClick}
        />
      </div>
    </div>
  );
}
