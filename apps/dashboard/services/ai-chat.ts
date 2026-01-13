import { apiClient } from '../lib/request';

export interface ParkingAnalysisContext {
  sensorId: string;
  parkingSpaceName: string;
  currentPrice: number;
  dateRange: string;
  totalEvents: number;
  totalOccupied: number;
  totalAvailable: number;
  avgEventsPerDay: string;
  occupancyRate: string;
  timePeriodStats: Array<{
    name: string;
    range: string;
    demand: number;
    demandLevel: number;
    priceRecommendation: string;
  }>;
  hourlyStats: Array<{
    hour: string;
    demand: number;
    priceHint: string;
  }>;
  weekdayVsWeekend: {
    weekdayAvg: number;
    weekendAvg: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant'; // distinguish user and assistant messages
  content: string;
}

interface ChatResponse {
  response: string;
}

export const aiChatApi = {
  chat: async (
    message: string,
    context: ParkingAnalysisContext,
    conversationHistory?: ChatMessage[]
  ): Promise<string> => {
    const response = await apiClient.post<any, ChatResponse>('/ai-chat', {
      message,
      context,
      conversationHistory,
    });
    return response.response;
  },

  streamChat: async function* (
    message: string,
    context: ParkingAnalysisContext,
    conversationHistory?: ChatMessage[]
  ): AsyncGenerator<string> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai-chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        message,
        context,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to connect to AI service');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              yield data.content;
            }
            if (data.error) {
              throw new Error(data.error);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  },
};
