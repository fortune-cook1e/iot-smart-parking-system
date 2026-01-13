import type { Request, Response, NextFunction } from 'express';
import {
  chatWithParkingAI,
  streamChatWithParkingAI,
  ParkingAnalysisContext,
  ChatMessage,
} from '../services/ai-chat.service';
import { AppError } from '../middleware/error.middleware';
import { ResponseCode } from '@iot-smart-parking-system/shared-schemas';

export const chatHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, context, conversationHistory } = req.body as {
      message: string;
      context: ParkingAnalysisContext;
      conversationHistory?: ChatMessage[];
    };

    if (!message || !context) {
      throw new AppError({
        message: 'Message and context are required',
        statusCode: 400,
        code: ResponseCode.FAILURE,
      });
    }

    const response = await chatWithParkingAI(message, context, conversationHistory || []);

    res.success({
      data: { response },
      message: 'AI response generated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const streamChatHandler = async (req: Request, res: Response) => {
  try {
    const { message, context, conversationHistory } = req.body as {
      message: string;
      context: ParkingAnalysisContext;
      conversationHistory?: ChatMessage[];
    };

    if (!message || !context) {
      throw new AppError({
        message: 'Message and context are required',
        statusCode: 400,
        code: ResponseCode.FAILURE,
      });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const stream = streamChatWithParkingAI(message, context, conversationHistory || []);

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    // For streaming, send error as SSE event
    res.write(`data: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
    res.end();
  }
};
