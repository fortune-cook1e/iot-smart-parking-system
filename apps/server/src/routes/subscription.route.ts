import { Router, type IRouter } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: IRouter = Router();

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Get user subscriptions
 *     description: Get all parking spaces the current user is subscribed to
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscriptions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SubscriptionWithParkingSpace'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags: [Subscriptions]
 *     summary: Subscribe to parking space
 *     description: Subscribe to receive notifications when a parking space becomes available
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubscriptionDto'
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SubscriptionWithParkingSpace'
 *       400:
 *         description: Bad request (already subscribed or invalid parking space)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
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
router.get('/', authenticate, subscriptionController.getUserSubscriptionsHandler);
router.post('/', authenticate, subscriptionController.createSubscriptionHandler);

/**
 * @swagger
 * /api/subscriptions/check/{parkingSpaceId}:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Check subscription status
 *     description: Check if the current user is subscribed to a specific parking space
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parkingSpaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Parking space ID
 *     responses:
 *       200:
 *         description: Subscription status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         isSubscribed:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/check/:parkingSpaceId', authenticate, subscriptionController.checkSubscriptionHandler);

/**
 * @swagger
 * /api/subscriptions/{parkingSpaceId}:
 *   delete:
 *     tags: [Subscriptions]
 *     summary: Unsubscribe from parking space
 *     description: Remove subscription to stop receiving notifications about a parking space
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: parkingSpaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Parking space ID
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Subscription not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:parkingSpaceId', authenticate, subscriptionController.deleteSubscriptionHandler);

export default router;
