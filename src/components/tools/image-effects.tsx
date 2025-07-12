
"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, Download, Wand2, X, Brush } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImageEffectsProps {
  color?: string;
}

const initialEffects = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  invert: false,
};

type BlurType = 'standard' | 'mosaic';

export function ImageEffects({ color = 'hsl(var(--primary))' }: ImageEffectsProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  
  const [globalEffects, setGlobalEffects] = useState(initialEffects);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('global');
  const [isPainting, setIsPainting] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [blurStrength, setBlurStrength] = useState(10);
  const [blurType, setBlurType] = useState<BlurType>('standard');
  const [blurApplied, setBlurApplied] = useState(false);


  const drawImageWithEffects = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    ctx.filter = generateGlobalFilterString();
    ctx.drawImage(image, 0, 0);
    ctx.filter = 'none';
  };
  
  useEffect(() => {
    if (originalUrl) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = originalUrl;
      img.onload = () => {
        imageRef.current = img;
        drawImageWithEffects();
        setBlurApplied(false);
      };
    }
  }, [originalUrl]);

  useEffect(() => {
    if (imageRef.current) {
        drawImageWithEffects();
    }
  }, [globalEffects]);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setGlobalEffects(initialEffects);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const generateGlobalFilterString = () => {
    return [
      `brightness(${globalEffects.brightness}%)`,
      `contrast(${globalEffects.contrast}%)`,
      `saturate(${globalEffects.saturate}%)`,
      `grayscale(${globalEffects.grayscale}%)`,
      `invert(${globalEffects.invert ? 1 : 0})`,
    ].join(' ');
  };
  
  const getMousePos = (canvas: HTMLCanvasElement, e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
  }
  
  const paintEffect = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    setBlurApplied(true);
    const { x, y } = getMousePos(canvas, e);

    if (blurType === 'standard') {
      ctx.save();
      ctx.filter = `blur(${blurStrength}px)`;
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    } else if (blurType === 'mosaic') {
      const mosaicSize = Math.max(5, blurStrength);
      const startX = Math.floor(x - brushSize);
      const startY = Math.floor(y - brushSize);
      const endX = Math.ceil(x + brushSize);
      const endY = Math.ceil(y + brushSize);

      for (let i = startX; i < endX; i += mosaicSize) {
        for (let j = startY; j < endY; j += mosaicSize) {
          // Check if the mosaic block is within the brush circle
          const dist = Math.sqrt(Math.pow(i + mosaicSize/2 - x, 2) + Math.pow(j + mosaicSize/2 - y, 2));
          if (dist > brushSize) continue;

          try {
            const imageData = ctx.getImageData(i, j, mosaicSize, mosaicSize);
            const data = imageData.data;
            let r = 0, g = 0, b = 0, count = 0;

            for (let k = 0; k < data.length; k += 4) {
                r += data[k];
                g += data[k + 1];
                b += data[k + 2];
                count++;
            }
            
            const avgR = Math.floor(r / count);
            const avgG = Math.floor(g / count);
            const avgB = Math.floor(b / count);

            ctx.fillStyle = `rgb(${avgR}, ${avgG}, ${avgB})`;
            ctx.fillRect(i, j, mosaicSize, mosaicSize);
          } catch(e) {
            // getImageData can throw security errors if image is tainted, though we try to avoid this.
            // Also ignore errors if we're at the edge of the canvas.
          }
        }
      }
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalFile) {
        toast({ title: 'Error', description: 'Cannot download image.', variant: 'destructive' });
        return;
    }
    const link = document.createElement('a');
    link.download = `edited-${originalFile.name}`;
    link.href = canvas.toDataURL(originalFile.type, 1.0);
    link.click();
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    imageRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setBlurApplied(false);
  };
  
  const resetGlobalEffects = () => {
      setGlobalEffects(initialEffects);
  }
  
  const resetBlur = () => {
    if (imageRef.current) {
        drawImageWithEffects();
        setBlurApplied(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" style={{ '--tool-color': color } as React.CSSProperties}>
      {!originalUrl ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center h-80 w-full rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            isDragging ? "border-[--tool-color] bg-primary/10" : "border-border hover:border-primary/50"
          )}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-10 w-10" />
            <span className="font-medium">Drag & drop an image or click to browse</span>
            <span className="text-sm">Any image format</span>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            id="image-upload"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Controls</h3>
                <Button onClick={handleReset} variant="ghost" size="sm"><X className="mr-2 h-4 w-4" /> Reset Image</Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="global">Global Effects</TabsTrigger>
                <TabsTrigger value="custom-blur">Custom Effects</TabsTrigger>
              </TabsList>
              <TabsContent value="global" className="space-y-4 rounded-lg border p-4 mt-2">
                  <div className="space-y-2">
                    <Label>Brightness ({globalEffects.brightness}%)</Label>
                    <Slider min={0} max={200} value={[globalEffects.brightness]} onValueChange={([v]) => setGlobalEffects(e => ({ ...e, brightness: v }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Contrast ({globalEffects.contrast}%)</Label>
                    <Slider min={0} max={200} value={[globalEffects.contrast]} onValueChange={([v]) => setGlobalEffects(e => ({ ...e, contrast: v }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Saturation ({globalEffects.saturate}%)</Label>
                    <Slider min={0} max={200} value={[globalEffects.saturate]} onValueChange={([v]) => setGlobalEffects(e => ({ ...e, saturate: v }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Grayscale ({globalEffects.grayscale}%)</Label>
                    <Slider min={0} max={100} value={[globalEffects.grayscale]} onValueChange={([v]) => setGlobalEffects(e => ({ ...e, grayscale: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="invert">Invert Colors</Label>
                    <Switch id="invert" checked={globalEffects.invert} onCheckedChange={(v) => setGlobalEffects(e => ({ ...e, invert: v }))} />
                  </div>
                   <Button onClick={resetGlobalEffects} variant="secondary" className="w-full">Reset Global Effects</Button>
              </TabsContent>
              <TabsContent value="custom-blur" className="space-y-4 rounded-lg border p-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-accent rounded-md">
                    <Brush className="h-5 w-5 shrink-0"/>
                    <p>Click and drag on the image to paint an effect.</p>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor="blur-type">Effect Type</Label>
                    <Select value={blurType} onValueChange={(v: BlurType) => setBlurType(v)}>
                        <SelectTrigger id="blur-type">
                            <SelectValue placeholder="Select effect" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Standard Blur</SelectItem>
                            <SelectItem value="mosaic">Mosaic / Pixelate</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Brush Size ({brushSize}px)</Label>
                    <Slider min={5} max={100} step={1} value={[brushSize]} onValueChange={([v]) => setBrushSize(v)} />
                </div>
                <div className="space-y-2">
                    <Label>{blurType === 'mosaic' ? 'Mosaic Size' : 'Blur Strength'} ({blurStrength}px)</Label>
                    <Slider min={1} max={30} step={1} value={[blurStrength]} onValueChange={([v]) => setBlurStrength(v)} />
                </div>
                <Button onClick={resetBlur} variant="secondary" className="w-full" disabled={!blurApplied}>Reset Custom Effects</Button>
              </TabsContent>
            </Tabs>
             <Button onClick={handleDownload} style={{backgroundColor: 'var(--tool-color)'}} className="w-full">
                <Download className="mr-2" />
                Download Image
             </Button>
          </div>
          <div className="md:col-span-2 space-y-4">
             <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Preview</h3>
             <div className="w-full h-[60vh] bg-muted/20 rounded-lg flex items-center justify-center border overflow-hidden p-2">
              <canvas
                ref={canvasRef}
                className={cn('max-w-full max-h-full object-contain', activeTab === 'custom-blur' && 'cursor-crosshair')}
                onMouseDown={(e) => activeTab === 'custom-blur' && (setIsPainting(true), paintEffect(e))}
                onMouseUp={() => activeTab === 'custom-blur' && setIsPainting(false)}
                onMouseLeave={() => activeTab === 'custom-blur' && setIsPainting(false)}
                onMouseMove={paintEffect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
