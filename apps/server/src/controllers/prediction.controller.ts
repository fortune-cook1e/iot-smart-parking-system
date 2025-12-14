import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs-node';
import { encodeWeather, getModel } from '../ml';

/**
 * Webhook endpoint for IoT sensor updates
 * Sensors can POST their status to this endpoint
 * Based on FastAPI service in AI-ML/predict_service.py
 */
export const availabilityPredictHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await axios.post('http://localhost:9000/predict', req.body);
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

export const occupancyPredictHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { hour, weekday, temp, weather, price, location_lat, location_lng } = req.body;
    const inputTensor = tf.tensor2d([
      [
        parseFloat(hour),
        parseFloat(weekday),
        parseFloat(temp),
        encodeWeather(weather),
        parseFloat(price),
        parseFloat(location_lat),
        parseFloat(location_lng),
      ],
    ]);
    const model = getModel();
    if (!model) {
      throw new AppError({
        message: 'ML model is not loaded',
        statusCode: 500,
        code: ResponseCode.INTERNAL_ERROR,
      });
    }

    const pred = model.predict(inputTensor);
    const occupied_probability = (await pred.array())[0][0];

    console.log('Occupancy Prediction response data:', occupied_probability);

    res.success({
      data: occupied_probability,
      message: 'Parking lot occupancy predicted successfully',
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      next(
        new AppError({
          message: 'Parking lot with the given ID not found',
          statusCode: 404,
          code: ResponseCode.NOT_FOUND,
        })
      );
    } else {
      next(error);
    }
  }
};
