
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

interface LoanCalculatorProps {
    color?: string;
}

export function LoanCalculator({ color = 'hsl(var(--primary))' }: LoanCalculatorProps) {
  const [amount, setAmount] = useState('');
  const [interest, setInterest] = useState('');
  const [term, setTerm] = useState('');
  const [result, setResult] = useState<{ monthlyPayment: number; totalPayment: number; totalInterest: number } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(amount);
    const annualInterestRate = parseFloat(interest);
    const loanTermInYears = parseFloat(term);

    if (isNaN(principal) || isNaN(annualInterestRate) || isNaN(loanTermInYears)) {
        setResult(null);
        return;
    }
    
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loanTermInYears * 12;

    if (monthlyInterestRate === 0) {
      const monthlyPayment = principal / numberOfPayments;
      setResult({
        monthlyPayment,
        totalPayment: principal,
        totalInterest: 0,
      });
      return;
    }

    const monthlyPayment = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResult({ monthlyPayment, totalPayment, totalInterest });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Loan Calculator</CardTitle>
        <CardDescription>Estimate your monthly loan payments.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loan-amount">Loan Amount ($)</Label>
          <Input id="loan-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
          <Input id="interest-rate" type="number" value={interest} onChange={(e) => setInterest(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loan-term">Loan Term (Years)</Label>
          <Input id="loan-term" type="number" value={term} onChange={(e) => setTerm(e.target.value)} />
        </div>
        <Button onClick={calculateLoan} style={{backgroundColor: color}}>Calculate</Button>
      </CardContent>
      {result && (
        <CardFooter className="flex-col items-start space-y-2">
          <p className="text-lg font-semibold">Monthly Payment: ${result.monthlyPayment.toFixed(2)}</p>
          <p>Total Payment: ${result.totalPayment.toFixed(2)}</p>
          <p>Total Interest: ${result.totalInterest.toFixed(2)}</p>
        </CardFooter>
      )}
    </Card>
  );
}
