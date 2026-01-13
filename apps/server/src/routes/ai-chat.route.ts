import { Router, type IRouter } from 'express';
import * as aiChatController from '../controllers/ai-chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: IRouter = Router();

/**
 * @swagger
 * /api/ai-chat:
 *   post:
 *     tags: [AI Chat]
 *     summary: Chat with AI for parking analysis
 *     description: Send a message to AI with parking context to get dynamic pricing recommendations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - context
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's question or request
 *               context:
 *                 type: object
 *                 description: Parking analysis context data
 *                 properties:
 *                   sensorId:
 *                     type: string
 *                   parkingSpaceName:
 *                     type: string
 *                   dateRange:
 *                     type: string
 *                   totalEvents:
 *                     type: number
 *                   totalOccupied:
 *                     type: number
 *                   totalAvailable:
 *                     type: number
 *                   avgEventsPerDay:
 *                     type: string
 *                   occupancyRate:
 *                     type: string
 *                   timePeriodStats:
 *                     type: array
 *                     items:
 *                       type: object
 *                   hourlyStats:
 *                     type: array
 *                     items:
 *                       type: object
 *                   weekdayVsWeekend:
 *                     type: object
 *               conversationHistory:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: AI response generated successfully
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, aiChatController.chatHandler);

/**
 * @swagger
 * /api/ai-chat/stream:
 *   post:
 *     tags: [AI Chat]
 *     summary: Stream chat with AI for parking analysis
 *     description: Send a message to AI and receive streaming response via SSE
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - context
 *             properties:
 *               message:
 *                 type: string
 *               context:
 *                 type: object
 *               conversationHistory:
 *                 type: array
 *     responses:
 *       200:
 *         description: SSE stream of AI response
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 */
router.post('/stream', authenticate, aiChatController.streamChatHandler);

export default router;
