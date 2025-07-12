
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Loader2, RefreshCw, Youtube } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface RandomMealGeneratorProps {
  color?: string;
}

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  [key: string]: string; // For ingredients and measures
}

export function RandomMealGenerator({ color: toolColor = 'hsl(var(--primary))' }: RandomMealGeneratorProps) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeal = async () => {
    setIsLoading(true);
    setMeal(null);
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      const newMeal = data.meals[0];
      setMeal(newMeal);
      
      const ingredientsList = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = newMeal[`strIngredient${i}`];
        const measure = newMeal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
          ingredientsList.push(`${measure} ${ingredient}`);
        }
      }
      setIngredients(ingredientsList);

    } catch (error) {
      console.error("Failed to fetch meal data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeal();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
           <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl" style={{color: 'var(--tool-color)'}}>{meal?.strMeal || 'Loading...'}</CardTitle>
              {meal && <CardDescription>A delicious {meal.strArea} {meal.strCategory} dish.</CardDescription>}
            </div>
             <Button onClick={fetchMeal} disabled={isLoading} variant="secondary">
                <RefreshCw className="mr-2" />
                Get Another Meal
            </Button>
           </div>
        </CardHeader>
        <CardContent>
          {isLoading || !meal ? (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-16 w-16 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                    <Image src={meal.strMealThumb} alt={`Image of ${meal.strMeal}`} fill className="object-cover" unoptimized />
                </div>
                {meal.strYoutube && (
                    <Button asChild className="w-full">
                        <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
                            <Youtube className="mr-2" />
                            Watch on YouTube
                        </a>
                    </Button>
                )}
              </div>
              <div className="space-y-6">
                 <div>
                    <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
                     <div className="flex flex-wrap gap-2">
                        {ingredients.map((item, index) => (
                           <Badge key={index} variant="secondary">{item}</Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">Instructions</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{meal.strInstructions}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
