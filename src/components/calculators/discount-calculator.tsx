
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

interface DiscountCalculatorProps {
    color?: string;
}

export function DiscountCalculator({ color = 'hsl(var(--primary))' }: DiscountCalculatorProps) {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [result, setResult] = useState<{ finalPrice: number; savedAmount: number } | null>(null);

  const calculateDiscount = () => {
    const p = parseFloat(price);
    const d = parseFloat(discount);

    if (isNaN(p) || isNaN(d) || p < 0 || d < 0) {
        setResult(null);
        return;
    }
    
    const savedAmount = (p * d) / 100;
    const finalPrice = p - savedAmount;

    setResult({ finalPrice, savedAmount });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Discount Calculator</CardTitle>
        <CardDescription>Calculate the final price after a discount.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="original-price">Original Price</Label>
          <Input id="original-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 100" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount-percentage">Discount (%)</Label>
          <Input id="discount-percentage" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g., 25" />
        </div>
        <Button onClick={calculateDiscount} style={{backgroundColor: color}}>Calculate Discount</Button>
      </CardContent>
      {result && (
        <CardFooter className="flex-col items-start space-y-2">
          <p className="text-lg font-semibold">Final Price: ${result.finalPrice.toFixed(2)}</p>
          <p className="text-md text-green-600">You Saved: ${result.savedAmount.toFixed(2)}</p>
        </CardFooter>
      )}
    </Card>
  );
}
