import { Router, type IRouter } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: IRouter = Router();

// create a user
router.post('/', authenticate, userController.createUserHandler);

// Get current user profile
router.get('/me', authenticate, userController.getCurrentUserHandler);

// Get all users
router.get('/', authenticate, userController.getAllUsersHandler);

// Get user by ID
router.get('/:id', authenticate, userController.getUserByIdHandler);

// Update user
router.put('/:id', authenticate, userController.updateUserHandler);

// Delete user
router.delete('/:id', authenticate, userController.deleteUserHandler);

export default router;
