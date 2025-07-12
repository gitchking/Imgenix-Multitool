
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface BasicCalculatorProps {
    color?: string;
}

export function BasicCalculator({ color = 'hsl(var(--primary))' }: BasicCalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };
  
  const handleClear = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const handleEquals = () => {
    if (operator && currentValue !== null) {
      const inputValue = parseFloat(display);
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(result);
      setDisplay(String(result));
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const calculate = (firstOperand: number, secondOperand: number, op: string) => {
    switch (op) {
      case '+': return firstOperand + secondOperand;
      case '-': return firstOperand - secondOperand;
      case '*': return firstOperand * secondOperand;
      case '/': return firstOperand / secondOperand;
      default: return secondOperand;
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  const handleButtonClick = (btn: string) => {
    if (!isNaN(Number(btn))) {
      handleDigit(btn);
    } else if (btn === '.') {
      handleDecimal();
    } else if (btn === '=') {
      handleEquals();
    } else {
      handleOperator(btn);
    }
  };

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardHeader>
        <CardTitle style={{color}}>Basic Calculator</CardTitle>
        <CardDescription>A standard calculator for everyday use.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted text-muted-foreground text-right text-3xl font-mono p-4 rounded-lg break-all">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="destructive" className="col-span-4" onClick={handleClear}>Clear</Button>
          {buttons.map((btn) => (
            <Button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              variant={isNaN(Number(btn)) && btn !== '.' ? "secondary" : "outline"}
              className="text-xl h-16"
              style={btn === '=' ? {backgroundColor: color} : {}}
            >
              {btn}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
