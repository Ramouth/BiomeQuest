import express from 'express';
import {
  logConsumption,
  getConsumptionHistory,
  getConsumedPlants,
  getStats
} from '../controllers/consumptionController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.post('/log', authenticate, logConsumption);
router.get('/history', authenticate, getConsumptionHistory);
router.get('/plants', authenticate, getConsumedPlants);
router.get('/stats', authenticate, getStats);

export default router;
