import { Router, type IRouter } from 'express';
import * as webhookController from '../controllers/webhook.controller';

const router: IRouter = Router();

/**
 * @swagger
 * /api/webhook:
 *   post:
 *     tags: [IoT Sensors]
 *     summary: IoT sensor webhook
 *     description: Endpoint for IoT sensors to report parking space status changes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensorId
 *               - isOccupied
 *             properties:
 *               sensorId:
 *                 type: string
 *                 example: SENSOR-001
 *               isOccupied:
 *                 type: boolean
 *                 example: true
 *               currentPrice:
 *                 type: number
 *                 example: 5.5
 *     responses:
 *       200:
 *         description: Parking space status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ParkingSpace'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Parking space not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/sensor', webhookController.sensorWebhookHandler);

export default router;
