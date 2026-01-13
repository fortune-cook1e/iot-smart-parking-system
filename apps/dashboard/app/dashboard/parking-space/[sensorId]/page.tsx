'use client';

import { useParams, useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useParkingSpaceData } from './hooks/use-parking-space-data';
import { SummaryCards, TimePeriodDemandChart, HourlyDemandChart } from './components';
import { AIChatPanel } from './ai-chat-panel';

export default function ParkingSpaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sensorId = params.sensorId as string;

  const { parkingSpace, loading, hourlyStats, timePeriodStats, summaryStats, aiContext, hasData } =
    useParkingSpaceData(sensorId);

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <IconArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {loading ? (
                    <Skeleton className="h-8 w-48" />
                  ) : (
                    parkingSpace?.name || 'Parking Space'
                  )}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Sensor ID: {sensorId} · 2025-12-25 to 2026-01-05
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <SummaryCards loading={loading} summaryStats={summaryStats} />

            {/* Time Period Demand Summary */}
            <TimePeriodDemandChart
              loading={loading}
              hasData={hasData}
              timePeriodStats={timePeriodStats}
            />

            {/* Hourly Demand Pattern */}
            <HourlyDemandChart loading={loading} hasData={hasData} hourlyStats={hourlyStats} />
          </div>
        </div>

        {/* AI Chat Floating Panel */}
        {!loading && hasData && <AIChatPanel context={aiContext} />}
      </SidebarInset>
    </SidebarProvider>
  );
}
