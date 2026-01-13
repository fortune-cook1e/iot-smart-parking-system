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
  demand: {
    label: 'Parking Demand',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export interface HourlyStat {
  hour: string;
  demand: number;
  demandLevel: number;
  priceHint: string;
}

interface HourlyDemandChartProps {
  loading: boolean;
  hasData: boolean;
  hourlyStats: HourlyStat[];
}

export function HourlyDemandChart({ loading, hasData, hourlyStats }: HourlyDemandChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Demand Pattern</CardTitle>
        <CardDescription>
          Number of vehicle arrivals per hour - Identifies peak and off-peak hours for pricing
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
            <BarChart data={hourlyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} interval={2} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <div className="flex flex-col gap-1">
                        <span>{value} arrivals</span>
                        <span className="text-xs text-muted-foreground">
                          Price suggestion: {item.payload.priceHint}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="demand" fill="var(--color-demand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
