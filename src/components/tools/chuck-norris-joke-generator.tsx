
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';

interface ChuckNorrisJokeGeneratorProps {
  color?: string;
}

const NorrisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20 text-foreground mx-auto">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0" fill="none"/>
      <path d="M15.5 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      <path d="M12 14c-2.33 0-4.32 1.45-5.12 3.5h10.24c-.8-2.05-2.79-3.5-5.12-3.5z"/>
    </svg>
);


export function ChuckNorrisJokeGenerator({ color: toolColor = 'hsl(var(--primary))' }: ChuckNorrisJokeGeneratorProps) {
  const [joke, setJoke] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchJoke = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.chucknorris.io/jokes/random');
      const data = await response.json();
      setJoke(data.value);
    } catch (error) {
      setJoke('Could not fetch a joke. Even Chuck Norris needs a break sometimes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-6 min-h-[250px] justify-center">
            <NorrisIcon />
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
              </div>
            ) : (
              <blockquote className="text-xl font-semibold leading-relaxed text-foreground border-l-4 pl-4" style={{borderColor: 'var(--tool-color)'}}>
                "{joke}"
              </blockquote>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={fetchJoke} disabled={isLoading} style={{backgroundColor: 'var(--tool-color)'}}>
            {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <RefreshCw className="mr-2" />}
            Get Another Fact
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
