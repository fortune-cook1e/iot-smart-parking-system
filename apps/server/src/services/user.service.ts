import prisma from '../lib/prisma';
import { CreateUserDto, UpdateUserDto, UserResponse } from '../types/user.types';
import { generateSalt, hashPassword, verifyPassword } from '../utils/crypto';
import { AppError } from '../middleware/error.middleware';

/**
 * Create a new user
 */
export async function createUser(data: CreateUserDto): Promise<UserResponse> {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new AppError('User with this email or username already exists', 400);
  }

  // Generate salt and hash password
  const salt = generateSalt();
  const hashedPassword = hashPassword(data.password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      salt,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Get all users with pagination
 */
export async function getAllUsers(
  page: number = 1,
  limit: number = 10
): Promise<{ users: UserResponse[]; total: number; page: number; totalPages: number }> {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Update user
 */
export async function updateUser(id: string, data: UpdateUserDto): Promise<UserResponse> {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  // Check for duplicate username or email if being updated
  if (data.username || data.email) {
    const duplicate = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              data.username ? { username: data.username } : {},
              data.email ? { email: data.email } : {},
            ],
          },
        ],
      },
    });

    if (duplicate) {
      throw new AppError('Username or email already in use', 400);
    }
  }

  // Prepare update data
  const updateData: {
    username?: string;
    email?: string;
    password?: string;
    salt?: string;
  } = {};

  if (data.username) updateData.username = data.username;
  if (data.email) updateData.email = data.email;

  // If password is being updated, generate new salt and hash
  if (data.password) {
    const salt = generateSalt();
    updateData.password = hashPassword(data.password, salt);
    updateData.salt = salt;
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.delete({ where: { id } });
}

/**
 * Verify user credentials (for login)
 */
export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<UserResponse | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValidPassword = verifyPassword(password, user.salt, user.password);
  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
