import { Router, type IRouter } from 'express';
import { login, register, logout } from '../controllers/authenticate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: IRouter = Router();

router.post('/login', login);
router.post('/register', register);

// Protected routes
router.post('/logout', authenticate, logout);
export default router;
