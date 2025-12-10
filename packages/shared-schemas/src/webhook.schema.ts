import { ParkingSpaceSchema } from './parking-space.schema';
import { z } from 'zod';

export const WebhookSensorDataSchema = ParkingSpaceSchema.pick({
  isOccupied: true,
  sensorId: true,
}).extend({
  currentPrice: z.number().optional(),
});

export type WebhookSensorData = z.infer<typeof WebhookSensorDataSchema>;
