'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { kpiSchema, KPIFormData } from '../schemas/kpi.schema';
import { KPI } from '../types';

interface KPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: KPIFormData) => void | Promise<void>;
  kpi?: KPI | null;
  isLoading?: boolean;
  mode?: 'add' | 'edit';
}

const TOTAL_STEPS = 4;

const departments = [
  { id: '1', name: 'Engineering' },
  { id: '2', name: 'Product' },
  { id: '3', name: 'Design' },
  { id: '4', name: 'Sales' },
  { id: '5', name: 'Marketing' },
];

const owners = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Emily Rodriguez' },
  { id: '4', name: 'David Kim' },
];

export function KPIModal({
  open,
  onOpenChange,
  onSubmit,
  kpi,
  isLoading = false,
  mode = 'add',
}: KPIModalProps) {
  const isEditMode = mode === 'edit' || !!kpi;
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<KPIFormData>({
    resolver: zodResolver(kpiSchema),
    defaultValues: {
      name: '',
      description: '',
      formula: '',
      type: 'number',
      frequency: 'monthly',
      target: 0,
      unit: '',
      department: '',
      owner: '',
      status: 'active',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    trigger,
  } = form;

  const watchedType = watch('type');
  const watchedFrequency = watch('frequency');
  const watchedDepartment = watch('department');
  const watchedOwner = watch('owner');
  const watchedStatus = watch('status');

  // Populate form when KPI changes (edit mode)
  useEffect(() => {
    if (kpi && isEditMode) {
      setValue('name', kpi.name || '');
      setValue('description', kpi.description || '');
      setValue('formula', kpi.formula || '');
      setValue('type', kpi.type || 'number');
      setValue('frequency', kpi.frequency || 'monthly');
      setValue('target', kpi.target || 0);
      setValue('unit', kpi.unit || '');
      setValue('department', kpi.department || '');
      setValue('owner', kpi.owner || '');
      setValue('status', kpi.status || 'active');
    } else if (!isEditMode) {
      reset();
      setCurrentStep(1);
    }
  }, [kpi, isEditMode, setValue, reset]);

  const handleFormSubmit = async (data: KPIFormData) => {
    try {
      await onSubmit(data);
      reset();
      setCurrentStep(1);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setCurrentStep(1);
    onOpenChange(false);
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof KPIFormData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['name', 'description', 'formula'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['type', 'frequency'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['target'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {[1, 2, 3, 4].map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= currentStep
                ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-white'
                : 'bg-white/10 text-[#B0B6C1]'
            }`}
          >
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {index < 3 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                step < currentStep ? 'bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]' : 'bg-white/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">KPI Name</Label>
        <Input
          id="name"
          placeholder="e.g., Customer Satisfaction Score"
          className="mt-2"
          {...register('name')}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of this KPI"
          className="mt-2 min-h-[80px]"
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="formula">Formula</Label>
        <Input
          id="formula"
          placeholder="e.g., (Resolved Tickets / Total Tickets) * 100"
          className="mt-2"
          {...register('formula')}
          aria-invalid={!!errors.formula}
        />
        {errors.formula && (
          <p className="text-red-400 text-xs mt-1">{errors.formula.message}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">KPI Type</Label>
        <Select
          value={watchedType}
          onValueChange={(value: any) => setValue('type', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select KPI type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="currency">Currency</SelectItem>
            <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="frequency">Measurement Frequency</Label>
        <Select
          value={watchedFrequency}
          onValueChange={(value: any) => setValue('frequency', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
        {errors.frequency && (
          <p className="text-red-400 text-xs mt-1">{errors.frequency.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="unit">Unit (Optional)</Label>
        <Input
          id="unit"
          placeholder="e.g., %, $, tickets, users"
          className="mt-2"
          {...register('unit')}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="target">Target Value</Label>
        <Input
          id="target"
          type="number"
          placeholder="Enter target value"
          className="mt-2"
          {...register('target', { valueAsNumber: true })}
          aria-invalid={!!errors.target}
        />
        {errors.target && (
          <p className="text-red-400 text-xs mt-1">{errors.target.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="department">Department (Optional)</Label>
        <Select
          value={watchedDepartment}
          onValueChange={(value: string) => setValue('department', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="owner">Owner (Optional)</Label>
        <Select
          value={watchedOwner}
          onValueChange={(value: string) => setValue('owner', value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select owner" />
          </SelectTrigger>
          <SelectContent>
            {owners.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
        <h3 className="text-white font-medium mb-4">Review KPI Details</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[#B0B6C1] text-sm">Name</p>
            <p className="text-white">{watch('name') || '-'}</p>
          </div>
          <div>
            <p className="text-[#B0B6C1] text-sm">Type</p>
            <p className="text-white capitalize">{watch('type')}</p>
          </div>
          <div>
            <p className="text-[#B0B6C1] text-sm">Frequency</p>
            <p className="text-white capitalize">{watch('frequency')}</p>
          </div>
          <div>
            <p className="text-[#B0B6C1] text-sm">Target</p>
            <p className="text-white">{watch('target')}{watch('unit') && ` ${watch('unit')}`}</p>
          </div>
        </div>

        <div>
          <p className="text-[#B0B6C1] text-sm">Formula</p>
          <p className="text-white">{watch('formula')}</p>
        </div>

        <div>
          <p className="text-[#B0B6C1] text-sm">Description</p>
          <p className="text-white">{watch('description')}</p>
        </div>
      </div>

      {isEditMode && (
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={watchedStatus}
            onValueChange={(value: any) => setValue('status', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit KPI' : `Create New KPI - Step ${currentStep} of ${TOTAL_STEPS}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
          {renderStepIndicator()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? handleCancel : handlePrevious}
              disabled={isSubmitting || isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || isLoading}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isEditMode ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {isSubmitting || isLoading ? 'Updating...' : 'Update KPI'}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {isSubmitting || isLoading ? 'Creating...' : 'Create KPI'}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
