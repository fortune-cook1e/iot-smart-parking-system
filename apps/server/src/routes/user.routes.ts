import { Router, type IRouter } from 'express';
import * as userController from '../controllers/user.controller';

const router: IRouter = Router();

// Create user
router.post('/', userController.createUserHandler);

// Login
router.post('/login', userController.loginHandler);

// Get all users
router.get('/', userController.getAllUsersHandler);

// Get user by ID
router.get('/:id', userController.getUserByIdHandler);

// Update user
router.put('/:id', userController.updateUserHandler);

// Delete user
router.delete('/:id', userController.deleteUserHandler);

export default router;
