import { z } from 'zod';

// Parking space response schema
export const ParkingSpaceSchema = z.object({
  id: z.string().uuid(),
  sensorId: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  isOccupied: z.boolean(),
  currentPrice: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create parking space schema
export const CreateParkingSpaceSchema = z.object({
  sensorId: z.string().min(1, 'Sensor ID is required').max(100, 'Sensor ID is too long'),
  name: z.string().max(100, 'Name is too long').nullable(),
  description: z.string().max(500, 'Description is too long').optional(),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long'),
  latitude: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
  longitude: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
  isOccupied: z.boolean().default(false),
  currentPrice: z.number().min(0, 'Price must be non-negative'),
});

// Update parking space schema
export const UpdateParkingSpaceSchema = z
  .object({
    sensorId: z.string().min(1).max(100).optional(),
    name: z.string().max(100).optional().nullable(),
    description: z.string().max(500).optional().nullable(),
    address: z.string().min(1).max(500).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    isOccupied: z.boolean().optional(),
    currentPrice: z.number().min(0).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// Query parking spaces schema
export const QueryParkingSpacesSchema = z.object({
  isOccupied: z
    .string()
    .optional()
    .transform(val => (val === 'true' ? true : val === 'false' ? false : undefined)),
  address: z.string().optional(),
  name: z.string().optional(),
  latitude: z
    .string()
    .optional()
    .transform(val => (val ? parseFloat(val) : undefined)),
  longitude: z
    .string()
    .optional()
    .transform(val => (val ? parseFloat(val) : undefined)),
  radius: z
    .string()
    .optional()
    .transform(val => (val ? parseFloat(val) : undefined)), // Search radius in kilometers
  minPrice: z
    .string()
    .optional()
    .transform(val => (val ? parseFloat(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform(val => (val ? parseFloat(val) : undefined)),
  page: z
    .string()
    .optional()
    .default('1')
    .transform(val => parseInt(val, 10)),
  pageSize: z
    .string()
    .optional()
    .default('10')
    .transform(val => parseInt(val, 10)),
});

// Type exports
export type ParkingSpace = z.infer<typeof ParkingSpaceSchema>;
export type CreateParkingSpace = z.infer<typeof CreateParkingSpaceSchema>;
export type UpdateParkingSpace = z.infer<typeof UpdateParkingSpaceSchema>;
export type QueryParkingSpaces = z.infer<typeof QueryParkingSpacesSchema>;
