'use client';

import { IconCar, IconParking } from '@tabler/icons-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface SummaryStats {
  totalOccupied: number;
  totalAvailable: number;
  totalEvents: number;
  avgEventsPerDay: string;
  occupancyRate: string;
}

interface SummaryCardsProps {
  loading: boolean;
  summaryStats: SummaryStats;
}

export function SummaryCards({ loading, summaryStats }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          <IconParking className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{summaryStats.totalEvents}</div>
              <p className="text-muted-foreground text-xs">
                Avg {summaryStats.avgEventsPerDay} events/day
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupied Events</CardTitle>
          <IconCar className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold text-red-600">{summaryStats.totalOccupied}</div>
              <p className="text-muted-foreground text-xs">Vehicle arrivals</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Events</CardTitle>
          <IconCar className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold text-green-600">{summaryStats.totalAvailable}</div>
              <p className="text-muted-foreground text-xs">Vehicle departures</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <Badge variant={Number(summaryStats.occupancyRate) > 50 ? 'destructive' : 'secondary'}>
            {summaryStats.occupancyRate}%
          </Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{summaryStats.occupancyRate}%</div>
              <p className="text-muted-foreground text-xs">Based on events ratio</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
