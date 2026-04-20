/**
 * AssessmentModal Component
 * Modal for creating and editing assessments
 */

'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { assessmentSchema, type AssessmentFormData } from '../schemas/assessment.schema';
import type { Assessment } from '../types';

interface AssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AssessmentFormData) => void;
  assessment?: Assessment;
  mode: 'create' | 'edit';
}

export function AssessmentModal({
  open,
  onOpenChange,
  onSubmit,
  assessment,
  mode,
}: AssessmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      name: '',
      description: '',
      type: undefined,
      startDate: '',
      endDate: '',
      participants: '',
      status: 'draft',
    },
  });

  const selectedType = watch('type');
  const selectedParticipants = watch('participants');
  const selectedStatus = watch('status');

  // Populate form when editing
  useEffect(() => {
    if (assessment && mode === 'edit') {
      setValue('name', assessment.title);
      setValue('description', assessment.description);
      setValue('type', assessment.type);
      setValue('startDate', assessment.createdAt.split('T')[0]);
      setValue('endDate', assessment.updatedAt.split('T')[0]);
      setValue('participants', 'all'); // Default value
      setValue('status', assessment.status);
    } else {
      reset();
    }
  }, [assessment, mode, setValue, reset]);

  const handleFormSubmit = (data: AssessmentFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A0F1C] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            {mode === 'create' ? 'Create New Assessment' : 'Edit Assessment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          {/* Assessment Name */}
          <div>
            <Label htmlFor="name" className="text-white">
              Assessment Name
            </Label>
            <Input
              id="name"
              {...register('name')}
              className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-[#B0B6C1]"
              placeholder="e.g., Q4 2024 Performance Review"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-[#B0B6C1]"
              placeholder="Brief description of this assessment cycle"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-white">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
              {errors.startDate && (
                <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="endDate" className="text-white">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="mt-2 bg-white/5 border-white/10 text-white"
              />
              {errors.endDate && (
                <p className="text-red-400 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Assessment Type */}
          <div>
            <Label className="text-white">Assessment Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as any)}
            >
              <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0F1C] border-white/10">
                <SelectItem value="skill">Skill Assessment</SelectItem>
                <SelectItem value="performance">Performance Review</SelectItem>
                <SelectItem value="knowledge">Knowledge Check</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Participants */}
          <div>
            <Label className="text-white">Participants</Label>
            <Select
              value={selectedParticipants}
              onValueChange={(value) => setValue('participants', value)}
            >
              <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select participants" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0F1C] border-white/10">
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="engineering">Engineering Department</SelectItem>
                <SelectItem value="sales">Sales Department</SelectItem>
                <SelectItem value="marketing">Marketing Department</SelectItem>
                <SelectItem value="custom">Custom Selection</SelectItem>
              </SelectContent>
            </Select>
            {errors.participants && (
              <p className="text-red-400 text-sm mt-1">{errors.participants.message}</p>
            )}
          </div>

          {/* Status (only in edit mode) */}
          {mode === 'edit' && (
            <div>
              <Label className="text-white">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0F1C] border-white/10">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
            >
              {mode === 'create' ? 'Create Assessment' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
