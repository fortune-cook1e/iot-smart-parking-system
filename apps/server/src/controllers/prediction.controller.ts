import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import {
  mappingWeatherCode,
  ResponseCode,
  FeOccupancyInput,
  ModelOccupancyInput,
} from '@iot-smart-parking-system/shared-schemas';
import axios from 'axios';
import { getCurrentWeather } from '../services/weather.service';

/**
 * Webhook endpoint for IoT sensor updates
 * Sensors can POST their status to this endpoint
 * Based on FastAPI service in AI-ML/service.py
 */

const AI_ML_SERVICE_URL = process.env.AI_ML_SERVICE_URL || 'http://localhost:3002';

export const occupancyPredictHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      sensorId,
      predictMinutesAhead,
      currentTime = Date.now(),
      latitude,
      longitude,
    } = req.body as FeOccupancyInput;
    const currentWeather = await getCurrentWeather({
      longitude,
      latitude,
    });

    const weather = mappingWeatherCode(currentWeather.weathercode);
    const current = new Date(currentTime);

    const predictTime = new Date(current.getTime() + predictMinutesAhead * 1000 * 60);
    const dayOfWeek = predictTime.getUTCDay();
    const hour = predictTime.getUTCHours();
    const minutes = predictTime.getUTCMinutes();

    // Prepare model input
    const modelBody: ModelOccupancyInput = {
      sensor_id: sensorId,
      is_weekend: dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0,
      hour,
      // For day_of_week, 0 = Monday, 6 = Sunday to adapt to model training
      day_of_week: dayOfWeek === 0 ? 6 : dayOfWeek - 1,
      weather,
      // discretize minutes into 10-minute buckets
      minute_bucket: Math.floor(minutes / 10) * 10,
    };

    const response = await axios.post(`${AI_ML_SERVICE_URL}/predictions/occupancy`, modelBody);
    // console.log('Prediction response data:', response.data);
    const { occupied_probability } = response.data;

    res.success({
      data: occupied_probability,
      message: 'Prediction successful',
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      next(
        new AppError({
          message: 'Parking space with the given sensorId not found',
          statusCode: 404,
          code: ResponseCode.NOT_FOUND,
        })
      );
    } else {
      next(error);
    }
  }
};
