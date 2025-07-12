
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

interface AgeCalculatorProps {
    color?: string;
}

export function AgeCalculator({ color = 'hsl(var(--primary))' }: AgeCalculatorProps) {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAge({ years, months, days });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Age Calculator</CardTitle>
        <CardDescription>Calculate your age based on your birth date.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="birth-date">Your Date of Birth</Label>
          <Input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <Button onClick={calculateAge} style={{backgroundColor: color}}>Calculate Age</Button>
      </CardContent>
      {age && (
        <CardFooter>
          <p className="text-lg font-semibold">Your age is: {age.years} years, {age.months} months, and {age.days} days.</p>
        </CardFooter>
      )}
    </Card>
  );
}
