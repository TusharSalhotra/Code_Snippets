'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUserSchema, CreateUserFormData } from '@/src/modules/users/schemas/user.schema';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateUserFormData) => void | Promise<void>;
  departments?: string[];
  roles?: string[];
  managers?: Array<{ id: string; name: string }>;
  isLoading?: boolean;
  showInviteNotice?: boolean;
}

const defaultDepartments = [
  'Engineering',
  'Product',
  'Design',
  'HR',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
];

const defaultRoles = [
  'Engineering Manager',
  'Senior Developer',
  'Product Manager',
  'UX Designer',
  'HR Specialist',
  'Sales Lead',
  'Marketing Manager',
  'Finance Analyst',
];

const defaultManagers = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Emily Rodriguez' },
  { id: '4', name: 'David Kim' },
];

export function AddUserModal({
  open,
  onOpenChange,
  onSubmit,
  departments = defaultDepartments,
  roles = defaultRoles,
  managers = defaultManagers,
  isLoading = false,
  showInviteNotice = true,
}: AddUserModalProps) {
  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: '',
      manager: '',
      sendInvite: true,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = form;

  const selectedDepartment = watch('department');
  const selectedRole = watch('role');
  const selectedManager = watch('manager');

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data as CreateUserFormData);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Add a new team member to your organization
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#00F5C6]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="mt-2"
                  {...register('firstName')}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="mt-2"
                  {...register('lastName')}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B6C1]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  className="pl-10"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Work Information Section */}
          <div className="space-y-4">
            <h3 className="text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#00AEEF]" />
              Work Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={(value: string) => setValue('department', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value: string) => setValue('role', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="manager">Manager</Label>
              <Select
                value={selectedManager}
                onValueChange={(value: string) => setValue('manager', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invitation Notice */}
          {showInviteNotice && (
            <div className="p-4 rounded-lg bg-[#00F5C6]/10 border border-[#00F5C6]/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5C6] to-[#00AEEF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm mb-1">Send Invitation Email</p>
                  <p className="text-[#B0B6C1] text-xs">
                    The user will receive an email to set up their account and complete onboarding
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              <User className="w-4 h-4 mr-2" />
              {isSubmitting || isLoading ? 'Adding...' : 'Add User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
