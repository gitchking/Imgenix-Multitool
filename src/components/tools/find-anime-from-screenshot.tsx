
"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, Search, Loader2, X, FileVideo, Tv, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FindAnimeFromScreenshotProps {
  color?: string;
}

interface TraceMoeResult {
    anilist: {
        id: number;
        idMal: number;
        title: {
            native: string;
            romaji: string;
            english: string;
        };
        synonyms: string[];
        isAdult: boolean;
    };
    filename: string;
    episode: number;
    from: number;
    to: number;
    similarity: number;
    video: string;
    image: string;
}

interface TraceMoeResponse {
    frameCount: number;
    error: string;
    result: TraceMoeResult[];
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export function FindAnimeFromScreenshot({ color = 'hsl(var(--primary))' }: FindAnimeFromScreenshotProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TraceMoeResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid File', description: 'Please upload an image.', variant: 'destructive' });
      return;
    }
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setResults([]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };
  
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation(), setIsDragging(true));
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation(), setIsDragging(false));
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation());
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleSearch = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setResults([]);

    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('https://api.trace.moe/search', {
            method: 'POST',
            body: imageFile,
        });

        const data: TraceMoeResponse = await response.json();
        
        if (response.ok) {
            if(data.result && data.result.length > 0) {
                setResults(data.result);
                toast({ title: 'Success!', description: `Found ${data.result.length} possible matches.` });
            } else {
                toast({ title: 'No Results', description: 'Could not identify the anime from this image.', variant: 'destructive' });
            }
        } else {
             throw new Error(data.error || "An unknown error occurred.");
        }

    } catch (error: any) {
        toast({ title: 'API Error', description: error.message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setResults([]);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const ResultCard = ({ result }: { result: TraceMoeResult }) => {
    const title = result.anilist?.title?.english || result.anilist?.title?.romaji || 'Unknown Title';
    const romaji = result.anilist?.title?.romaji;
    
    return (
        <Card className="overflow-hidden">
            <div className="relative">
                <video
                    src={`${result.video}&size=l`}
                    poster={`${result.image}&size=l`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full aspect-video object-cover"
                />
                 <div className="absolute top-2 right-2">
                    <div className="flex items-center space-x-2">
                        <Progress value={result.similarity * 100} className="w-24 h-2" />
                        <span className="text-xs font-bold text-white bg-black/50 px-2 py-1 rounded-md">{`${(result.similarity * 100).toFixed(1)}%`}</span>
                    </div>
                </div>
            </div>
            <CardContent className="p-4">
                <CardTitle className="text-lg" style={{ color: 'var(--tool-color)' }}>
                    {title}
                </CardTitle>
                {romaji && title !== romaji && <CardDescription>{romaji}</CardDescription>}
                <div className="text-sm text-muted-foreground mt-2 space-y-1">
                    <div className="flex items-center gap-2"><Tv className="h-4 w-4" /> <span>Episode: {result.episode}</span></div>
                    <div className="flex items-center gap-2"><Film className="h-4 w-4" /> <span>Timestamp: {formatTime(result.from)}</span></div>
                </div>
            </CardContent>
        </Card>
    );
  };


  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" style={{ '--tool-color': color } as React.CSSProperties}>
      {!imageUrl ? (
        <div
          onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center h-80 w-full rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            isDragging ? "border-[--tool-color] bg-primary/10" : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-10 w-10" />
            <span className="font-medium">Drop a screenshot here or click to upload</span>
            <span className="text-sm">PNG or JPG supported</span>
          </div>
          <Input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg" />
        </div>
      ) : (
        <div className="space-y-6">
            <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden border">
                <Image src={imageUrl} alt="Uploaded screenshot" fill className="object-contain" />
                <Button onClick={handleReset} variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white"><X className="h-5 w-5"/></Button>
            </div>
             <div className="text-center">
                 <Button onClick={handleSearch} disabled={isLoading} style={{ backgroundColor: 'var(--tool-color)' }}>
                    {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Search className="mr-2" />}
                    {isLoading ? 'Searching...' : 'Find Anime Source'}
                </Button>
            </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center" style={{ color: 'var(--tool-color)' }}>Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.slice(0, 4).map((result, index) => (
                    <ResultCard key={index} result={result} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
