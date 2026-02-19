'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, RotateCcw } from 'lucide-react';

type StopwatchProps = {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor(time % 1000);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(
    milliseconds
  ).padStart(3, '0')}`;
};

const Stopwatch: React.FC<StopwatchProps> = ({
  time,
  setTime,
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(function tick(now) {
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;
        setTime(prevTime => prevTime + delta);
        rafRef.current = requestAnimationFrame(tick);
      });
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, setTime]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        className="text-6xl md:text-8xl font-mono text-center text-foreground font-bold tracking-tighter"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(time)}
      </div>
      <div className="flex items-center justify-center gap-4">
        {isRunning ? (
          <Button onClick={onPause} size="lg" variant="outline">
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </Button>
        ) : (
          <Button onClick={onStart} size="lg" className="bg-primary hover:bg-primary/90">
            <Play className="mr-2 h-5 w-5" />
            Start
          </Button>
        )}
        <Button onClick={onReset} size="lg" variant="ghost">
          <RotateCcw className="mr-2 h-5 w-5" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Stopwatch;
