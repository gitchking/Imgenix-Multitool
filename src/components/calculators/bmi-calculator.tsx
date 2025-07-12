
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BmiCalculatorProps {
    color?: string;
}

export function BmiCalculator({ color = 'hsl(var(--primary))' }: BmiCalculatorProps) {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
        setBmi(null);
        return;
    }

    let bmiValue;
    if (unit === 'metric') {
      // Weight in kg, Height in cm
      bmiValue = w / ((h / 100) ** 2);
    } else {
      // Weight in lbs, Height in ft + in
      const hIn = parseFloat(heightInches) || 0;
      const totalHeightInches = (h * 12) + hIn;
      bmiValue = (w / (totalHeightInches ** 2)) * 703;
    }
    setBmi(bmiValue);
  };

  const getBmiCategory = (bmiValue: number | null) => {
    if (!bmiValue) return "";
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 24.9) return "Normal weight";
    if (bmiValue < 29.9) return "Overweight";
    return "Obesity";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>BMI Calculator</CardTitle>
        <CardDescription>Calculate your Body Mass Index.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={unit} onValueChange={(val) => setUnit(val as 'metric' | 'imperial')}>
          <SelectTrigger>
            <SelectValue placeholder="Select unit system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (kg, cm)</SelectItem>
            <SelectItem value="imperial">Imperial (lbs, ft, in)</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</Label>
          <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        
        {unit === 'metric' ? (
          <div className="space-y-2">
            <Label htmlFor="height-cm">Height (cm)</Label>
            <Input id="height-cm" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="height-ft">Height (ft)</Label>
              <Input id="height-ft" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="height-in">Height (in)</Label>
              <Input id="height-in" type="number" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
            </div>
          </div>
        )}
        <Button onClick={calculateBmi} style={{backgroundColor: color}}>Calculate BMI</Button>
      </CardContent>
      {bmi !== null && (
        <CardFooter className="flex flex-col items-start gap-2">
          <p className="text-lg font-semibold">Your BMI is: {bmi.toFixed(2)}</p>
          <p className="text-md">Category: {getBmiCategory(bmi)}</p>
        </CardFooter>
      )}
    </Card>
  );
}
