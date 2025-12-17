import { Router, type IRouter } from 'express';
import { availabilityPredictHandler } from '../controllers/prediction.controller';

const router: IRouter = Router();

// based on FastAPI provided from AI/ML
router.post('/availability', availabilityPredictHandler);

export default router;
