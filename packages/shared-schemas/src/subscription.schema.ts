import { z } from 'zod';
import { ParkingSpaceSchema } from './parking-space.schema';

// Subscription response schema
export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  parkingSpaceId: z.string().uuid(),
  createdAt: z.date(),
  parkingSpace: ParkingSpaceSchema,
});

// Create subscription schema
export const CreateSubscriptionSchema = z.object({
  parkingSpaceId: z.string().uuid('Invalid parking space ID'),
});

// Subscription with parking space details
export const SubscriptionWithParkingSpaceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  parkingSpaceId: z.string().uuid(),
  createdAt: z.date(),
  parkingSpace: z.object({
    id: z.string().uuid(),
    sensorId: z.string(),
    description: z.string().nullable(),
    location: z.string(),
    isOccupied: z.boolean(),
    currentPrice: z.number(),
    updatedAt: z.date(),
  }),
});

// Type exports
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CreateSubscription = z.infer<typeof CreateSubscriptionSchema>;
export type SubscriptionWithParkingSpace = z.infer<typeof SubscriptionWithParkingSpaceSchema>;
