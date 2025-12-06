import { Router, type IRouter } from 'express';
import * as parkingSpaceController from '../controllers/parking-space.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: IRouter = Router();

/**
 * @swagger
 * /api/parking-spaces:
 *   get:
 *     tags: [Parking Spaces]
 *     summary: Get all parking spaces
 *     description: Retrieve a filtered and paginated list of parking spaces
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isOccupied
 *         schema:
 *           type: boolean
 *         description: Filter by occupied status
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Filter by address (partial match)
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *         description: User's current latitude (for nearby search)
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *         description: User's current longitude (for nearby search)
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Search radius in kilometers (requires latitude and longitude)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Parking spaces retrieved successfully
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
 *                         parkingSpaces:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ParkingSpace'
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     tags: [Parking Spaces]
 *     summary: Create a new parking space
 *     description: Create a new parking space (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateParkingSpaceDto'
 *     responses:
 *       201:
 *         description: Parking space created successfully
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', parkingSpaceController.getAllParkingSpacesHandler);
router.post('/', authenticate, parkingSpaceController.createParkingSpaceHandler);

/**
 * @swagger
 * /api/parking-spaces/{id}:
 *   get:
 *     tags: [Parking Spaces]
 *     summary: Get parking space by ID
 *     description: Retrieve a specific parking space by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parking space ID
 *     responses:
 *       200:
 *         description: Parking space retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ParkingSpace'
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
 *   put:
 *     tags: [Parking Spaces]
 *     summary: Update parking space
 *     description: Update parking space information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parking space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateParkingSpaceDto'
 *     responses:
 *       200:
 *         description: Parking space updated successfully
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
 *   delete:
 *     tags: [Parking Spaces]
 *     summary: Delete parking space
 *     description: Delete a parking space by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parking space ID
 *     responses:
 *       200:
 *         description: Parking space deleted successfully
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
 *         description: Parking space not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authenticate, parkingSpaceController.getParkingSpaceByIdHandler);
router.put('/:id', authenticate, parkingSpaceController.updateParkingSpaceHandler);
router.delete('/:id', authenticate, parkingSpaceController.deleteParkingSpaceHandler);

export default router;
