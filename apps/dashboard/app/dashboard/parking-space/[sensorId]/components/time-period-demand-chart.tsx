'use client';

import { IconDatabaseOff, IconTrendingUp } from '@tabler/icons-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export interface TimePeriodStat {
  name: string;
  range: string;
  hours: number[];
  demand: number;
  demandLevel: number;
  priceRecommendation: string;
}

interface TimePeriodDemandChartProps {
  loading: boolean;
  hasData: boolean;
  timePeriodStats: TimePeriodStat[];
}

export function TimePeriodDemandChart({
  loading,
  hasData,
  timePeriodStats,
}: TimePeriodDemandChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconTrendingUp className="h-5 w-5" />
          Time Period Demand Analysis
        </CardTitle>
        <CardDescription>
          Parking demand by time period - Higher demand suggests premium pricing
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : !hasData ? (
          <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-muted-foreground">
            <IconDatabaseOff className="h-12 w-12 opacity-20" />
            <p className="text-sm font-medium">No events data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {timePeriodStats.map(period => (
              <div key={period.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{period.name}</span>
                    <span className="text-muted-foreground text-xs">({period.range})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{period.demand} arrivals</span>
                    <Badge
                      variant={
                        period.priceRecommendation === 'Premium'
                          ? 'destructive'
                          : period.priceRecommendation === 'Standard'
                            ? 'default'
                            : 'secondary'
                      }
                      className="min-w-[70px] justify-center"
                    >
                      {period.priceRecommendation}
                    </Badge>
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full transition-all ${
                      period.priceRecommendation === 'Premium'
                        ? 'bg-red-500'
                        : period.priceRecommendation === 'Standard'
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${period.demandLevel}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
