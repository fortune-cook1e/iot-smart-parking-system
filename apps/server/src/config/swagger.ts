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
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
