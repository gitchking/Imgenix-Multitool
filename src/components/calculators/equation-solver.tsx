
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import { all, create } from 'mathjs';

interface EquationSolverProps {
    color?: string;
}

const math = create(all);

export function EquationSolver({ color = 'hsl(var(--primary))' }: EquationSolverProps) {
  const [equation, setEquation] = useState('2x + 3 = 9');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const solveEquation = () => {
    if (!equation) {
        setError("Please enter an equation.");
        setResult(null);
        return;
    }

    try {
        const results = math.evaluate(equation);
        
        setResult(results.toString());
        setError(null);
    } catch (e: any) {
        setError(e.message || "Invalid equation. Please check your input.");
        setResult(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{color}}>Equation Solver</CardTitle>
        <CardDescription>Solve algebraic equations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="equation">Equation</Label>
          <Input 
            id="equation" 
            type="text" 
            value={equation} 
            onChange={(e) => setEquation(e.target.value)} 
            placeholder="e.g., 2x + 3 = 9" 
            onKeyDown={(e) => e.key === 'Enter' && solveEquation()}
          />
        </div>
        <Button onClick={solveEquation} style={{backgroundColor: color}}>Solve Equation</Button>
      </CardContent>
      {(result || error) && (
        <CardFooter>
            {error ? (
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : (
                <p className="text-lg font-semibold">Result: {result}</p>
            )}
        </CardFooter>
      )}
    </Card>
  );
}
