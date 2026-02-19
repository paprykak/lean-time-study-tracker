'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSuggestions } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2 } from 'lucide-react';
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (value.trim().length >= 3) {
      setIsSuggesting(true);
      setPopoverOpen(true);
      debounceTimeout.current = setTimeout(async () => {
        const result = await getSuggestions(value);
        setSuggestions(result);
        setIsSuggesting(false);
      }, 500);
    } else {
      setSuggestions([]);
      setPopoverOpen(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setDescription(suggestion);
    setSuggestions([]);
    setPopoverOpen(false);
  };
  
  const handleLogClick = useCallback((category: Category) => {
    onLog(category);
    setSuggestions([]);
    setPopoverOpen(false);
  }, [onLog]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classify & Log</CardTitle>
        <CardDescription>Enter an optional task description and log the current time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                type="text"
                placeholder="Optional: Enter task description..."
                value={description}
                onChange={handleDescriptionChange}
                className="text-base py-6"
                aria-label="Task Description"
              />
              {isSuggesting && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </PopoverTrigger>
          {(suggestions.length > 0) && (
            <PopoverContent className="w-[--radix-popover-trigger-width] p-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground px-2">Suggestions</p>
                {suggestions.map((s, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          )}
        </Popover>

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
