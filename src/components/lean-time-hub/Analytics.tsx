'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { Log } from './types';

interface AnalyticsProps {
  logs: Log[];
}

const chartConfig = {
  VA: { label: 'VA', color: 'hsl(120 50% 39%)' },
  NNVA: { label: 'NNVA', color: 'hsl(40 100% 60%)' },
  NVA: { label: 'NVA', color: 'hsl(0 63% 49%)' },
} satisfies ChartConfig;

const Analytics: React.FC<AnalyticsProps> = ({ logs }) => {
  const analyticsData = useMemo(() => {
    const totals = { VA: 0, NNVA: 0, NVA: 0 };
    logs.forEach(log => {
      totals[log.category] += log.duration;
    });

    const totalTime = totals.VA + totals.NNVA + totals.NVA;
    
    const chartData = [
      { name: 'Value Added (VA)', value: totals.VA, fill: 'var(--color-VA)' },
      { name: 'Necessary Non-Value Added (NNVA)', value: totals.NNVA, fill: 'var(--color-NNVA)' },
      { name: 'Non-Value Added (NVA)', value: totals.NVA, fill: 'var(--color-NVA)' },
    ].filter(d => d.value > 0);

    return {
      totalTime,
      vaPercent: totalTime > 0 ? (totals.VA / totalTime) * 100 : 0,
      nvaPercent: totalTime > 0 ? (totals.NVA / totalTime) * 100 : 0,
      chartData,
      totals,
    };
  }, [logs]);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>A summary of your time study.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4 text-center">Time Distribution</h4>
          {analyticsData.totalTime > 0 ? (
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <Tooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name, props) => (
                        <div className="flex flex-col">
                           <span>{props.payload.name}</span>
                           <span className="font-bold">{(Number(value) / 1000).toFixed(2)}s</span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={analyticsData.chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {analyticsData.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          ) : (
             <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                Log time to see chart
            </div>
          )}
        </div>

        <div className="space-y-4">
            <h4 className="font-semibold text-center border-b pb-2">Summary</h4>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Observed Time</span>
                <span className="font-bold font-mono">{(analyticsData.totalTime / 1000).toFixed(2)}s</span>
            </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Value Added %</span>
                <span className="font-bold text-va-default">{analyticsData.vaPercent.toFixed(1)}%</span>
            </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Non-Value Added %</span>
                <span className="font-bold text-destructive">{analyticsData.nvaPercent.toFixed(1)}%</span>
            </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default Analytics;
