
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface RandomDogViewerProps {
  color?: string;
}

export function RandomDogViewer({ color: toolColor = 'hsl(var(--primary))' }: RandomDogViewerProps) {
  const [dogImageUrl, setDogImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDogImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/random-dog');
      if (!response.ok) {
        throw new Error('Failed to fetch dog image');
      }
      const data = await response.json();
      if (data.imageUrl) {
        setDogImageUrl(data.imageUrl);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Could not fetch a new dog picture. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDogImage();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden border bg-muted/20">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                </div>
            )}
            {dogImageUrl && (
                <Image
                src={dogImageUrl}
                alt="A random dog"
                fill
                className="object-contain"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    console.error("Failed to load dog image from URL.");
                    setIsLoading(false);
                }}
                />
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchDogImage} disabled={isLoading} className="w-full" style={{backgroundColor: 'var(--tool-color)'}}>
            <RefreshCw className="mr-2" />
            {isLoading ? 'Fetching new friend...' : 'Get a New Doggo'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
