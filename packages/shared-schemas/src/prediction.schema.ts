import z from 'zod';

export const WeatherSchema = z.enum(['sunny', 'rainy', 'cloudy', 'snowy', 'windy']);

export const ModelOccupancyInputSchema = z.object({
  sensor_id: z.string(),
  is_weekend: z.number().min(0).max(1),
  hour: z.number().min(0).max(23),
  day_of_week: z.number().min(1).max(7),
  weather: WeatherSchema,
  minute_bucket: z.number().min(0).max(59),
});

export const BEOccupancyInputSchema = z.object({
  sensorId: z.string(),
  isWeekend: z.number().min(0).max(1),
  hour: z.number().min(0).max(23),
  dayOfWeek: z.number().min(1).max(7),
  weather: WeatherSchema,
  minuteBucket: z.number().min(0).max(59),
});

export const FEOccupancyInputSchema = BEOccupancyInputSchema.pick({
  sensorId: true,
}).extend({
  predictMinutesAhead: z.number().min(1).max(60),
  currentTime: z.number().optional(), // timestamp in milliseconds
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const OccupancyOutputSchema = z.object({
  occupancyProbability: z.number().min(0).max(1),
});

export type ModelOccupancyInput = z.infer<typeof ModelOccupancyInputSchema>;
export type FeOccupancyInput = z.infer<typeof FEOccupancyInputSchema>;
export type OccupancyOutput = z.infer<typeof OccupancyOutputSchema>;
export type Weather = z.infer<typeof WeatherSchema>;
