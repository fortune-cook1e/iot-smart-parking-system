import { Router, type IRouter } from 'express';
import {
  availabilityPredictHandler,
  occupancyPredictHandler,
} from '../controllers/prediction.controller';

const router: IRouter = Router();

// based on FastAPI provided from AI/ML
router.post('/availability', availabilityPredictHandler);

// based on tensorflow
router.post('/occupancy', occupancyPredictHandler);
export default router;
