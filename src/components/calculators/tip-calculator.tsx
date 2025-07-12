
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface TipCalculatorProps {
    color?: string;
}

export function TipCalculator({ color = 'hsl(var(--primary))' }: TipCalculatorProps) {
  const [bill, setBill] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<{ tipAmount: number; totalAmount: number; perPerson: number } | null>(null);

  const calculateTip = () => {
    const b = parseFloat(bill);
    const p = parseInt(people, 10);

    if (isNaN(b) || isNaN(p) || b < 0 || p < 1) {
        setResult(null);
        return;
    }
    
    const tipAmount = (b * tipPercentage) / 100;
    const totalAmount = b + tipAmount;
    const perPerson = totalAmount / p;

    setResult({ tipAmount, totalAmount, perPerson });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Tip Calculator</CardTitle>
        <CardDescription>Calculate tips and split the bill.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bill-amount">Bill Amount ($)</Label>
          <Input id="bill-amount" type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="e.g., 50.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tip-percentage">Tip Percentage ({tipPercentage}%)</Label>
          <Slider id="tip-percentage" min={0} max={100} step={1} value={[tipPercentage]} onValueChange={([v]) => setTipPercentage(v)} />
        </div>
         <div className="space-y-2">
          <Label htmlFor="number-people">Number of People</Label>
          <Input id="number-people" type="number" value={people} onChange={(e) => setPeople(e.target.value)} min="1" step="1" />
        </div>
        <Button onClick={calculateTip} style={{backgroundColor: color}}>Calculate Tip</Button>
      </CardContent>
      {result && (
        <CardFooter className="flex-col items-start space-y-2">
          <p>Tip Amount: ${result.tipAmount.toFixed(2)}</p>
          <p className="text-lg font-semibold">Total Amount: ${result.totalAmount.toFixed(2)}</p>
          {Number(people) > 1 && <p className="text-lg font-semibold">Amount per person: ${result.perPerson.toFixed(2)}</p>}
        </CardFooter>
      )}
    </Card>
  );
}
