'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import type { Log } from './types';

interface ExportButtonProps {
  logs: Log[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ logs }) => {
  const handleExport = () => {
    if (logs.length === 0) {
      return;
    }

    const headers = 'ID,Category,Duration (s),Description';
    const rows = logs
      .map(log => {
        const durationInSeconds = (log.duration / 1000).toFixed(3);
        const description = `"${log.description.replace(/"/g, '""')}"`; // Escape quotes
        return [log.id, log.category, durationInSeconds, description].join(',');
      })
      .join('\n');

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.download = `time-study-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleExport} disabled={logs.length === 0} variant="secondary">
      <FileDown className="mr-2 h-4 w-4" />
      Export to CSV
    </Button>
  );
};

export default ExportButton;
