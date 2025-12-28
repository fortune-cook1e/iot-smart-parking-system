import { Router, type IRouter } from 'express';
import { occupancyPredictHandler } from '../controllers/prediction.controller';

const router: IRouter = Router();

// based on FastAPI provided from AI/ML
router.post('/occupancy', occupancyPredictHandler);

export default router;
