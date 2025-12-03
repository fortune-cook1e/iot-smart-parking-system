import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../middleware/error.middleware';
import {
  CreateUserSchema,
  ResponseCode,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserSchema,
} from '@iot-smart-parking-system/shared-schemas';

/**
 * Create a new user
 */
export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: CreateUserDto = CreateUserSchema.parse(req.body);

    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      throw new AppError({
        message: 'Username, email, and password are required',
        statusCode: 400,
        code: ResponseCode.BAD_REQUEST,
      });
    }

    const user = await userService.createUser(userData);
    res.status(201).success({
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get user by ID
 */
export async function getUserByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: 404,
        code: ResponseCode.NOT_FOUND,
      });
    }

    res.success({
      data: user,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users
 */
export async function getAllUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await userService.getAllUsers(page, limit);
    res.success({
      data: result,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update user
 */
export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData: UpdateUserDto = UpdateUserSchema.parse(req.body);

    const user = await userService.updateUser(id, updateData);
    res.success({
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete user
 */
export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.success({
      data: null,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current user profile (requires authentication)
 */
export async function getCurrentUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError({
        message: 'Unauthorized',
        statusCode: 401,
        code: ResponseCode.UNAUTHORIZED,
      });
    }

    const user = await userService.getUserById(req.user.userId);

    if (!user) {
      throw new AppError({
        message: 'User not found',
        statusCode: 404,
        code: ResponseCode.NOT_FOUND,
      });
    }

    res.success({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
