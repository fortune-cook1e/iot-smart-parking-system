import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';
import axios from 'axios';

/**
 * Webhook endpoint for IoT sensor updates
 * Sensors can POST their status to this endpoint
 * Based on FastAPI service in AI-ML/predict_service.py
 */

const AI_ML_SERVICE_URL = process.env.AI_ML_SERVICE_URL || 'http://localhost:3002';

export const availabilityPredictHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await axios.post(`${AI_ML_SERVICE_URL}/predict`, req.body);
    const data = response.data;

    console.log('Prediction response data:', data);

    res.success({
      data: data,
      message: 'Parking space status updated successfully',
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
