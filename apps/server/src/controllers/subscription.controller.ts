import type { Request, Response, NextFunction } from 'express';
import * as subscriptionService from '../services/subscription.service';
import { AppError } from '../middleware/error.middleware';

export const createSubscriptionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { parkingSpaceId } = req.body;

    const subscription = await subscriptionService.createSubscription(userId, parkingSpaceId);

    res.success({
      data: subscription,
      message: 'Subscribed to parking space successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriptionHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { parkingSpaceId } = req.params;

    await subscriptionService.deleteSubscription(userId, parkingSpaceId);

    res.success({
      data: null,
      message: 'Unsubscribed from parking space successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new AppError({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const userId = req.user!.userId;
    const subscriptions = await subscriptionService.getUserSubscriptions(userId);

    res.success({
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const checkSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { parkingSpaceId } = req.params;

    const isSubscribed = await subscriptionService.checkSubscription(userId, parkingSpaceId);

    res.success({
      data: { isSubscribed },
      message: 'Subscription status checked successfully',
    });
  } catch (error) {
    next(error);
  }
};
