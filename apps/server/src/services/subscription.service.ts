import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';

export const createSubscription = async (userId: string, parkingSpaceId: string) => {
  // Check if parking space exists
  const parkingSpace = await prisma.parkingSpace.findUnique({
    where: { id: parkingSpaceId },
  });

  if (!parkingSpace) {
    throw new AppError({
      message: 'Parking space not found',
      statusCode: 404,
      code: ResponseCode.NOT_FOUND,
    });
  }

  // Check if subscription already exists
  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      userId_parkingSpaceId: {
        userId,
        parkingSpaceId,
      },
    },
  });

  if (existingSubscription) {
    throw new AppError({
      message: 'Already subscribed to this parking space',
      statusCode: 400,
      code: ResponseCode.VALIDATION_ERROR,
    });
  }

  return await prisma.subscription.create({
    data: {
      userId,
      parkingSpaceId,
    },
    include: {
      parkingSpace: true,
    },
  });
};

export const deleteSubscription = async (userId: string, parkingSpaceId: string) => {
  try {
    await prisma.subscription.delete({
      where: {
        userId_parkingSpaceId: {
          userId,
          parkingSpaceId,
        },
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      throw new AppError({
        message: 'Subscription not found',
        statusCode: 404,
        code: ResponseCode.NOT_FOUND,
      });
    }
    throw error;
  }
};

export const getUserSubscriptions = async (userId: string) => {
  return await prisma.subscription.findMany({
    where: { userId },
    include: {
      parkingSpace: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getSubscriptionsByParkingSpace = async (parkingSpaceId: string) => {
  return await prisma.subscription.findMany({
    where: { parkingSpaceId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
};

export const checkSubscription = async (userId: string, parkingSpaceId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId_parkingSpaceId: {
        userId,
        parkingSpaceId,
      },
    },
  });

  return !!subscription;
};
