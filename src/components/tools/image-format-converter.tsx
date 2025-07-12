
"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, Download, RefreshCw, X } from 'lucide-react';

interface ImageFormatConverterProps {
  color?: string;
}

type OutputFormat = 'jpeg' | 'png' | 'webp' | 'bmp';

export function ImageFormatConverter({ color = 'hsl(var(--primary))' }: ImageFormatConverterProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
        description: 'Please upload an image file.',
        variant: 'destructive',
      });
      return;
    }
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setConvertedUrl(null);
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

  const convertImage = async () => {
    if (!originalFile) return;

    setIsProcessing(true);

    const image = new window.Image();
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

      // For formats that don't support transparency like JPEG, fill the background
      if (outputFormat === 'jpeg' || outputFormat === 'bmp') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(image, 0, 0);

      const mimeType = `image/${outputFormat}`;
      const dataUrl = canvas.toDataURL(mimeType, 1.0);
      setConvertedUrl(dataUrl);
      setIsProcessing(false);
    };

    image.onerror = () => {
      toast({ title: 'Error', description: 'Failed to load image for conversion.', variant: 'destructive' });
      setIsProcessing(false);
    };
  };

  const handleDownload = () => {
    if (!convertedUrl || !originalFile) return;
    const a = document.createElement('a');
    a.href = convertedUrl;
    const name = originalFile.name.substring(0, originalFile.name.lastIndexOf('.'));
    a.download = `${name}.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setConvertedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" style={{ '--tool-color': color } as React.CSSProperties}>
      {!originalFile ? (
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
            <span className="text-sm">JPG, PNG, WebP, BMP supported</span>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            id="image-upload"
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/bmp"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4 rounded-lg border p-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Convert Image</h3>
                <Button onClick={handleReset} variant="ghost" size="sm"><X className="mr-2 h-4 w-4" /> Reset</Button>
            </div>
            <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border">
              {originalUrl && <Image src={originalUrl} alt="Original" fill style={{ objectFit: 'contain' }} />}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-end pt-4">
              <div className="space-y-2 w-full sm:w-auto">
                <Label htmlFor="output-format">Convert to</Label>
                <Select value={outputFormat} onValueChange={(value: OutputFormat) => setOutputFormat(value)}>
                  <SelectTrigger id="output-format" className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="bmp">BMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={convertImage} disabled={isProcessing} style={{ backgroundColor: 'var(--tool-color)' }}>
                <RefreshCw className="mr-2" />
                {isProcessing ? 'Converting...' : 'Convert'}
              </Button>
            </div>
          </div>

          {convertedUrl && (
            <div className="space-y-4 rounded-lg border p-4">
               <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Converted Image</h3>
                <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border">
                    <Image src={convertedUrl} alt="Converted" fill style={{ objectFit: 'contain' }} />
                </div>
                 <div className="text-center">
                    <Button onClick={handleDownload} variant="secondary">
                        <Download className="mr-2" />
                        Download
                    </Button>
                </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
