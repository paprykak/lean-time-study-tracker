'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Category } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ClassificationProps {
  description: string;
  setDescription: (desc: string) => void;
  onLog: (category: Category) => void;
  disabled: boolean;
}

const ClassificationButton: React.FC<{
  category: Category;
  colorClass: string;
  onClick: () => void;
  disabled: boolean;
}> = ({ category, colorClass, onClick, disabled }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={`flex-1 text-lg font-semibold py-6 transition-all duration-200 ease-in-out transform hover:scale-105 disabled:scale-100 disabled:bg-muted disabled:text-muted-foreground ${colorClass}`}
  >
    Log as {category}
  </Button>
);

const Classification: React.FC<ClassificationProps> = ({ description, setDescription, onLog, disabled }) => {
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  
  const handleLogClick = useCallback((category: Category) => {
    onLog(category);
  }, [onLog]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classify & Log</CardTitle>
        <CardDescription>Enter an optional task description and log the current time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Optional: Enter task description..."
            value={description}
            onChange={handleDescriptionChange}
            className="text-base py-6"
            aria-label="Task Description"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ClassificationButton
            category="VA"
            colorClass="bg-va text-va-foreground hover:bg-va/90"
            onClick={() => handleLogClick('VA')}
            disabled={disabled}
          />
          <ClassificationButton
            category="NNVA"
            colorClass="bg-nnva text-nnva-foreground hover:bg-nnva/90"
            onClick={() => handleLogClick('NNVA')}
            disabled={disabled}
          />
          <ClassificationButton
            category="NVA"
            colorClass="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => handleLogClick('NVA')}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Classification;
