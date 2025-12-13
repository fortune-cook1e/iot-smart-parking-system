'use client';

import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { IconCircleCheckFilled, IconMapPin } from '@tabler/icons-react';
import type { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';

interface ParkingSpaceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingSpace: ParkingSpace | null;
}

export function ParkingSpaceDetailDialog({
  open,
  onOpenChange,
  parkingSpace,
}: ParkingSpaceDetailDialogProps) {
  if (!parkingSpace) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>{parkingSpace.name || 'Parking Space Details'}</DialogTitle>
          <DialogDescription>View detailed information about this parking space</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">Status</span>
            <Badge variant="outline" className="text-muted-foreground px-2">
              {parkingSpace.isOccupied ? (
                <>
                  <IconCircleCheckFilled className="mr-1 size-3 fill-red-500 dark:fill-red-400" />
                  Occupied
                </>
              ) : (
                <>
                  <IconCircleCheckFilled className="mr-1 size-3 fill-green-500 dark:fill-green-400" />
                  Available
                </>
              )}
            </Badge>
          </div>

          <Separator />

          {/* Sensor ID */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm font-medium">Sensor ID</span>
            <span className="text-sm">{parkingSpace.sensorId}</span>
          </div>

          {/* Description */}
          {parkingSpace.description && (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm font-medium">Description</span>
              <span className="text-sm">{parkingSpace.description}</span>
            </div>
          )}

          <Separator />

          {/* Address */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
              <IconMapPin className="size-4" />
              Address
            </span>
            <span className="text-sm">{parkingSpace.address}</span>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm font-medium">Latitude</span>
              <span className="text-sm">{parkingSpace.latitude.toFixed(6)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm font-medium">Longitude</span>
              <span className="text-sm">{parkingSpace.longitude.toFixed(6)}</span>
            </div>
          </div>

          <Separator />

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">Current Price</span>
            <span className="text-lg font-semibold">${parkingSpace.currentPrice.toFixed(2)}</span>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Created</span>
              <span className="text-xs">
                {format(new Date(parkingSpace.createdAt), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Last Updated</span>
              <span className="text-xs">
                {format(new Date(parkingSpace.updatedAt), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
