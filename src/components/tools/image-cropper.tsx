
"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import Image from 'next/image';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { SketchPicker, type ColorResult } from 'react-color';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, Download, Scissors, X, Wand2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


interface ImageCropperProps {
  color?: string;
}

const aspectRatios = [
    { name: 'Free', value: 'free' },
    { name: '1:1 (Square)', value: '1/1' },
    { name: '4:3 (Standard)', value: '4/3' },
    { name: '16:9 (Widescreen)', value: '16/9' },
    { name: '9:16 (Story)', value: '9/16' },
]

type BorderType = 'solid' | 'gradient';

export function ImageCropper({ color = 'hsl(var(--primary))' }: ImageCropperProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('free');
  const [isProfileMode, setIsProfileMode] = useState(false);
  
  const [borderType, setBorderType] = useState<BorderType>('solid');
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [gradientStart, setGradientStart] = useState('#ff0000');
  const [gradientEnd, setGradientEnd] = useState('#0000ff');
  const [hasBorder, setHasBorder] = useState(true);

  const cropperRef = useRef<ReactCropperElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isProfileMode) {
      setAspectRatio('1/1');
    }
  }, [isProfileMode]);
  
  useEffect(() => {
    // This is a bit of a hack to get the container, a more robust solution would be to get the element from the ref
    const cropperHTMLElem = document.querySelector('.cropper-container');
    if(cropperHTMLElem){
        if (isProfileMode) {
            cropperHTMLElem.classList.add('cropper-profile-mode');
        } else {
            cropperHTMLElem.classList.remove('cropper-profile-mode');
        }
    }
  }, [isProfileMode, originalUrl]);


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
    setCroppedUrl(null);
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
  
  const cropImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (typeof cropper === 'undefined' || !originalFile) return;

    const sourceCanvas = cropper.getCroppedCanvas();
    if (!sourceCanvas) return;
    
    if (isProfileMode) {
        const circularCanvas = document.createElement('canvas');
        const context = circularCanvas.getContext('2d');
        if (!context) return;
        
        const size = Math.min(sourceCanvas.width, sourceCanvas.height);
        circularCanvas.width = size;
        circularCanvas.height = size;

        const borderSize = hasBorder ? size * 0.05 : 0;
        
        // Draw border
        if(hasBorder) {
            if (borderType === 'solid') {
              context.fillStyle = borderColor;
            } else {
              const gradient = context.createLinearGradient(0, 0, size, size);
              gradient.addColorStop(0, gradientStart);
              gradient.addColorStop(1, gradientEnd);
              context.fillStyle = gradient;
            }
            context.beginPath();
            context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
            context.fill();
        }

        context.save();
        context.beginPath();
        context.arc(size / 2, size / 2, (size / 2) - borderSize, 0, 2 * Math.PI);
        context.closePath();
        context.clip();
        
        context.drawImage(
            sourceCanvas,
            0,
            0,
            sourceCanvas.width,
            sourceCanvas.height,
            0,
            0,
            size,
            size
        );
        context.restore();
        setCroppedUrl(circularCanvas.toDataURL('image/png', 1.0));
    } else {
        setCroppedUrl(sourceCanvas.toDataURL(originalFile.type, 1.0));
    }
  };

  const handleDownload = () => {
    if (!croppedUrl || !originalFile) return;
    const a = document.createElement('a');
    a.href = croppedUrl;
    const extension = isProfileMode ? 'png' : originalFile?.name.split('.').pop() || 'png';
    a.download = `cropped-image.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setCroppedUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const getAspectRatioValue = () => {
      if (aspectRatio === 'free') return undefined;
      const [w, h] = aspectRatio.split('/');
      return Number(w) / Number(h);
  }

  const ColorPicker = ({ color, onChange }: { color: string, onChange: (color: ColorResult) => void }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
          <span className="ml-2">Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0">
        <SketchPicker color={color} onChangeComplete={onChange} />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" style={{'--tool-color': color} as React.CSSProperties}>
      {!originalUrl && (
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
      )}
      
      {originalUrl && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Original</h3>
                <Button onClick={handleReset} variant="ghost" size="sm"><X className="mr-2 h-4 w-4" /> Reset</Button>
              </div>
              <div className="w-full h-96 bg-muted/20 rounded-lg overflow-hidden border">
                <Cropper
                  ref={cropperRef}
                  src={originalUrl}
                  style={{ height: '100%', width: '100%' }}
                  aspectRatio={getAspectRatioValue()}
                  viewMode={1}
                  dragMode="move"
                  background={false}
                  autoCropArea={1}
                  responsive
                  checkOrientation={false}
                  guides={true}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Result</h3>
              <div className="w-full h-96 bg-muted/20 rounded-lg flex items-center justify-center border overflow-hidden p-4">
                {croppedUrl ? (
                  <Image src={croppedUrl} alt="Cropped" width={500} height={500} style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} />
                ) : (
                  <p className="text-muted-foreground text-center p-4">Click "Crop Image" to see the result</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4 rounded-lg border p-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                <div className="space-y-2">
                    <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                     <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isProfileMode}>
                        <SelectTrigger id="aspectRatio">
                            <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent>
                            {aspectRatios.map(ratio => (
                                <SelectItem key={ratio.value} value={ratio.value}>{ratio.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Profile Picture Mode</Label>
                    <div className="flex items-center space-x-2 h-10">
                        <Switch id="profile-mode" checked={isProfileMode} onCheckedChange={setIsProfileMode} />
                        <Label htmlFor="profile-mode">Enable Circular Crop</Label>
                    </div>
                </div>
            </div>

            {isProfileMode && (
                <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Border</Label>
                            <div className="flex items-center space-x-2 h-10">
                                <Switch id="border-switch" checked={hasBorder} onCheckedChange={setHasBorder} />
                                <Label htmlFor="border-switch">Enable Border</Label>
                            </div>
                        </div>

                        {hasBorder && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="borderType">Border Type</Label>
                                    <Select value={borderType} onValueChange={(value) => setBorderType(value as BorderType)}>
                                        <SelectTrigger id="borderType">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="solid">Solid</SelectItem>
                                            <SelectItem value="gradient">Gradient</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                  {borderType === 'solid' && (
                                    <>
                                        <Label>Border Color</Label>
                                        <div className="h-10 flex items-center">
                                          <ColorPicker color={borderColor} onChange={(color) => setBorderColor(color.hex)} />
                                        </div>
                                    </>
                                  )}
                                  {borderType === 'gradient' && (
                                    <div className="flex gap-2">
                                        <div>
                                            <Label>Start Color</Label>
                                             <div className="h-10 flex items-center">
                                                <ColorPicker color={gradientStart} onChange={(color) => setGradientStart(color.hex)} />
                                             </div>
                                        </div>
                                        <div>
                                            <Label>End Color</Label>
                                             <div className="h-10 flex items-center">
                                                <ColorPicker color={gradientEnd} onChange={(color) => setGradientEnd(color.hex)} />
                                             </div>
                                        </div>
                                    </div>
                                  )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}


            <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-4">
                <Button onClick={cropImage} style={{backgroundColor: 'var(--tool-color)'}}>
                    {isProfileMode ? <Wand2 className="mr-2" /> : <Scissors className="mr-2" />}
                    {isProfileMode ? 'Create Profile Picture' : 'Crop Image'}
                </Button>
                <Button onClick={handleDownload} disabled={!croppedUrl} variant="secondary">
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
