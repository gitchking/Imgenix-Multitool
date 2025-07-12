
"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { SketchPicker, type ColorResult } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, Download, FileSignature, X, Text, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WatermarkImageProps {
  color?: string;
}

const fonts = [ "Arial", "Verdana", "Georgia", "Times New Roman", "Courier New", "Lucida Console", "Impact", "Comic Sans MS" ];
type FillType = 'solid' | 'gradient' | 'stroke';
type PositionType = 'tile' | 'center' | 'bottom-right' | 'top-left';


const ColorPicker = ({ color, onChange }: { color: string, onChange: (color: ColorResult) => void }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 w-full justify-start text-left font-normal">
          <div className="w-4 h-4 rounded-full border mr-2" style={{ backgroundColor: color }} />
          <span>{color}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0">
        <SketchPicker color={color} onChangeComplete={onChange} />
      </PopoverContent>
    </Popover>
);

export function WatermarkImage({ color = 'hsl(var(--primary))' }: WatermarkImageProps) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [text, setText] = useState('Watermark');
  const [font, setFont] = useState('Arial');
  const [size, setSize] = useState(50);
  const [opacity, setOpacity] = useState(0.5);
  const [rotation, setRotation] = useState(-30);
  
  const [fillType, setFillType] = useState<FillType>('solid');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [gradientStart, setGradientStart] = useState('#ff0000');
  const [gradientEnd, setGradientEnd] = useState('#0000ff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const [hasShadow, setHasShadow] = useState(true);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(5);
  
  const [positionType, setPositionType] = useState<PositionType>('tile');
  const [tileSpacing, setTileSpacing] = useState(150);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { toast } = useToast();

  const drawWatermark = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0);

    // Prepare text properties
    ctx.font = `${size}px ${font}`;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = fillColor;

    if (fillType === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, gradientStart);
        gradient.addColorStop(1, gradientEnd);
        ctx.fillStyle = gradient;
    }

    if (hasShadow) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowBlur / 2;
        ctx.shadowOffsetY = shadowBlur / 2;
    } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    const drawText = (x: number, y: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.textAlign = "center";
        
        ctx.fillText(text, 0, 0);

        if (fillType === 'stroke') {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.strokeText(text, 0, 0);
        }
        ctx.restore();
    };

    if (positionType === 'tile') {
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = size;
        const stepX = textWidth + tileSpacing;
        const stepY = textHeight + tileSpacing;
        for (let x = -stepX; x < canvas.width + stepX; x += stepX) {
            for (let y = -stepY; y < canvas.height + stepY; y += stepY) {
                drawText(x, y);
            }
        }
    } else {
        let x = canvas.width / 2;
        let y = canvas.height / 2;

        if (positionType === 'bottom-right') {
            x = canvas.width - (ctx.measureText(text).width / 2) - 20;
            y = canvas.height - size - 20;
        } else if (positionType === 'top-left') {
            x = (ctx.measureText(text).width / 2) + 20;
            y = size + 20;
        }
        drawText(x, y);
    }
    ctx.globalAlpha = 1.0;
  };

  useEffect(() => {
      if (imageRef.current && originalUrl) {
          drawWatermark();
      }
  }, [
      text, font, size, opacity, rotation, 
      fillType, fillColor, gradientStart, gradientEnd, strokeColor, strokeWidth,
      hasShadow, shadowColor, shadowBlur,
      positionType, tileSpacing,
      originalUrl
  ]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid File Type', description: 'Please upload an image file.', variant: 'destructive' });
        return;
    }
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
        imageRef.current = img;
        drawWatermark();
    };
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

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalFile) return;
    const link = document.createElement('a');
    link.download = `watermarked-${originalFile.name}`;
    link.href = canvas.toDataURL(originalFile.type, 1.0);
    link.click();
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    imageRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" style={{ '--tool-color': color } as React.CSSProperties}>
      {!originalUrl ? (
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
            <span className="font-medium">Drag & drop an image or click to browse</span>
          </div>
          <Input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Controls</h3>
                <Button onClick={handleReset} variant="ghost" size="sm"><X className="mr-2 h-4 w-4" /> Reset Image</Button>
            </div>
             <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text"><Text className="mr-2"/>Text</TabsTrigger>
                <TabsTrigger value="position"><Settings className="mr-2"/>Position</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="space-y-4 rounded-lg border p-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="watermark-text">Watermark Text</Label>
                    <Input id="watermark-text" value={text} onChange={e => setText(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="font-select">Font</Label>
                    <Select value={font} onValueChange={setFont}>
                      <SelectTrigger id="font-select"><SelectValue/></SelectTrigger>
                      <SelectContent>{fonts.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size ({size}px)</Label>
                    <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={10} max={200} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fill Type</Label>
                    <Select value={fillType} onValueChange={(v: FillType) => setFillType(v)}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="stroke">Outline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fillType === 'solid' && <div className="space-y-2"><Label>Color</Label><ColorPicker color={fillColor} onChange={c => setFillColor(c.hex)} /></div>}
                  {fillType === 'gradient' && <div className="flex gap-2"><div className="space-y-2 w-1/2"><Label>Start</Label><ColorPicker color={gradientStart} onChange={c => setGradientStart(c.hex)} /></div><div className="space-y-2 w-1/2"><Label>End</Label><ColorPicker color={gradientEnd} onChange={c => setGradientEnd(c.hex)} /></div></div>}
                  {fillType === 'stroke' && <div className="space-y-2"><Label>Outline Color</Label><ColorPicker color={strokeColor} onChange={c => setStrokeColor(c.hex)} /><Label>Outline Width ({strokeWidth}px)</Label><Slider value={[strokeWidth]} onValueChange={([v]) => setStrokeWidth(v)} min={1} max={10} /></div>}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Label htmlFor="shadow-switch">Text Shadow</Label>
                    <Switch id="shadow-switch" checked={hasShadow} onCheckedChange={setHasShadow} />
                  </div>
                  {hasShadow && <div className="space-y-2"><Label>Shadow Color</Label><ColorPicker color={shadowColor} onChange={c => setShadowColor(c.hex)} /><Label>Shadow Blur ({shadowBlur}px)</Label><Slider value={[shadowBlur]} onValueChange={([v]) => setShadowBlur(v)} min={0} max={25} /></div>}
              </TabsContent>
               <TabsContent value="position" className="space-y-4 rounded-lg border p-4 mt-2">
                 <div className="space-y-2">
                    <Label>Positioning</Label>
                    <Select value={positionType} onValueChange={(v: PositionType) => setPositionType(v)}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tile">Tile</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="top-left">Top Left</SelectItem>
                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 {positionType === 'tile' && <div className="space-y-2"><Label>Tile Spacing ({tileSpacing}px)</Label><Slider value={[tileSpacing]} onValueChange={([v]) => setTileSpacing(v)} min={50} max={500} /></div>}
                 <div className="space-y-2">
                    <Label>Rotation ({rotation}°)</Label>
                    <Slider value={[rotation]} onValueChange={([v]) => setRotation(v)} min={-180} max={180} />
                 </div>
                  <div className="space-y-2">
                    <Label>Opacity ({Math.round(opacity * 100)}%)</Label>
                    <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={0} max={1} step={0.05} />
                  </div>
              </TabsContent>
            </Tabs>
             <Button onClick={handleDownload} style={{backgroundColor: 'var(--tool-color)'}} className="w-full">
                <Download className="mr-2" /> Download Image
             </Button>
          </div>
          <div className="md:col-span-2 space-y-4">
             <h3 className="text-lg font-semibold" style={{color: 'var(--tool-color)'}}>Preview</h3>
             <div className="w-full h-[60vh] bg-muted/20 rounded-lg flex items-center justify-center border overflow-hidden p-2">
                <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
