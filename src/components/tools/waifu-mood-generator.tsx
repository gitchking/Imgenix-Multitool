
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Download } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WaifuMoodGeneratorProps {
  color?: string;
}

const sfwCategories = [
  'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 
  'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 
  'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive', 
  'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill', 'kick', 
  'happy', 'wink', 'poke', 'dance', 'cringe'
];

const nsfwCategories = [
  'waifu', 'neko', 'trap', 'blowjob'
];

export function WaifuMoodGenerator({ color: toolColor = 'hsl(var(--primary))' }: WaifuMoodGeneratorProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('waifu');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [mode, setMode] = useState<'sfw' | 'nsfw'>('sfw');
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check session storage for verification status
    const storedVerification = sessionStorage.getItem('isAgeVerified');
    if (storedVerification === 'true') {
      setIsVerified(true);
    }
  }, []);

  const fetchImage = useCallback(async (currentCategory: string, currentMode: 'sfw' | 'nsfw' = 'sfw') => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.waifu.pics/${currentMode}/${currentCategory}`);
      const data = await response.json();
      const cacheBustedUrl = `${data.url}?t=${new Date().getTime()}`;
      setImageUrl(cacheBustedUrl);
    } catch (error) {
      console.error("Failed to fetch image", error);
      setIsLoading(false); 
    }
  }, []);
  
  const handleCategoryChange = (newCategory: string) => {
      setCategory(newCategory);
      fetchImage(newCategory, mode);
  };

  const handleGenerate = () => {
    fetchImage(category, mode);
  }

  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
        if (!response.ok) {
            throw new Error('Failed to download image through proxy.');
        }

        const blob = await response.blob();
        
        // Get the original file extension from the URL
        const urlParts = imageUrl.split('.');
        const fileExtension = urlParts[urlParts.length - 1].split('?')[0].toLowerCase();
        
        // Check if it's a GIF
        if (fileExtension === 'gif') {
            // For GIFs, download directly without canvas conversion
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = URL.createObjectURL(blob);
            
            const originalFilename = imageUrl.split('/').pop()?.split('.')[0] || 'waifu';
            a.download = `${originalFilename}.gif`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(a.href);
        } else {
            // For other formats, convert to PNG as before
            const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new window.Image();
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = URL.createObjectURL(blob);
            });
            
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }
            ctx.drawImage(img, 0, 0);

            const pngUrl = canvas.toDataURL('image/png');
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = pngUrl;

            const originalFilename = imageUrl.split('/').pop()?.split('.')[0] || 'waifu';
            a.download = `${originalFilename}.png`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(img.src);
        }

        toast({
            title: 'Download Started',
            description: `Your waifu is on its way as a ${fileExtension === 'gif' ? 'GIF' : 'PNG'}!`,
        });

    } catch (error) {
        console.error('Download failed:', error);
        toast({
            title: 'Download Failed',
            description: 'Could not download the image. Please try again.',
            variant: 'destructive',
        });
    }
  };

  const handleNsfwAccess = () => {
    if (isVerified) {
      setMode('nsfw');
      if (!nsfwCategories.includes(category)) {
          const newCategory = 'waifu';
          setCategory(newCategory);
          fetchImage(newCategory, 'nsfw');
      }
    } else {
      setShowVerification(true);
    }
  };

  const handleVerificationConfirm = () => {
    setIsVerified(true);
    sessionStorage.setItem('isAgeVerified', 'true');
    setMode('nsfw');
    setShowVerification(false);
     if (!nsfwCategories.includes(category)) {
        const newCategory = 'waifu';
        setCategory(newCategory);
        fetchImage(newCategory, 'nsfw');
    }
  };

  const handleSfwAccess = () => {
      setMode('sfw');
      if (!sfwCategories.includes(category)) {
          const newCategory = 'waifu';
          setCategory(newCategory);
          fetchImage(newCategory, 'sfw');
      }
  }

  const currentCategories = mode === 'sfw' ? sfwCategories : nsfwCategories;

  // Initial fetch
  useEffect(() => {
    fetchImage('waifu', 'sfw');
  }, [fetchImage]);
  
  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <Card>
        <CardHeader className="pb-4">
            <CardTitle className="text-lg" style={{ color: 'var(--tool-color)' }}>Waifu Mood Generator</CardTitle>
            <CardDescription className="text-sm">Generate anime images for different moods.</CardDescription>
        </CardHeader>
        <div className='px-6'>
          <Tabs value={mode} onValueChange={(v) => v === 'sfw' ? handleSfwAccess() : handleNsfwAccess()} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sfw">SFW</TabsTrigger>
              <TabsTrigger value="nsfw">NSFW</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardContent className="pt-4">
          <div className="relative aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden border bg-muted/20">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                </div>
            )}
            {imageUrl && (
                <Image
                    key={imageUrl}
                    src={imageUrl}
                    alt={`A waifu image with mood: ${category}`}
                    fill
                    className="object-contain"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        fetchImage(category, mode);
                    }}
                />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-3 pt-4">
            <div className="w-full space-y-2">
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select a mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="flex w-full gap-2">
                <Button onClick={handleGenerate} disabled={isLoading} className="w-full text-sm" style={{backgroundColor: 'var(--tool-color)'}}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isLoading ? 'Loading...' : 'Generate New'}
                </Button>
                <Button onClick={handleDownload} disabled={isLoading || !imageUrl} variant="secondary" className="w-full text-sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </div>
        </CardFooter>
      </Card>
       <AlertDialog open={showVerification} onOpenChange={setShowVerification}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Age Verification</AlertDialogTitle>
            <AlertDialogDescription>
              This section contains content that is not safe for work (NSFW). Please confirm that you are 18 years of age or older to proceed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleVerificationConfirm}>I am 18 or older</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
