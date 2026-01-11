import { Router, type IRouter } from 'express';
import * as parkingEventsController from '../controllers/parking-events.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: IRouter = Router();

/**
 * @swagger
 * /api/parking-events/{sensorId}:
 *   get:
 *     tags: [Parking Events]
 *     summary: Get parking events by sensor ID
 *     description: Retrieve parking events for a specific sensor with optional time range filter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The sensor ID to query events for
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time for filtering events (ISO 8601 format)
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time for filtering events (ISO 8601 format)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of parking events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           sensorId:
 *                             type: string
 *                           eventType:
 *                             type: string
 *                             enum: [occupied, available]
 *                           eventTime:
 *                             type: string
 *                             format: date-time
 *                           weather:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/:sensorId', authenticate, parkingEventsController.getParkingEventsHandler);

/**
 * @swagger
 * /api/parking-events:
 *   post:
 *     tags: [Parking Events]
 *     summary: Create a new parking event
 *     description: Record a new parking event (vehicle arrival or departure)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensorId
 *               - eventType
 *               - eventTime
 *             properties:
 *               sensorId:
 *                 type: string
 *                 description: The sensor ID
 *               eventType:
 *                 type: string
 *                 enum: [occupied, available]
 *                 description: Type of event
 *               eventTime:
 *                 type: string
 *                 format: date-time
 *                 description: Time when the event occurred
 *               weather:
 *                 type: string
 *                 description: Weather condition at the time of event
 *     responses:
 *       200:
 *         description: Parking event created successfully
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, parkingEventsController.createParkingEventHandler);

export default router;
