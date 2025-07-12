
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, ClipboardCheck, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColorPaletteExplorerProps {
  color?: string;
}

const predefinedPalettes: { [key: string]: string[] } = {
  "Sunset": ["#F97316", "#FDBA74", "#F87171", "#DC2626", "#7F1D1D"],
  "Ocean": ["#0EA5E9", "#38BDF8", "#7DD3FC", "#E0F2FE", "#0369A1"],
  "Forest": ["#16A34A", "#4ADE80", "#BBF7D0", "#14532D", "#052E16"],
  "Neon": ["#EC4899", "#D946EF", "#A855F7", "#F97316", "#3B82F6"],
  "Pastel": ["#FBCFE8", "#F5D0FE", "#D8B4FE", "#C4B5FD", "#A5B4FC"],
  "Grayscale": ["#E5E7EB", "#9CA3AF", "#4B5563", "#1F2937", "#111827"],
};

export function ColorPaletteExplorer({ color: toolColor = 'hsl(var(--primary))' }: ColorPaletteExplorerProps) {
  const [currentPalette, setCurrentPalette] = useState<string[]>(predefinedPalettes["Sunset"]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { toast } = useToast();

  const generateRandomPalette = () => {
    const randomPalette = Array.from({ length: 5 }, () =>
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    );
    setCurrentPalette(randomPalette);
  };
  
  const handlePaletteChange = (paletteName: string) => {
    if (paletteName === 'random') {
      generateRandomPalette();
    } else {
      setCurrentPalette(predefinedPalettes[paletteName]);
    }
  };

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast({ title: 'Copied!', description: `${color} copied to clipboard.` });
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" style={{ '--tool-color': toolColor } as React.CSSProperties}>
      <div className="flex flex-col sm:flex-row gap-4">
        <Select onValueChange={handlePaletteChange} defaultValue='Sunset'>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Select a palette" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(predefinedPalettes).map(name => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={generateRandomPalette} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="mr-2"/>
            Randomize
        </Button>
      </div>
      
      <div className="h-[400px] flex flex-col md:flex-row rounded-lg overflow-hidden border">
        {currentPalette.map((color, index) => (
        <div
            key={index}
            style={{ backgroundColor: color }}
            className="flex-1 flex flex-col justify-end items-center text-center p-4 cursor-pointer group"
            onClick={() => handleCopy(color)}
        >
            <div className="flex items-center gap-2 bg-black/30 text-white font-mono text-lg rounded-full px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{color.toUpperCase()}</span>
                {copiedColor === color ? <ClipboardCheck /> : <Clipboard />}
            </div>
        </div>
        ))}
      </div>
    </div>
  );
}
