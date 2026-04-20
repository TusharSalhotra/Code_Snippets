'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Plus } from 'lucide-react';
import { FormModal } from '@/src/shared/components/FormModal';
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
import { Textarea } from '@/components/ui/textarea';
import { departmentSchema, DepartmentFormData } from '../schemas/department.schema';
import { Department } from '../types';

interface DepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DepartmentFormData) => void | Promise<void>;
  department?: Department | null;
  managers?: Array<{ id: string; name: string }>;
  isLoading?: boolean;
  mode?: 'add' | 'edit';
}

const defaultManagers = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Emily Rodriguez' },
  { id: '4', name: 'David Kim' },
];

export function DepartmentModal({
  open,
  onOpenChange,
  onSubmit,
  department,
  managers = defaultManagers,
  isLoading = false,
  mode = 'add',
}: DepartmentModalProps) {
  const isEditMode = mode === 'edit' || !!department;

  const form = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      description: '',
      manager: '',
      goals: '',
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

  const selectedManager = watch('manager');
  const selectedStatus = watch('status');

  // Populate form when department changes (edit mode)
  useEffect(() => {
    if (department && isEditMode) {
      setValue('name', department.name || '');
      setValue('description', department.description || '');
      setValue('manager', department.manager || '');
      setValue('goals', department.goals || '');
      // Only set status if it's 'active' or 'inactive', default to 'active' for 'archived'
      const validStatus = department.status === 'archived' ? 'inactive' : department.status;
      setValue('status', validStatus || 'active');
    } else if (!isEditMode) {
      reset();
    }
  }, [department, isEditMode, setValue, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data as DepartmentFormData);
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
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? 'Edit Department' : 'Add New Department'}
      description={
        isEditMode
          ? 'Update department information'
          : 'Create a new department in your organization'
      }
      width="xl"
      hideFooter
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          {/* Department Name */}
          <div>
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              placeholder="e.g., Engineering, Sales, Marketing"
              className="mt-2"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the department's role and responsibilities"
              className="mt-2 min-h-[100px]"
              {...register('description')}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Department Manager */}
          <div>
            <Label htmlFor="manager">Department Manager</Label>
            <Select
              value={selectedManager}
              onValueChange={(value: string) => setValue('manager', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select department manager" />
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

          {/* Department Goals */}
          <div>
            <Label htmlFor="goals">Department Goals (Optional)</Label>
            <Textarea
              id="goals"
              placeholder="Key objectives and goals for this department"
              className="mt-2 min-h-[80px]"
              {...register('goals')}
            />
          </div>

          {/* Status (only in edit mode) */}
          {isEditMode && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value: 'active' | 'inactive') => setValue('status', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isLoading}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
            >
              {isEditMode ? (
                <>
                  <Building className="w-4 h-4 mr-2" />
                  {isSubmitting || isLoading ? 'Updating...' : 'Update Department'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {isSubmitting || isLoading ? 'Creating...' : 'Create Department'}
                </>
              )}
            </Button>
          </div>
        </form>
      </FormModal>
    );
  }
