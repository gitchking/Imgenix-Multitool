
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

interface DateDifferenceCalculatorProps {
    color?: string;
}

export function DateDifferenceCalculator({ color = 'hsl(var(--primary))' }: DateDifferenceCalculatorProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [difference, setDifference] = useState<string | null>(null);

  const calculateDifference = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    // This is a simplified calculation
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    setDifference(`${years} years, ${months} months, and ${days} days (${diffDays} total days)`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Date Difference</CardTitle>
        <CardDescription>Calculate the duration between two dates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
        </div>
        <Button onClick={calculateDifference} style={{backgroundColor: color}}>Calculate Difference</Button>
      </CardContent>
      {difference && (
        <CardFooter>
          <p className="text-lg font-semibold">Difference: {difference}</p>
        </CardFooter>
      )}
    </Card>
  );
}
