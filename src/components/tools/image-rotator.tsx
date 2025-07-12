
"use client";

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, X } from 'lucide-react';

interface ImageRotatorProps {
  color?: string;
}

export function ImageRotator({ color = 'hsl(var(--primary))' }: ImageRotatorProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

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
    const url = URL.createObjectURL(file);
    setOriginalFile(file);
    setImageUrl(url);
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

  const transformImage = (transformation: 'rotate-cw' | 'rotate-ccw' | 'flip-h' | 'flip-v') => {
    if (!imageUrl) return;

    setIsProcessing(true);
    const image = new window.Image();
    image.src = imageUrl;

    image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsProcessing(false);
            return;
        }

        switch (transformation) {
            case 'rotate-cw':
            case 'rotate-ccw':
                canvas.width = image.height;
                canvas.height = image.width;
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(transformation === 'rotate-cw' ? 90 * Math.PI / 180 : -90 * Math.PI / 180);
                ctx.drawImage(image, -image.width / 2, -image.height / 2);
                break;
            case 'flip-h':
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.translate(image.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(image, 0, 0);
                break;
            case 'flip-v':
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.translate(0, image.height);
                ctx.scale(1, -1);
                ctx.drawImage(image, 0, 0);
                break;
        }

        const dataUrl = canvas.toDataURL(originalFile?.type || 'image/png');
        setImageUrl(dataUrl);
        setIsProcessing(false);
    }
    image.onerror = () => {
        toast({ title: 'Error', description: 'Could not load image for transformation.', variant: 'destructive' });
        setIsProcessing(false);
    }
  };


  const handleDownload = () => {
    if (!imageUrl || !originalFile) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    const name = originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) || 'rotated-image';
    const extension = originalFile.name.split('.').pop() || 'png';
    a.download = `${name}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setImageUrl(null);
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
      ) : (
        <div className="space-y-6">
          <div className="space-y-4 rounded-lg border p-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Rotate & Flip</h3>
                <Button onClick={handleReset} variant="ghost" size="sm"><X className="mr-2 h-4 w-4" /> Reset</Button>
            </div>
            <div className="flex justify-center p-4 bg-muted/20 rounded-lg min-h-[40vh]">
              {imageUrl && <Image src={imageUrl} alt="Transformed preview" width={500} height={500} style={{ maxHeight: '40vh', width: 'auto', objectFit: 'contain' }}/>}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <Button onClick={() => transformImage('rotate-ccw')} variant="outline" disabled={isProcessing}><RotateCcw className="mr-2" /> Rotate Left</Button>
                <Button onClick={() => transformImage('rotate-cw')} variant="outline" disabled={isProcessing}><RotateCw className="mr-2" /> Rotate Right</Button>
                <Button onClick={() => transformImage('flip-h')} variant="outline" disabled={isProcessing}><FlipHorizontal className="mr-2" /> Flip Horizontal</Button>
                <Button onClick={() => transformImage('flip-v')} variant="outline" disabled={isProcessing}><FlipVertical className="mr-2" /> Flip Vertical</Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button onClick={handleDownload} disabled={!imageUrl || isProcessing} style={{ backgroundColor: 'var(--tool-color)' }}>
              <Download className="mr-2" />
              Download Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
