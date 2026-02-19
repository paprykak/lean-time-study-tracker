'use client';

import { useState, useCallback } from 'react';
import type { Log, Category } from '@/components/lean-time-hub/types';
import Header from '@/components/lean-time-hub/Header';
import Stopwatch from '@/components/lean-time-hub/Stopwatch';
import Classification from '@/components/lean-time-hub/Classification';
import DataTable from '@/components/lean-time-hub/DataTable';
import Analytics from '@/components/lean-time-hub/Analytics';
import { Card, CardContent } from '@/components/ui/card';
import ExportButton from '@/components/lean-time-hub/ExportButton';

export default function Home() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [description, setDescription] = useState('');

  const handleStart = useCallback(() => setIsRunning(true), []);
  const handlePause = useCallback(() => setIsRunning(false), []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
  }, []);

  const handleLog = useCallback((category: Category) => {
    setLogs(prevLogs => [
      {
        id: prevLogs.length > 0 ? Math.max(...prevLogs.map(log => log.id)) + 1 : 1,
        category,
        duration: time,
        description,
      },
      ...prevLogs,
    ]);
    setTime(0);
    setDescription('');
  }, [time, description]);

  const handleDelete = useCallback((id: number) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
  }, []);

  const handleClearAll = useCallback(() => {
    setLogs([]);
    handleReset();
  }, [handleReset]);
  

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <Stopwatch
                  time={time}
                  setTime={setTime}
                  isRunning={isRunning}
                  onStart={handleStart}
                  onPause={handlePause}
                  onReset={handleReset}
                />
              </CardContent>
            </Card>

            <Classification
              description={description}
              setDescription={setDescription}
              onLog={handleLog}
              disabled={time === 0 && !isRunning}
            />

            <DataTable logs={logs} onDelete={handleDelete} onClearAll={handleClearAll} />

             {logs.length > 0 && (
              <div className="flex justify-end">
                <ExportButton logs={logs} />
              </div>
            )}
          </div>

          <aside className="lg:col-span-2 lg:sticky lg:top-8">
            <Analytics logs={logs} />
          </aside>
        </div>
      </main>
    </div>
  );
}
