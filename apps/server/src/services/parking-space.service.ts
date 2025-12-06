import prisma from '../lib/prisma';
import {
  type CreateParkingSpace,
  type UpdateParkingSpace,
  type QueryParkingSpaces,
} from '@iot-smart-parking-system/shared-schemas';
import type { Prisma } from '@prisma/client';
import { notifyParkingSpaceUpdate } from '../config/socket';
import { AppError } from '../middleware/error.middleware';

export const createParkingSpace = async (data: CreateParkingSpace) => {
  const exisitingSpace = await prisma.parkingSpace.findUnique({
    where: { sensorId: data.sensorId },
  });

  if (exisitingSpace) {
    throw new AppError({
      message: 'Parking space with this sensor ID already exists',
      statusCode: 400,
    });
  }

  return await prisma.parkingSpace.create({
    data: {
      sensorId: data.sensorId,
      description: data.description,
      name: data.name ?? '',
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      isOccupied: data.isOccupied ?? false,
      currentPrice: data.currentPrice,
    },
  });
};

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getAllParkingSpaces = async (query: QueryParkingSpaces) => {
  const {
    isOccupied,
    address,
    latitude,
    longitude,
    radius,
    minPrice,
    maxPrice,
    name,
    page = 1,
    pageSize = 10,
  } = query;

  const where: Prisma.ParkingSpaceWhereInput = {};

  if (isOccupied !== undefined) {
    where.isOccupied = isOccupied;
  }

  if (address) {
    where.address = {
      contains: address,
      mode: 'insensitive',
    };
  }

  if (name) {
    where.name = {
      contains: name,
      mode: 'insensitive',
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.currentPrice = {};
    if (minPrice !== undefined) {
      where.currentPrice.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.currentPrice.lte = maxPrice;
    }
  }

  const skip = (page - 1) * pageSize;

  let parkingSpaces = await prisma.parkingSpace.findMany({
    // where,
    orderBy: {
      updatedAt: 'desc',
    },
  });

  // Filter by distance if latitude, longitude, and radius are provided
  if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
    parkingSpaces = parkingSpaces.filter(space => {
      const distance = calculateDistance(latitude, longitude, space.latitude, space.longitude);
      return distance <= radius;
    });
  }

  // Apply pagination after distance filtering
  const total = parkingSpaces.length;
  parkingSpaces = parkingSpaces.slice(skip, skip + pageSize);

  return {
    parkingSpaces,
    total,
    pageSize,
    page,
  };
};

export const getParkingSpaceById = async (id: string) => {
  return await prisma.parkingSpace.findUnique({
    where: { id },
  });
};

export const getParkingSpaceBySensorId = async (sensorId: string) => {
  return await prisma.parkingSpace.findUnique({
    where: { sensorId },
  });
};

export const updateParkingSpace = async (id: string, data: UpdateParkingSpace) => {
  return await prisma.parkingSpace.update({
    where: { id },
    data,
  });
};

export const deleteParkingSpace = async (id: string) => {
  return await prisma.parkingSpace.delete({
    where: { id },
  });
};

export const updateParkingSpaceStatus = async (
  sensorId: string,
  isOccupied: boolean,
  currentPrice?: number
) => {
  const updateData: Prisma.ParkingSpaceUpdateInput = {
    isOccupied,
    updatedAt: new Date(),
  };

  if (currentPrice !== undefined) {
    updateData.currentPrice = currentPrice;
  }

  const updatedSpace = await prisma.parkingSpace.update({
    where: { sensorId },
    data: updateData,
  });

  // Notify subscribers about the status change
  notifyParkingSpaceUpdate(updatedSpace.id, {
    id: updatedSpace.id,
    sensorId: updatedSpace.sensorId,
    address: updatedSpace.address,
    latitude: updatedSpace.latitude,
    longitude: updatedSpace.longitude,
    isOccupied: updatedSpace.isOccupied,
    currentPrice: updatedSpace.currentPrice,
    updatedAt: updatedSpace.updatedAt,
  });

  return updatedSpace;
};
