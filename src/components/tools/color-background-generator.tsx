
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { SketchPicker, type ColorResult } from 'react-color';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Download, Copy, Settings, Plus, Trash2, Rows, Columns, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorBackgroundGeneratorProps {
  color?: string;
}

const sizeTemplates = [
    { name: 'Custom', value: 'custom' },
    { name: '16:9 (HD Video)', value: '1920/1080' },
    { name: '4:3 (Traditional Monitor)', value: '1024/768' },
    { name: '1:1 (Square)', value: '1080/1080' },
    { name: '3:2 (DSLR)', value: '1080/720' },
    { name: '9:16 (Story)', value: '1080/1920' },
];

type Mode = 'solid' | 'linear' | 'radial' | 'mesh';
type ColorStop = { id: string; color: string; position: number };

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

export function ColorBackgroundGenerator({ color: toolColor = 'hsl(var(--primary))' }: ColorBackgroundGeneratorProps) {
  const [mode, setMode] = useState<Mode>('linear');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [sizeTemplate, setSizeTemplate] = useState('1920/1080');

  const [solidColor, setSolidColor] = useState('#3B82F6');
  const [gradientAngle, setGradientAngle] = useState(90);
  
  const [colors, setColors] = useState<ColorStop[]>([
    { id: 'c1', color: '#3B82F6', position: 0 },
    { id: 'c2', color: '#EC4899', position: 100 },
  ]);

  const [meshRows, setMeshRows] = useState(2);
  const [meshCols, setMeshCols] = useState(2);
  const [meshColors, setMeshColors] = useState<string[]>(['#3B82F6', '#EC4899', '#F97316', '#10B981']);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const handleSizeTemplateChange = (value: string) => {
      setSizeTemplate(value);
      if (value !== 'custom') {
          const [w, h] = value.split('/').map(Number);
          setWidth(w);
          setHeight(h);
      }
  };

  const addColor = () => {
    const newColor: ColorStop = {
        id: `c${Date.now()}`,
        color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
        position: 100
    };
    setColors([...colors, newColor].sort((a,b) => a.position - b.position));
  };
  
  const removeColor = (id: string) => {
    if (colors.length <= 2) {
      toast({ title: "Cannot remove color", description: "A gradient needs at least two colors.", variant: "destructive" });
      return;
    }
    setColors(colors.filter(c => c.id !== id));
  };

  const updateColor = (id: string, newColor: string) => {
    setColors(colors.map(c => c.id === id ? { ...c, color: newColor } : c));
  };

  const updateColorPosition = (id: string, newPosition: number) => {
    setColors(colors.map(c => c.id === id ? { ...c, position: newPosition } : c).sort((a,b) => a.position - b.position));
  };

  const generateMeshColors = useCallback(() => {
    const count = meshRows * meshCols;
    setMeshColors(Array.from({ length: count }, () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`));
  }, [meshRows, meshCols]);
  
  useEffect(() => {
    generateMeshColors();
  }, [generateMeshColors]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    switch(mode) {
        case 'solid':
            ctx.fillStyle = solidColor;
            ctx.fillRect(0, 0, width, height);
            break;
        case 'linear': {
            const angleRad = gradientAngle * (Math.PI / 180);
            const x0 = width / 2 - (Math.cos(angleRad) * width / 2);
            const y0 = height / 2 - (Math.sin(angleRad) * height / 2);
            const x1 = width / 2 + (Math.cos(angleRad) * width / 2);
            const y1 = height / 2 + (Math.sin(angleRad) * height / 2);
            const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
            colors.forEach(c => gradient.addColorStop(c.position / 100, c.color));
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            break;
        }
        case 'radial': {
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.max(width, height) / 2;
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            colors.forEach(c => gradient.addColorStop(c.position / 100, c.color));
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            break;
        }
        case 'mesh': {
            const cellW = width / meshCols;
            const cellH = height / meshRows;
             for (let r = 0; r < meshRows; r++) {
                for (let c = 0; c < meshCols; c++) {
                    ctx.fillStyle = meshColors[r * meshCols + c];
                    ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
                }
            }
            break;
        }
    }
  }, [width, height, mode, solidColor, gradientAngle, colors, meshRows, meshCols, meshColors]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `background-${mode}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast({ title: 'Downloaded!', description: 'Background saved as PNG.' });
  };
  
  const handleCopyCss = () => {
    let css = '';
    switch(mode) {
        case 'solid':
            css = `background: ${solidColor};`;
            break;
        case 'linear':
            css = `background: linear-gradient(${gradientAngle}deg, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')});`;
            break;
        case 'radial':
            css = `background: radial-gradient(circle, ${colors.map(c => `${c.color} ${c.position}%`).join(', ')});`;
            break;
        case 'mesh':
            toast({ title: 'Not Available', description: 'CSS for mesh gradients is complex and not widely supported. Please download as an image.', variant: 'destructive' });
            return;
    }
    navigator.clipboard.writeText(css);
    toast({ title: 'CSS Copied!', description: 'The background CSS has been copied to your clipboard.' });
  };

  const renderControls = () => {
    switch(mode) {
      case 'solid': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label>Color</Label><ColorPicker color={solidColor} onChange={c => setSolidColor(c.hex)} /></div>
        </div>
      );
      case 'linear':
      case 'radial': return (
        <div className="space-y-4">
          {mode === 'linear' && (
            <div className="space-y-2"><Label>Angle ({gradientAngle}°)</Label><Slider min={0} max={360} value={[gradientAngle]} onValueChange={([v]) => setGradientAngle(v)} /></div>
          )}
          <div className="space-y-2"><Label>Colors</Label>
            <div className="space-y-3">
              {colors.map(c => (
                <div key={c.id} className="flex items-center gap-2 p-2 border rounded-md">
                   <div className="w-2/5">
                        <ColorPicker color={c.color} onChange={newColor => updateColor(c.id, newColor.hex)} />
                   </div>
                   <div className="flex-1">
                        <Slider key={c.id} value={[c.position]} onValueChange={([v]) => updateColorPosition(c.id, v)} />
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeColor(c.id)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addColor}><Plus className="mr-2 h-4 w-4"/> Add Color</Button>
          </div>
        </div>
      );
      case 'mesh': return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Rows ({meshRows})</Label><Slider min={2} max={10} value={[meshRows]} onValueChange={([v]) => setMeshRows(v)} /></div>
                <div className="space-y-2"><Label>Columns ({meshCols})</Label><Slider min={2} max={10} value={[meshCols]} onValueChange={([v]) => setMeshCols(v)} /></div>
            </div>
            <Button variant="outline" size="sm" onClick={generateMeshColors}><RefreshCw className="mr-2 h-4 w-4"/> Randomize Colors</Button>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start" style={{ '--tool-color': toolColor } as React.CSSProperties}>
      <div className="md:col-span-1 space-y-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="solid">Solid</TabsTrigger>
            <TabsTrigger value="linear">Linear</TabsTrigger>
            <TabsTrigger value="radial">Radial</TabsTrigger>
            <TabsTrigger value="mesh">Mesh</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-semibold" style={{color: 'var(--tool-color)'}}>Settings</h3>
          {renderControls()}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleCopyCss} className="w-full" variant="outline"><Copy className="mr-2 h-4 w-4"/> Copy CSS</Button>
          <Button onClick={handleDownload} className="w-full" style={{backgroundColor: 'var(--tool-color)'}}><Download className="mr-2 h-4 w-4"/> Download PNG</Button>
        </div>
      </div>
      <div className="md:col-span-2 space-y-4">
         <h3 className="font-semibold" style={{color: 'var(--tool-color)'}}>Preview</h3>
         <div className="w-full aspect-video bg-muted/20 rounded-lg flex items-center justify-center border overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
         </div>
         <div className="space-y-4 rounded-lg border p-4">
           <h3 className="font-semibold" style={{color: 'var(--tool-color)'}}>Output Size</h3>
           <div className="space-y-2">
            <Label htmlFor="size-template">Size Template</Label>
             <Select value={sizeTemplate} onValueChange={handleSizeTemplateChange}>
                <SelectTrigger id="size-template"><SelectValue/></SelectTrigger>
                <SelectContent>{sizeTemplates.map(t => <SelectItem key={t.value} value={t.value}>{t.name}</SelectItem>)}</SelectContent>
             </Select>
           </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="width">Width (px)</Label><Input id="width" type="number" value={width} onChange={e => setWidth(Number(e.target.value))} onFocus={() => setSizeTemplate('custom')} /></div>
            <div className="space-y-2"><Label htmlFor="height">Height (px)</Label><Input id="height" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} onFocus={() => setSizeTemplate('custom')} /></div>
           </div>
        </div>
      </div>
    </div>
  );
}
