import type { Request, Response, NextFunction } from 'express';
import * as parkingEventsService from '../services/parking-events.service';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';

export const getParkingEventsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sensorId } = req.params;

    if (!sensorId) {
      throw new AppError({
        message: 'Sensor ID is required',
        statusCode: 400,
        code: ResponseCode.FAILURE,
      });
    }

    const query = {
      sensorId,
      startTime: req.query.startTime ? new Date(req.query.startTime as string) : undefined,
      endTime: req.query.endTime ? new Date(req.query.endTime as string) : undefined,
      page: req.query.page ? +req.query.page : 1,
      pageSize: req.query.pageSize ? +req.query.pageSize : 20,
    };

    const result = await parkingEventsService.getParkingEvents(query);
    res.success({
      data: {
        events: result.data,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createParkingEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sensorId, eventType, eventTime, weather } = req.body;

    if (!sensorId || !eventType || !eventTime) {
      throw new AppError({
        message: 'sensorId, eventType, and eventTime are required',
        statusCode: 400,
        code: ResponseCode.FAILURE,
      });
    }

    const event = await parkingEventsService.createParkingEvent({
      sensorId,
      eventType,
      eventTime: new Date(eventTime),
      weather,
    });

    res.success({
      data: event,
      message: 'Parking event created successfully',
    });
  } catch (error) {
    next(error);
  }
};
