
"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, Download, RefreshCw, X, Link as LinkIcon, Link2Off, Wand2 } from 'lucide-react';
import prettyBytes from 'pretty-bytes';

interface ImageUpscalerProps {
  color?: string;
}

export function ImageUpscaler({ color = 'hsl(var(--primary))' }: ImageUpscalerProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [originalSize, setOriginalSize] = useState(0);
  const [resizedSize, setResizedSize] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (originalFile) {
        const image = new window.Image();
        image.src = URL.createObjectURL(originalFile);
        image.onload = () => {
            setOriginalWidth(image.width);
            setOriginalHeight(image.height);
            setWidth(image.width);
            setHeight(image.height);
        };
    }
  }, [originalFile]);

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
    setOriginalSize(file.size);
    setResizedUrl(null);
    setResizedSize(0);
  };
  
  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (maintainAspectRatio && originalWidth > 0) {
      const aspectRatio = originalHeight / originalWidth;
      setHeight(Math.round(newWidth * aspectRatio));
    }
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (maintainAspectRatio && originalHeight > 0) {
      const aspectRatio = originalWidth / originalHeight;
      setWidth(Math.round(newHeight * aspectRatio));
    }
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

  const resizeImage = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    
    const image = new window.Image();
    image.src = URL.createObjectURL(originalFile);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast({ title: 'Error', description: 'Could not get canvas context.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, width, height);
      
      const isUpscaling = width > originalWidth || height > originalHeight;

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
             toast({ title: 'Error', description: 'Resize failed.', variant: 'destructive' });
             setIsProcessing(false);
             return;
          }

          if (isUpscaling) {
            toast({ title: 'Upscaling...', description: 'Applying sharpening filter via API.' });
            try {
              const formData = new FormData();
              formData.append('file', blob, originalFile.name);
              formData.append('strength', '1.0');

              const response = await fetch('/api/sharpen', {
                method: 'POST',
                body: formData,
              });

              if (!response.ok) {
                throw new Error('Sharpening API call failed');
              }

              const sharpenedBlob = await response.blob();
              setResizedUrl(URL.createObjectURL(sharpenedBlob));
              setResizedSize(sharpenedBlob.size);
              toast({ title: 'Upscaled & Sharpened!', description: 'Image quality has been enhanced.' });

            } catch (error) {
              console.error("Failed to apply sharpen filter via API", error);
              toast({ title: 'Warning', description: 'Could not apply sharpening filter. Using regular upscaled image.', variant: 'destructive' });
              setResizedUrl(URL.createObjectURL(blob));
              setResizedSize(blob.size);
            }
          } else {
            setResizedUrl(URL.createObjectURL(blob));
            setResizedSize(blob.size);
          }
          setIsProcessing(false);
        },
        originalFile.type,
        0.95 // Use a high quality setting
      );
    };
    image.onerror = () => {
        toast({ title: 'Error', description: 'Failed to load image for resizing.', variant: 'destructive' });
        setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resizedUrl || !originalFile) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    a.download = `upscaled-${originalFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setResizedUrl(null);
    setOriginalSize(0);
    setResizedSize(0);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setWidth(0);
    setHeight(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" style={{'--tool-color': color} as React.CSSProperties}>
      {!originalFile && (
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
            <span className="text-sm">Any image format supported</span>
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
      )}
      
      {originalFile && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Original</h3>
                <Button onClick={handleReset} variant="ghost" size="sm"><X className="mr-2 h-4 w-4" /> Reset</Button>
              </div>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                {originalUrl && <Image src={originalUrl} alt="Original" fill style={{ objectFit: 'contain' }} />}
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>{originalWidth} x {originalHeight} px</span>
                <span>{prettyBytes(originalSize)}</span>
              </div>
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Upscaled</h3>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted/20 flex items-center justify-center">
                {isProcessing && <p>Processing...</p>}
                {!isProcessing && resizedUrl && <Image src={resizedUrl} alt="Upscaled" fill style={{ objectFit: 'contain' }} />}
                {!isProcessing && !resizedUrl && <p className="text-muted-foreground text-center p-4">Adjust dimensions and press 'Upscale'</p>}
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                 <span>{width} x {height} px</span>
                 <span>{resizedSize > 0 ? prettyBytes(resizedSize) : 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 rounded-lg border p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input id="width" type="number" value={width} onChange={handleWidthChange} disabled={isProcessing} />
                </div>
                <div className="flex items-center justify-center h-10">
                  <Button variant="ghost" size="icon" onClick={() => setMaintainAspectRatio(!maintainAspectRatio)} aria-label="Toggle aspect ratio lock">
                    {maintainAspectRatio ? <LinkIcon className="text-[--tool-color]" /> : <Link2Off />}
                  </Button>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input id="height" type="number" value={height} onChange={handleHeightChange} disabled={isProcessing} />
                </div>
            </div>
             
             { (width > originalWidth || height > originalHeight) &&
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-primary/10 text-primary">
                    <Wand2 className="h-5 w-5" />
                    <p>Upscaling detected. A sharpening filter is applied to enhance clarity (it does not add new detail).</p>
                </div>
            }

            <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-4 border-t mt-4">
                <Button onClick={resizeImage} disabled={isProcessing} style={{backgroundColor: 'var(--tool-color)'}}>
                    <RefreshCw className="mr-2" />
                    {isProcessing ? 'Processing...' : 'Upscale Image'}
                </Button>
                <Button onClick={handleDownload} disabled={!resizedUrl || isProcessing} variant="secondary">
                    <Download className="mr-2" />
                    Download
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
