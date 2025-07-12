
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowRightLeft, Clipboard, ClipboardCheck, Loader2, Type } from 'lucide-react';
import { languages } from '@/lib/languages';
import type { Language } from '@/lib/languages';


interface TranslatorProps {
  color?: string;
}

export function Translator({ color = 'hsl(var(--primary))' }: TranslatorProps) {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [textSize, setTextSize] = useState('lg');
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      return;
    }

    if (sourceLang === targetLang && sourceLang !== 'auto') {
      toast({
        title: 'Same Languages',
        description: 'Source and target languages are the same.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTranslatedText('');

    try {
      // URL format: https://lingva.ml/api/v1/{source}/{target}/{text}
      const url = `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(sourceText)}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }

      setTranslatedText(data.translation);
      
    } catch (error: any) {
      toast({
        title: 'Translation Error',
        description: error.message || 'An unexpected error occurred. The Lingva API might be temporarily down.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') {
      toast({
        title: 'Cannot Swap Languages',
        description: 'Please select a specific source language to swap.',
        variant: 'destructive',
      });
      return;
    }
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4" style={{ '--tool-color': color } as React.CSSProperties}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        <Textarea
          placeholder="Enter text to translate..."
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className={`h-full min-h-[200px] max-h-[400px] resize-none text-${textSize}`}
          style={{ fontSize: textSize === 'sm' ? '14px' : textSize === 'base' ? '16px' : textSize === 'lg' ? '18px' : '20px' }}
        />
        <div className="relative">
          <Textarea
            placeholder="Translation will appear here..."
            value={translatedText}
            readOnly
            className={`h-full min-h-[200px] max-h-[400px] resize-none bg-muted/50 text-${textSize}`}
            style={{ fontSize: textSize === 'sm' ? '14px' : textSize === 'base' ? '16px' : textSize === 'lg' ? '18px' : '20px' }}
          />
          {translatedText && (
            <Button onClick={handleCopy} variant="ghost" size="icon" className="absolute bottom-2 right-2 h-8 w-8">
              {isCopied ? <ClipboardCheck className="h-5 w-5 text-green-500" /> : <Clipboard className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-lg border p-4 flex-shrink-0">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1">
            <Label htmlFor="source-lang">From</Label>
            <Select value={sourceLang} onValueChange={(v) => setSourceLang(v)}>
              <SelectTrigger id="source-lang" className="[&>span]:line-clamp-none [&>span]:truncate">
                <SelectValue placeholder="Source Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-Detect</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSwapLanguages} variant="ghost" size="icon" className="self-end">
            <ArrowRightLeft />
          </Button>

          <div className="flex-1">
            <Label htmlFor="target-lang">To</Label>
            <Select value={targetLang} onValueChange={(v) => setTargetLang(v)}>
              <SelectTrigger id="target-lang" className="[&>span]:line-clamp-none [&>span]:truncate">
                <SelectValue placeholder="Target Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="text-size" className="text-sm">Size</Label>
            <Select value={textSize} onValueChange={(v) => setTextSize(v)}>
              <SelectTrigger id="text-size" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="base">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleTranslate} disabled={isLoading || !sourceText.trim()} className="w-full md:w-auto" style={{ backgroundColor: 'var(--tool-color)' }}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              'Translate'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
