'use client';

import { IconDatabaseOff } from '@tabler/icons-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  occupied: {
    label: 'Occupied Events',
    color: 'hsl(0 84% 60%)', // Red for occupied
  },
  available: {
    label: 'Available Events',
    color: 'hsl(142 76% 36%)', // Green for available
  },
} satisfies ChartConfig;

export interface DailyStat {
  date: string;
  occupied: number;
  available: number;
  totalEvents: number;
}

interface DailyEventsChartProps {
  loading: boolean;
  hasData: boolean;
  dailyStats: DailyStat[];
}

export function DailyEventsChart({ loading, hasData, dailyStats }: DailyEventsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Parking Events</CardTitle>
        <CardDescription>
          Number of parking events per day (2025-12-25 to 2026-01-05)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : !hasData ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <IconDatabaseOff className="h-12 w-12 opacity-20" />
            <p className="text-sm font-medium">No events data</p>
            <p className="text-xs">No parking events recorded (2025-12-25 to 2026-01-05)</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="occupied" fill="var(--color-occupied)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="available" fill="var(--color-available)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
