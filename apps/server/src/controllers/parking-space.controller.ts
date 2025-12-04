import type { Request, Response, NextFunction } from 'express';
import * as parkingSpaceService from '../services/parking-space.service';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';

export const createParkingSpaceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parkingSpace = await parkingSpaceService.createParkingSpace(req.body);
    res.success({
      data: parkingSpace,
      message: 'Parking space created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllParkingSpacesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      page: +req.query.page! || 1,
      pageSize: +req.query.pageSize! || 10,
      address: req.query.address as string | undefined,
      latitude: req.query.latitude ? +req.query.latitude : undefined,
      longitude: req.query.longitude ? +req.query.longitude : undefined,
      radius: req.query.radius ? +req.query.radius : undefined,
      isOccupied:
        req.query.isOccupied === 'true'
          ? true
          : req.query.isOccupied === 'false'
            ? false
            : undefined,
      minPrice: req.query.minPrice ? +req.query.minPrice : undefined,
      maxPrice: req.query.maxPrice ? +req.query.maxPrice : undefined,
    };

    const result = await parkingSpaceService.getAllParkingSpaces(query);
    res.success({ data: result });
  } catch (error) {
    next(error);
  }
};

export const getParkingSpaceByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parkingSpace = await parkingSpaceService.getParkingSpaceById(req.params.id);

    if (!parkingSpace) {
      throw new AppError({
        message: 'Parking space not found',
        statusCode: 404,
        code: ResponseCode.NOT_FOUND,
      });
    }

    res.success({ data: parkingSpace });
  } catch (error) {
    next(error);
  }
};

export const updateParkingSpaceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parkingSpace = await parkingSpaceService.updateParkingSpace(req.params.id, req.body);
    res.success({
      data: parkingSpace,
      message: 'Parking space updated successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      next(
        new AppError({
          message: 'Parking space not found',
          statusCode: 404,
          code: ResponseCode.NOT_FOUND,
        })
      );
    } else {
      next(error);
    }
  }
};

export const deleteParkingSpaceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await parkingSpaceService.deleteParkingSpace(req.params.id);
    res.success({
      data: null,
      message: 'Parking space deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      next(
        new AppError({
          message: 'Parking space not found',
          statusCode: 404,
        })
      );
    } else {
      next(error);
    }
  }
};
