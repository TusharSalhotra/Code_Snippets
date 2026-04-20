'use client';

import { useEffect } from 'react';
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
import { z } from 'zod';

const editUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Invalid email address'),
  department: z.string().min(1, 'Department is required'),
  role: z.string().min(1, 'Role is required'),
  manager: z.string().optional(),
  status: z.enum(['active', 'pending', 'inactive']),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EditUserFormData) => void | Promise<void>;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'active' | 'pending' | 'inactive';
  } | null;
  departments?: string[];
  roles?: string[];
  managers?: Array<{ id: string; name: string }>;
  isLoading?: boolean;
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

export function EditUserModal({
  open,
  onOpenChange,
  onSubmit,
  user,
  departments = defaultDepartments,
  roles = defaultRoles,
  managers = defaultManagers,
  isLoading = false,
}: EditUserModalProps) {
  const form = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      role: '',
      manager: '',
      status: 'active' as const,
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
  const selectedStatus = watch('status');

  // Populate form when user changes
  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameParts] = user.name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      setValue('firstName', firstName || '');
      setValue('lastName', lastName || '');
      setValue('email', user.email);
      setValue('department', user.department);
      setValue('role', user.role);
      setValue('status', user.status);
    }
  }, [user, setValue]);

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data as EditUserFormData);
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

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and settings
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value: 'active' | 'pending' | 'inactive') => setValue('status', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-400 text-xs mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>

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
              {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
