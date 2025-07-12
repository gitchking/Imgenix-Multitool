
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SavingsCalculatorProps {
    color?: string;
}

export function SavingsCalculator({ color = 'hsl(var(--primary))' }: SavingsCalculatorProps) {
  const [initialAmount, setInitialAmount] = useState('');
  const [contribution, setContribution] = useState('');
  const [contributionFreq, setContributionFreq] = useState('monthly');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<{ futureValue: number; totalContributions: number; totalInterest: number } | null>(null);

  const calculateSavings = () => {
    const P = parseFloat(initialAmount) || 0;
    const C = parseFloat(contribution) || 0;
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(years);

    if (isNaN(r) || isNaN(t)) return;

    let n = 12; // Compounding frequency (monthly)
    let contribMultiplier = 12; // Contribution frequency (monthly)
    if(contributionFreq === 'weekly') {
        n = 52;
        contribMultiplier = 52;
    } else if (contributionFreq === 'annually') {
        n = 1;
        contribMultiplier = 1;
    }

    const nt = n * t;
    const rn = r / n;

    const futureValueOfInitial = P * Math.pow(1 + rn, nt);
    const futureValueOfContributions = C * ( (Math.pow(1 + rn, nt) - 1) / rn );

    const futureValue = futureValueOfInitial + futureValueOfContributions;
    const totalContributions = P + (C * t * contribMultiplier);
    const totalInterest = futureValue - totalContributions;

    setResult({ futureValue, totalContributions, totalInterest });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Savings Calculator</CardTitle>
        <CardDescription>Project the future value of your savings or investments.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initial-amount">Initial Amount ($)</Label>
          <Input id="initial-amount" type="number" value={initialAmount} onChange={e => setInitialAmount(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Regular Contribution</Label>
          <div className='flex gap-2'>
            <Input type="number" value={contribution} onChange={e => setContribution(e.target.value)} />
            <Select value={contributionFreq} onValueChange={setContributionFreq}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
          <Input id="interest-rate" type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="years">Investment Term (Years)</Label>
          <Input id="years" type="number" value={years} onChange={e => setYears(e.target.value)} />
        </div>
        <div className="col-span-1 md:col-span-2">
            <Button onClick={calculateSavings} style={{backgroundColor: color}}>Calculate Future Value</Button>
        </div>
      </CardContent>
      {result && (
        <CardFooter className="flex-col items-start space-y-2">
          <p className="text-xl font-semibold">Future Value: ${result.futureValue.toFixed(2)}</p>
          <p>Total Contributions: ${result.totalContributions.toFixed(2)}</p>
          <p className="text-green-600">Total Interest Earned: ${result.totalInterest.toFixed(2)}</p>
        </CardFooter>
      )}
    </Card>
  );
}
