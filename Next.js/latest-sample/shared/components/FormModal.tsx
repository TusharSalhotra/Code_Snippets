'use client';

import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: ReactNode;
  isSubmitting?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  hideFooter?: boolean;
  customFooter?: ReactNode;
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  submitIcon,
  isSubmitting = false,
  width = 'md',
  hideFooter = false,
  customFooter,
}: FormModalProps) {
  const widthClasses = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-xl',
    '2xl': 'w-full max-w-2xl',
    '3xl': 'w-full max-w-3xl',
    '4xl': 'w-full max-w-4xl',
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`bg-[#0A0F1C] border-white/10 text-white ${widthClasses[width]}`}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-[#B0B6C1]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}

        {!hideFooter && (
          <DialogFooter>
            {customFooter || (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-white/10 text-white hover:bg-white/5"
                  disabled={isSubmitting}
                >
                  {cancelLabel}
                </Button>
                {onSubmit && (
                  <Button
                    type="submit"
                    onClick={onSubmit}
                    className="bg-gradient-to-r from-[#00F5C6] to-[#00AEEF] text-[#0A0F1C] hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {submitIcon}
                    {submitLabel}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
