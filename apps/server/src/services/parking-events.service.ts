import prisma from '../lib/prisma';

export interface QueryParkingEvents {
  sensorId: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  pageSize?: number;
}

export const getParkingEvents = async (query: QueryParkingEvents) => {
  const { sensorId, startTime, endTime, page = 1, pageSize = 20 } = query;

  const where: {
    sensorId: string;
    eventTime?: { gte?: Date; lte?: Date };
  } = {
    sensorId,
  };

  // Add time range filter if provided
  if (startTime || endTime) {
    where.eventTime = {};
    if (startTime) {
      where.eventTime.gte = startTime;
    }
    if (endTime) {
      where.eventTime.lte = endTime;
    }
  }

  const [events, total] = await Promise.all([
    prisma.parkingEvent.findMany({
      where,
      orderBy: { eventTime: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.parkingEvent.count({ where }),
  ]);

  return {
    data: events,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const createParkingEvent = async (data: {
  sensorId: string;
  eventType: string;
  eventTime: Date;
  weather?: string;
}) => {
  return await prisma.parkingEvent.create({
    data: {
      sensorId: data.sensorId,
      eventType: data.eventType,
      eventTime: data.eventTime,
      weather: data.weather,
    },
  });
};
