
"use client"

import * as React from 'react';
import { AgeCalculator } from '@/components/calculators/age-calculator';
import { BasicCalculator } from '@/components/calculators/basic-calculator';
import { BmiCalculator } from '@/components/calculators/bmi-calculator';
import { DateDifferenceCalculator } from '@/components/calculators/date-difference-calculator';
import { DiscountCalculator } from '@/components/calculators/discount-calculator';
import { LoanCalculator } from '@/components/calculators/loan-calculator';
import { PercentageCalculator } from '@/components/calculators/percentage-calculator';
import { SalaryCalculator } from '@/components/calculators/salary-calculator';
import { SavingsCalculator } from '@/components/calculators/savings-calculator';
import { TipCalculator } from '@/components/calculators/tip-calculator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CalculatorKitProps {
  color?: string;
}

export function CalculatorKit({ color }: CalculatorKitProps) {
  const calculators = [
    { id: 'basic', component: <BasicCalculator color={color} /> },
    { id: 'tip', component: <TipCalculator color={color} /> },
    { id: 'discount', component: <DiscountCalculator color={color} /> },
    { id: 'percentage', component: <PercentageCalculator color={color} /> },
    { id: 'age', component: <AgeCalculator color={color} /> },
    { id: 'date-difference', component: <DateDifferenceCalculator color={color} /> },
    { id: 'bmi', component: <BmiCalculator color={color} /> },
    { id: 'loan', component: <LoanCalculator color={color} /> },
    { id: 'savings', component: <SavingsCalculator color={color} /> },
    { id: 'salary', component: <SalaryCalculator color={color} /> },
  ];

  return (
    <div className="w-full flex justify-center">
        <Carousel className="w-full max-w-lg" opts={{ loop: true }}>
          <CarouselContent>
            {calculators.map(({ id, component }) => (
              <CarouselItem key={id}>
                <div className="p-1">
                  {component}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
    </div>
  );
}
