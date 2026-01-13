'use client';

import { useEffect, useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { parkingSpaceApi } from '@/services/parking-space';
import { parkingEventsApi, ParkingEvent } from '@/services/parking-events';
import { ParkingSpace } from '@iot-smart-parking-system/shared-schemas';
import { ParkingAnalysisContext } from '@/services/ai-chat';
import { HourlyStat, TimePeriodStat } from '../components';

// Date range constants
const START_DATE = '2025-12-25';
const END_DATE = '2026-01-05';
const TOTAL_DAYS = 12;

interface SummaryStats {
  totalOccupied: number;
  totalAvailable: number;
  totalEvents: number;
  avgEventsPerDay: string;
  occupancyRate: string;
}

export function useParkingSpaceData(sensorId: string) {
  const [parkingSpace, setParkingSpace] = useState<ParkingSpace | null>(null);
  const [events, setEvents] = useState<ParkingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch parking space info
        const spaces = await parkingSpaceApi.getAllParkingSpaces();
        const space = spaces.parkingSpaces.find(s => s.sensorId === sensorId);
        setParkingSpace(space || null);

        // Fetch events
        const startTime = new Date(`${START_DATE}T00:00:00`);
        const endTime = new Date(`${END_DATE}T23:59:59`);

        const result = await parkingEventsApi.getParkingEvents(sensorId, {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          pageSize: 1000,
        });

        setEvents(result.events);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sensorId) {
      fetchData();
    }
  }, [sensorId]);

  // Process hourly statistics
  const hourlyStats = useMemo((): HourlyStat[] => {
    const hourlyDemand = new Array(24).fill(0);

    events.forEach(event => {
      const hour = parseISO(event.eventTime).getHours();
      if (event.eventType === 'occupied') {
        hourlyDemand[hour]++;
      }
    });

    const maxDemand = Math.max(...hourlyDemand, 1);

    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      demand: hourlyDemand[i],
      demandLevel: Math.round((hourlyDemand[i] / maxDemand) * 100),
      priceHint:
        hourlyDemand[i] / maxDemand > 0.7
          ? 'High'
          : hourlyDemand[i] / maxDemand > 0.3
            ? 'Medium'
            : 'Low',
    }));
  }, [events]);

  // Process time period summary
  const timePeriodStats = useMemo((): TimePeriodStat[] => {
    const periods = [
      { name: 'Early Morning', range: '00:00-06:00', hours: [0, 1, 2, 3, 4, 5], demand: 0 },
      { name: 'Morning Rush', range: '06:00-10:00', hours: [6, 7, 8, 9], demand: 0 },
      { name: 'Midday', range: '10:00-14:00', hours: [10, 11, 12, 13], demand: 0 },
      { name: 'Afternoon', range: '14:00-17:00', hours: [14, 15, 16], demand: 0 },
      { name: 'Evening Rush', range: '17:00-21:00', hours: [17, 18, 19, 20], demand: 0 },
      { name: 'Night', range: '21:00-24:00', hours: [21, 22, 23], demand: 0 },
    ];

    events.forEach(event => {
      if (event.eventType !== 'occupied') return;
      const hour = parseISO(event.eventTime).getHours();
      const period = periods.find(p => p.hours.includes(hour));
      if (period) {
        period.demand++;
      }
    });

    const maxDemand = Math.max(...periods.map(p => p.demand), 1);

    return periods.map(p => ({
      ...p,
      demandLevel: Math.round((p.demand / maxDemand) * 100),
      priceRecommendation:
        p.demand / maxDemand > 0.7
          ? 'Premium'
          : p.demand / maxDemand > 0.3
            ? 'Standard'
            : 'Economy',
    }));
  }, [events]);

  // Summary statistics
  const summaryStats = useMemo((): SummaryStats => {
    const totalOccupied = events.filter(e => e.eventType === 'occupied').length;
    const totalAvailable = events.filter(e => e.eventType === 'available').length;
    const totalEvents = events.length;
    const avgEventsPerDay = totalEvents / TOTAL_DAYS;

    return {
      totalOccupied,
      totalAvailable,
      totalEvents,
      avgEventsPerDay: avgEventsPerDay.toFixed(1),
      occupancyRate: totalEvents > 0 ? ((totalOccupied / totalEvents) * 100).toFixed(1) : '0',
    };
  }, [events]);

  // Build AI context for chat
  const aiContext = useMemo((): ParkingAnalysisContext => {
    let weekdayTotal = 0;
    let weekendTotal = 0;
    let weekdayDays = 0;
    let weekendDays = 0;

    const startDate = new Date(START_DATE);
    for (let i = 0; i < TOTAL_DAYS; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        weekdayDays++;
      }
    }

    events.forEach(event => {
      if (event.eventType !== 'occupied') return;
      const eventDate = parseISO(event.eventTime);
      const dayOfWeek = eventDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendTotal++;
      } else {
        weekdayTotal++;
      }
    });

    return {
      sensorId,
      parkingSpaceName: parkingSpace?.name || 'Parking Space',
      currentPrice: parkingSpace?.currentPrice || 0,
      dateRange: `${START_DATE} to ${END_DATE}`,
      totalEvents: summaryStats.totalEvents,
      totalOccupied: summaryStats.totalOccupied,
      totalAvailable: summaryStats.totalAvailable,
      avgEventsPerDay: summaryStats.avgEventsPerDay,
      occupancyRate: summaryStats.occupancyRate,
      timePeriodStats: timePeriodStats,
      hourlyStats: hourlyStats.map(h => ({
        hour: h.hour,
        demand: h.demand,
        priceHint: h.priceHint,
      })),
      weekdayVsWeekend: {
        weekdayAvg: weekdayDays > 0 ? weekdayTotal / weekdayDays : 0,
        weekendAvg: weekendDays > 0 ? weekendTotal / weekendDays : 0,
      },
    };
  }, [sensorId, parkingSpace, summaryStats, timePeriodStats, hourlyStats, events]);

  return {
    parkingSpace,
    events,
    loading,
    hourlyStats,
    timePeriodStats,
    summaryStats,
    aiContext,
    hasData: events.length > 0,
  };
}
