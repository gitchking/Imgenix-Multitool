
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SalaryCalculatorProps {
    color?: string;
}

export function SalaryCalculator({ color = 'hsl(var(--primary))' }: SalaryCalculatorProps) {
  const [rate, setRate] = useState('');
  const [period, setPeriod] = useState<'hourly' | 'daily' | 'weekly' | 'monthly' | 'annually'>('hourly');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [result, setResult] = useState<{ hourly: number; daily: number; weekly: number; monthly: number; annually: number; } | null>(null);

  const calculateSalary = () => {
    const r = parseFloat(rate);
    const h = parseFloat(hoursPerWeek);
    if (isNaN(r) || isNaN(h)) return;

    let hourlyRate = 0;
    switch(period) {
        case 'hourly':
            hourlyRate = r;
            break;
        case 'daily':
            hourlyRate = r / (h/5); // Assuming 5 work days
            break;
        case 'weekly':
            hourlyRate = r / h;
            break;
        case 'monthly':
            hourlyRate = r / (h * 4.33); // Avg weeks in a month
            break;
        case 'annually':
            hourlyRate = r / (h * 52);
            break;
    }
    
    const daily = hourlyRate * (h/5);
    const weekly = hourlyRate * h;
    const monthly = weekly * 4.33;
    const annually = weekly * 52;
    
    setResult({ hourly: hourlyRate, daily, weekly, monthly, annually });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Salary Calculator</CardTitle>
        <CardDescription>Convert your salary between hourly, weekly, monthly, and annual rates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label>Pay Rate</Label>
            <div className='flex gap-2'>
                <Input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g., 25" />
                 <Select value={period} onValueChange={val => setPeriod(val as any)}>
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hourly">per Hour</SelectItem>
                        <SelectItem value="daily">per Day</SelectItem>
                        <SelectItem value="weekly">per Week</SelectItem>
                        <SelectItem value="monthly">per Month</SelectItem>
                        <SelectItem value="annually">per Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hours-week">Hours per Week</Label>
          <Input id="hours-week" type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} />
        </div>
        <Button onClick={calculateSalary} style={{backgroundColor: color}}>Calculate Equivalents</Button>
      </CardContent>
      {result && (
        <CardFooter>
          <div className='grid grid-cols-2 gap-4 w-full'>
            <div><strong>Hourly:</strong> ${result.hourly.toFixed(2)}</div>
            <div><strong>Daily:</strong> ${result.daily.toFixed(2)}</div>
            <div><strong>Weekly:</strong> ${result.weekly.toFixed(2)}</div>
            <div><strong>Monthly:</strong> ${result.monthly.toFixed(2)}</div>
            <div className='col-span-2'><strong>Annually:</strong> ${result.annually.toFixed(2)}</div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
