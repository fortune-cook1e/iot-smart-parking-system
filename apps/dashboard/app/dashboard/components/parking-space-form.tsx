'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';

// Form validation schema
const formSchema = z.object({
  sensorId: z.string().min(1, 'Sensor ID is required').max(100),
  name: z.string().max(100).nullable(),
  description: z.string().max(500).nullable(),
  address: z.string().min(1, 'Address is required').max(500),
  latitude: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
  longitude: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
  isOccupied: z.boolean(),
  currentPrice: z.number().min(0, 'Price must be non-negative'),
});

type FormValues = z.infer<typeof formSchema>;

interface ParkingSpaceFormProps {
  initialData?: ParkingSpace | null;
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ParkingSpaceForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ParkingSpaceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          sensorId: initialData.sensorId,
          name: initialData.name,
          description: initialData.description,
          address: initialData.address,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          isOccupied: initialData.isOccupied,
          currentPrice: initialData.currentPrice,
        }
      : {
          sensorId: '',
          name: '',
          description: '',
          address: '',
          latitude: 0,
          longitude: 0,
          isOccupied: false,
          currentPrice: 0,
        },
  });

  const handleSubmit = async (data: FormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sensorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sensor ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter sensor ID" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter parking space name"
                  {...field}
                  value={field.value || ''}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description"
                  {...field}
                  value={field.value || ''}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.0"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="0.0"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="currentPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Price per hour in USD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isOccupied"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Is Occupied</FormLabel>
                <FormDescription>Mark this parking space as currently occupied</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
