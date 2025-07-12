
"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, Download, Percent, FileImage, X } from 'lucide-react';
import prettyBytes from 'pretty-bytes';

interface ImageCompressorProps {
  color?: string;
}

export function ImageCompressor({ color = 'hsl(var(--primary))' }: ImageCompressorProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | Blob | null>(null);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file (e.g., JPG, PNG, WebP).',
        variant: 'destructive',
      });
      return;
    }
    setOriginalFile(file);
    setOriginalSize(file.size);
    setOriginalUrl(URL.createObjectURL(file));
    setCompressedUrl(null);
    setCompressedFile(null);
    setCompressedSize(0);
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
    if (file) {
      handleFile(file);
    }
  };

  const compressImage = async () => {
    if (!originalFile) return;

    setIsProcessing(true);
    
    const image = document.createElement('img');
    image.src = URL.createObjectURL(originalFile);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast({ title: 'Error', description: 'Could not get canvas context.', variant: 'destructive' });
        setIsProcessing(false);
        return;
      }
      ctx.drawImage(image, 0, 0);
      
      const mimeType = originalFile.type;
      const qualityValue = quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (blob.size > originalFile.size) {
              toast({
                title: 'Compression Not Effective',
                description: 'The compressed image is larger than the original. The original will be used.',
              });
              setCompressedFile(originalFile);
              setCompressedUrl(URL.createObjectURL(originalFile));
              setCompressedSize(originalFile.size);
            } else {
              setCompressedFile(blob);
              setCompressedUrl(URL.createObjectURL(blob));
              setCompressedSize(blob.size);
            }
          } else {
             toast({ title: 'Error', description: 'Compression failed.', variant: 'destructive' });
          }
          setIsProcessing(false);
        },
        mimeType,
        qualityValue
      );
    };
    image.onerror = () => {
        toast({ title: 'Error', description: 'Failed to load image for compression.', variant: 'destructive' });
        setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !originalFile || !compressedFile) return;
    const a = document.createElement('a');
    a.href = compressedUrl;

    const nameParts = originalFile.name.split('.');
    const extension = nameParts.pop();
    a.download = `${nameParts.join('.')}-compressed.${extension}`;
    
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
  };
  
  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setCompressedFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }
  
  const sizeReduction = originalSize > 0 && compressedSize > 0 ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

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
            <span className="text-sm">JPG, PNG, WebP supported</span>
          </div>
          <Input 
            ref={fileInputRef}
            type="file"
            id="image-upload"
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
          />
        </div>
      )}
      
      {originalFile && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Original Image</h3>
                <Button onClick={handleReset} variant="ghost" size="sm"><X className="mr-2 h-4 w-4" /> Reset</Button>
              </div>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                {originalUrl && <Image src={originalUrl} alt="Original" fill style={{ objectFit: 'contain' }} />}
              </div>
              <div className="text-sm text-muted-foreground">Size: {prettyBytes(originalSize)}</div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Compressed Image</h3>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted/20 flex items-center justify-center">
                {isProcessing && <p>Processing...</p>}
                {!isProcessing && compressedUrl && <Image src={compressedUrl} alt="Compressed" fill style={{ objectFit: 'contain' }} />}
                {!isProcessing && !compressedUrl && <p className="text-muted-foreground text-center p-4">Adjust quality and press 'Compress' to see the result</p>}
              </div>
              <div className="text-sm text-muted-foreground">Size: {compressedSize > 0 ? prettyBytes(compressedSize) : 'N/A'}</div>
            </div>
          </div>
          
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="quality">Compression Quality</Label>
                <span className="font-medium" style={{color: 'var(--tool-color)'}}>{quality}%</span>
              </div>
              <div className="flex items-center gap-4">
                 <Percent className="text-muted-foreground" />
                 <Slider
                    id="quality"
                    min={10}
                    max={100}
                    step={5}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    disabled={isProcessing}
                    style={{'--slider-color': 'var(--tool-color)'} as React.CSSProperties}
                    className="[&_>span:first-child>span]:bg-[--slider-color] [&_>span:last-child]:border-[--slider-color]"
                  />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                 {compressedSize > 0 && (
                    <div className="text-sm font-medium">
                        Size Reduction: <span className={sizeReduction > 0 ? "text-green-600" : "text-red-600"}>{sizeReduction.toFixed(1)}%</span>
                    </div>
                )}
                <div className="flex gap-2">
                    <Button onClick={compressImage} disabled={isProcessing} style={{backgroundColor: 'var(--tool-color)'}}>
                        <FileImage className="mr-2" />
                        {isProcessing ? 'Compressing...' : 'Compress Image'}
                    </Button>
                    <Button onClick={handleDownload} disabled={!compressedUrl || isProcessing} variant="secondary">
                        <Download className="mr-2" />
                        Download
                    </Button>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

    