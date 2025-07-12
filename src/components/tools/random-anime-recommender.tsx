
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Loader2, RefreshCw, Youtube, Star, Tv } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface RandomAnimeRecommenderProps {
  color?: string;
}

interface AnimeData {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    }
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
  };
  title: string;
  title_english: string | null;
  title_japanese: string;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  synopsis: string;
  background: string | null;
  season: string;
  year: number;
  genres: { mal_id: number; name: string }[];
  demographics: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
}

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-muted animate-pulse"></div>
            <div className="h-10 bg-muted rounded-md animate-pulse w-full"></div>
        </div>
        <div className="md:col-span-2 space-y-6">
            <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-6 w-20 bg-muted rounded-full animate-pulse"></div>)}
            </div>
            <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
            </div>
        </div>
    </div>
);

export function RandomAnimeRecommender({ color: toolColor = 'hsl(var(--primary))' }: RandomAnimeRecommenderProps) {
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnime = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.jikan.moe/v4/random/anime');
      if (!response.ok) {
          throw new Error(`Jikan API responded with status: ${response.status}`);
      }
      const result = await response.json();
      setAnime(result.data);
    } catch (error: any) {
      console.error("Failed to fetch anime data", error);
      toast({
          title: "Failed to Fetch Anime",
          description: "Could not retrieve a recommendation. The API might be busy. Please try again.",
          variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
           <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl" style={{color: 'var(--tool-color)'}}>
                {isLoading ? 'Finding an anime...' : anime?.title_english || anime?.title || 'Anime Recommendation'}
              </CardTitle>
              {!isLoading && anime && <CardDescription>{anime.title_japanese}</CardDescription>}
            </div>
             <Button onClick={fetchAnime} disabled={isLoading} variant="secondary">
                <RefreshCw className="mr-2" />
                Get Another
            </Button>
           </div>
        </CardHeader>
        <CardContent>
          {isLoading || !anime ? (
            <SkeletonLoader />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden border">
                    <Image src={anime.images.jpg.large_image_url} alt={`Poster for ${anime.title}`} fill className="object-cover" />
                </div>
                {anime.trailer?.youtube_id && (
                    <Button asChild className="w-full">
                        <a href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`} target="_blank" rel="noopener noreferrer">
                            <Youtube className="mr-2" />
                            Watch Trailer
                        </a>
                    </Button>
                )}
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {anime.score && <div className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400" /> <span>{anime.score}/10</span></div>}
                    {anime.episodes && <div className="flex items-center gap-1"><Tv className="h-4 w-4" /> <span>{anime.episodes} episodes</span></div>}
                    <Badge variant="outline">{anime.type}</Badge>
                    <Badge variant="outline">{anime.status}</Badge>
                </div>

                 <div>
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                     <div className="flex flex-wrap gap-2">
                        {anime.genres.map(genre => <Badge key={genre.mal_id} variant="secondary">{genre.name}</Badge>)}
                        {anime.demographics.map(demo => <Badge key={demo.mal_id} variant="secondary">{demo.name}</Badge>)}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {anime.synopsis || "No synopsis available."}
                    </p>
                </div>
                
                 {anime.studios.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Studio</h3>
                        <p className="text-sm text-muted-foreground">{anime.studios.map(s => s.name).join(', ')}</p>
                    </div>
                 )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
