import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '../types/response-code';

/**
 * Create a new user
 */
export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userData: CreateUserDto = req.body;

    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      throw new AppError(
        'Username, email, and password are required',
        400,
        ResponseCode.BAD_REQUEST
      );
    }

    const user = await userService.createUser(userData);
    res.status(201).success(user, 'User created successfully', ResponseCode.CREATED);
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
      throw new AppError('User not found', 404, ResponseCode.NOT_FOUND);
    }

    res.success(user, 'User retrieved successfully');
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
    res.success(result, 'Users retrieved successfully');
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
    const updateData: UpdateUserDto = req.body;

    const user = await userService.updateUser(id, updateData);
    res.success(user, 'User updated successfully', ResponseCode.UPDATED);
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
    res.success(null, 'User deleted successfully', ResponseCode.DELETED);
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
      throw new AppError('User not authenticated', 401, ResponseCode.UNAUTHORIZED);
    }

    const user = await userService.getUserById(req.user.userId);

    if (!user) {
      throw new AppError('User not found', 404, ResponseCode.NOT_FOUND);
    }

    res.success(user, 'Current user retrieved successfully');
  } catch (error) {
    next(error);
  }
}
