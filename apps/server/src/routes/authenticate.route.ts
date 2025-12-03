import { Router, type IRouter } from 'express';
import { signUp, signIn, signOut } from '../controllers/authenticate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: IRouter = Router();

router.get('/test', (_req, res) => {
  res.success({
    data: null,
    message: 'Authentication route is working',
  });
});
router.post('/sign-in', signIn);
router.post('/sign-up', signUp);

// Protected routes
router.post('/sign-out', authenticate, signOut);
export default router;
