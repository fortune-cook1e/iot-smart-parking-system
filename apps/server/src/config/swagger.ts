import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT Smart Parking System API',
      version: '1.0.0',
      description: 'API documentation for IoT Smart Parking System',
      contact: {
        name: 'API Support',
        email: 'support@parking.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.parking.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        // Response codes
        ResponseCode: {
          type: 'integer',
          enum: [
            10000, 10001, 10002, 10003, 40000, 40001, 40002, 40003, 40004, 40005, 40009, 40010,
            50000, 50001, 50002,
          ],
          description:
            'Response codes: 10000-SUCCESS, 10001-CREATED, 10002-UPDATED, 10003-DELETED, 40000-BAD_REQUEST, 40001-UNAUTHORIZED, 40002-TOKEN_EXPIRED, 40003-TOKEN_INVALID, 40004-FORBIDDEN, 40005-NOT_FOUND, 40009-CONFLICT, 40010-VALIDATION_ERROR, 50000-INTERNAL_ERROR, 50001-DATABASE_ERROR, 50002-EXTERNAL_API_ERROR',
        },
        // Success Response
        SuccessResponse: {
          type: 'object',
          properties: {
            code: { $ref: '#/components/schemas/ResponseCode' },
            status: { type: 'string', enum: ['success'], example: 'success' },
            data: { type: 'object' },
            message: { type: 'string', example: 'Operation successful' },
          },
        },
        // Error Response
        ErrorResponse: {
          type: 'object',
          properties: {
            code: { $ref: '#/components/schemas/ResponseCode' },
            status: { type: 'string', enum: ['error'], example: 'error' },
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        // User
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'cm123abc456' },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Create User DTO
        CreateUserDto: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              example: 'john_doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              maxLength: 100,
              example: 'password123',
            },
          },
        },
        // Update User DTO
        UpdateUserDto: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              example: 'john_updated',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.new@example.com',
            },
            password: {
              type: 'string',
              minLength: 6,
              maxLength: 100,
              example: 'newpassword123',
            },
          },
        },
        // Login DTO
        LoginDto: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              example: 'password123',
            },
          },
        },
        // Login Response
        LoginResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifQ...',
            },
          },
        },
        // Parking Space
        ParkingSpace: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            sensorId: {
              type: 'string',
              example: 'SENSOR-001',
            },
            description: {
              type: 'string',
              nullable: true,
              example: 'Near entrance, close to elevator',
            },
            address: {
              type: 'string',
              example: 'Building A, Floor 1, Spot 15, Beijing SOHO, Chaoyang District, Beijing',
            },
            latitude: {
              type: 'number',
              format: 'double',
              example: 39.9175,
            },
            longitude: {
              type: 'number',
              format: 'double',
              example: 116.458,
            },
            isOccupied: {
              type: 'boolean',
              example: false,
            },
            currentPrice: {
              type: 'number',
              example: 5.5,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Create Parking Space DTO
        CreateParkingSpaceDto: {
          type: 'object',
          required: ['sensorId', 'address', 'latitude', 'longitude', 'currentPrice'],
          properties: {
            sensorId: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              example: 'SENSOR-001',
            },
            description: {
              type: 'string',
              maxLength: 500,
              example: 'Near entrance, close to elevator',
            },
            address: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
              example: 'Building A, Floor 1, Spot 15, Beijing SOHO, Chaoyang District, Beijing',
            },
            latitude: {
              type: 'number',
              format: 'double',
              minimum: -90,
              maximum: 90,
              example: 39.9175,
            },
            longitude: {
              type: 'number',
              format: 'double',
              minimum: -180,
              maximum: 180,
              example: 116.458,
            },
            isOccupied: {
              type: 'boolean',
              default: false,
              example: false,
            },
            currentPrice: {
              type: 'number',
              minimum: 0,
              example: 5.5,
            },
          },
        },
        // Update Parking Space DTO
        UpdateParkingSpaceDto: {
          type: 'object',
          properties: {
            sensorId: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
              example: 'SENSOR-002',
            },
            description: {
              type: 'string',
              maxLength: 500,
              nullable: true,
              example: 'Updated description',
            },
            address: {
              type: 'string',
              minLength: 1,
              maxLength: 500,
              example: 'Building B, Floor 2, Beijing',
            },
            latitude: {
              type: 'number',
              format: 'double',
              minimum: -90,
              maximum: 90,
              example: 39.92,
            },
            longitude: {
              type: 'number',
              format: 'double',
              minimum: -180,
              maximum: 180,
              example: 116.46,
            },
            isOccupied: {
              type: 'boolean',
              example: true,
            },
            currentPrice: {
              type: 'number',
              minimum: 0,
              example: 6.0,
            },
          },
        },
        // Subscription
        Subscription: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '660e8400-e29b-41d4-a716-446655440001',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              example: '770e8400-e29b-41d4-a716-446655440002',
            },
            parkingSpaceId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Subscription with Parking Space
        SubscriptionWithParkingSpace: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            parkingSpaceId: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            parkingSpace: {
              $ref: '#/components/schemas/ParkingSpace',
            },
          },
        },
        // Create Subscription DTO
        CreateSubscriptionDto: {
          type: 'object',
          required: ['parkingSpaceId'],
          properties: {
            parkingSpaceId: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Parking Spaces',
        description: 'Parking space management endpoints',
      },
      {
        name: 'Subscriptions',
        description: 'Parking space subscription endpoints for real-time notifications',
      },
      {
        name: 'IoT Sensors',
        description: 'IoT sensor webhook endpoints for status updates',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
