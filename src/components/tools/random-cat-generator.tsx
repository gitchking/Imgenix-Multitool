
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface RandomCatGeneratorProps {
  color?: string;
}

export function RandomCatGenerator({ color: toolColor = 'hsl(var(--primary))' }: RandomCatGeneratorProps) {
  const [catImageUrl, setCatImageUrl] = useState('');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCatImage = () => {
    setIsLoading(true);
    let url = 'https://cataas.com/cat';
    if (text) {
      url += `/says/${encodeURIComponent(text)}`;
    }
    // Add a cache-busting query parameter
    url += `?_=${new Date().getTime()}`;
    setCatImageUrl(url);
  };
  
  // No need for initial fetch in useEffect, as the Image onload will handle loading state.

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden border bg-muted/20">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                </div>
            )}
            <Image
              key={catImageUrl} // Force re-render when URL changes
              src={catImageUrl || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} // Use a placeholder if no URL yet
              alt="A random cat"
              fill
              className="object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                // In case of an API error, we can just try again
                console.error("Failed to load cat image.");
                setIsLoading(false);
              }}
              unoptimized // cataas.com is not in next.config.js
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
            <div className="w-full space-y-2">
                <Label htmlFor="cat-text">Add text to the image (optional)</Label>
                <Input
                    id="cat-text"
                    placeholder="Hello World!"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="text-base"
                />
            </div>
            <Button onClick={fetchCatImage} disabled={isLoading} className="w-full" style={{backgroundColor: 'var(--tool-color)'}}>
              <RefreshCw className="mr-2" />
              {isLoading ? 'Loading...' : 'Get a New Cat'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
