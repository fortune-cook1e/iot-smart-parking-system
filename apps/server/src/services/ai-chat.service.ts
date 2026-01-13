import ollama from 'ollama';

// const ollama = new Ollama({
//   host: process.env.OLLAMA_HOST || 'http://localhost:11434',
// });

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
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const buildSystemPrompt = (context: ParkingAnalysisContext): string => {
  return `You are an AI assistant specialized in parking lot management and dynamic pricing strategies. 
You have access to the following parking data for "${context.parkingSpaceName}" (Sensor ID: ${context.sensorId}) from ${context.dateRange}:

## Current Pricing
- Current Price: ${context.currentPrice.toFixed(2)} SEK/hour

## Summary Statistics
- Total Events: ${context.totalEvents}
- Vehicle Arrivals (Occupied): ${context.totalOccupied}
- Vehicle Departures (Available): ${context.totalAvailable}
- Average Events per Day: ${context.avgEventsPerDay}
- Overall Occupancy Rate: ${context.occupancyRate}%

## Time Period Demand Analysis
${context.timePeriodStats.map(p => `- ${p.name} (${p.range}): ${p.demand} arrivals, Demand Level: ${p.demandLevel}%, Current Recommendation: ${p.priceRecommendation}`).join('\n')}

## Hourly Demand Pattern (Top Hours)
${context.hourlyStats
  .filter(h => h.demand > 0)
  .sort((a, b) => b.demand - a.demand)
  .slice(0, 10)
  .map(h => `- ${h.hour}: ${h.demand} arrivals (${h.priceHint} demand)`)
  .join('\n')}

Based on this data, provide helpful recommendations for dynamic pricing strategies, pricing optimization, and parking management. 
Be specific with your recommendations, including suggested price ranges and time-based pricing tiers.
Always respond in English.`;
};

export const chatWithParkingAI = async (
  userMessage: string,
  context: ParkingAnalysisContext,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  const systemPrompt = buildSystemPrompt(context);

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    })),
    { role: 'user' as const, content: userMessage },
  ];

  try {
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'gpt-oss:latest',
      messages,
      options: {
        temperature: 0.7,
        num_predict: 2048,
      },
    });

    return response.message.content;
  } catch (error) {
    console.error('Ollama chat error:', error);
    throw new Error('Failed to get AI response. Please check if Ollama is running.');
  }
};

export const streamChatWithParkingAI = async function* (
  userMessage: string,
  context: ParkingAnalysisContext,
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<string> {
  const systemPrompt = buildSystemPrompt(context);

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
    })),
    { role: 'user' as const, content: userMessage },
  ];

  try {
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'gpt-oss:latest',
      messages,
      stream: true,
      options: {
        temperature: 0.7,
        num_predict: 2048,
      },
    });

    for await (const chunk of response) {
      if (chunk.message?.content) {
        yield chunk.message.content;
      }
    }
  } catch (error) {
    console.error('Ollama stream error:', error);
    throw new Error('Failed to get AI response. Please check if Ollama is running.');
  }
};
