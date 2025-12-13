'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ParkingSpaceForm } from './parking-space-form';
import { parkingSpaceApi } from '@/services/parking-space';
import type { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';

interface ParkingSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ParkingSpace | null;
  onSuccess: () => void;
}

export function ParkingSpaceDialog({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: ParkingSpaceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (initialData) {
        // Update existing parking space
        await parkingSpaceApi.updateParkingSpace(initialData.id, data);
        toast.success('Parking space updated successfully');
      } else {
        // Create new parking space
        await parkingSpaceApi.createParkingSpace(data);
        toast.success('Parking space created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save parking space');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-150">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Parking Space' : 'Create Parking Space'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the parking space information below.'
              : 'Fill in the details to create a new parking space.'}
          </DialogDescription>
        </DialogHeader>
        <ParkingSpaceForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
