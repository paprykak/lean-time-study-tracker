'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Save, X } from 'lucide-react';
import type { Log, Category } from './types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

interface DataTableProps {
  logs: Log[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
  onUpdate: (id: number, description: string) => void;
}

const getBadgeVariant = (category: Category) => {
  switch (category) {
    case 'VA':
      return 'bg-va text-va-foreground hover:bg-va/90';
    case 'NNVA':
      return 'bg-nnva text-nnva-foreground hover:bg-nnva/90';
    case 'NVA':
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

const DataTable: React.FC<DataTableProps> = ({ logs, onDelete, onClearAll, onUpdate }) => {
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingText, setEditingText] = React.useState('');

  const handleEditClick = (log: Log) => {
    setEditingId(log.id);
    setEditingText(log.description);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleSaveClick = () => {
    if (editingId !== null) {
      onUpdate(editingId, editingText);
      handleCancelClick();
    }
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-card rounded-lg border border-dashed">
        <p className="text-muted-foreground">No time has been logged yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Start the timer and log an event to see it here.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Logged Events</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={logs.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all logged events.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearAll}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Duration (s)</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-auto text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map(log => {
              const isEditing = editingId === log.id;
              return (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{String(log.id).padStart(3, '0')}</TableCell>
                  <TableCell>
                    <Badge className={getBadgeVariant(log.category)}>{log.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {(log.duration / 1000).toFixed(2)}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {isEditing ? (
                      <Input 
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveClick();
                          if (e.key === 'Escape') handleCancelClick();
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="text-muted-foreground truncate">{log.description || '-'}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={handleSaveClick}>
                          <Save className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelClick}>
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(log)}>
                          <Edit className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Edit log</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(log.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Delete log</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
