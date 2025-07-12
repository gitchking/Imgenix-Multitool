
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

interface PercentageCalculatorProps {
    color?: string;
}

export function PercentageCalculator({ color = 'hsl(var(--primary))' }: PercentageCalculatorProps) {
  const [percentage, setPercentage] = useState('');
  const [baseValue, setBaseValue] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculatePercentage = () => {
    const p = parseFloat(percentage);
    const v = parseFloat(baseValue);

    if (isNaN(p) || isNaN(v)) {
        setResult(null);
        return;
    }

    setResult((p / 100) * v);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Percentage Calculator</CardTitle>
        <CardDescription>Calculate what is X% of Y.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center">
            <div className="space-y-2">
              <Label htmlFor="percentage">What is</Label>
              <Input id="percentage" type="number" value={percentage} onChange={(e) => setPercentage(e.target.value)} placeholder="e.g., 20" />
            </div>
            <span>% of</span>
            <div className="space-y-2">
               <Label htmlFor="base-value" className='opacity-0'>_</Label>
              <Input id="base-value" type="number" value={baseValue} onChange={(e) => setBaseValue(e.target.value)} placeholder="e.g., 500" />
            </div>
        </div>
        <Button onClick={calculatePercentage} style={{backgroundColor: color}}>Calculate</Button>
      </CardContent>
      {result !== null && (
        <CardFooter>
          <p className="text-lg font-semibold">Result: {result.toFixed(2)}</p>
        </CardFooter>
      )}
    </Card>
  );
}
