import z from 'zod';

export const predictionSchema = z.object({
  hour: z.number().min(0).max(23),
  day: z.number().min(1).max(7),
  weather: z.enum(['sunny', 'rainy', 'cloudy', 'snowy']),
  location: z.string().min(1).max(100),
  status: z.number().min(0).max(1), // 0 for available, 1 for occupied
});

export const PredictionInputSchema = predictionSchema.omit({ status: true });
export const PredictionOutputSchema = predictionSchema.pick({ status: true });

export type PredictionInput = z.infer<typeof PredictionInputSchema>;
export type PredictionOutput = z.infer<typeof PredictionOutputSchema>;
export type Prediction = z.infer<typeof predictionSchema>;
