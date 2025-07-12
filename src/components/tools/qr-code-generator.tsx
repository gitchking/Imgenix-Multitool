
"use client";

import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SketchPicker, type ColorResult } from 'react-color';
import { Download, Upload, Trash2, Settings, Palette, QrCode as QrCodeIcon, ScanLine, AlertCircle, FileImage, Copy, CopyCheck, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface QrCodeGeneratorProps {
  color?: string;
}

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

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

const GeneratorTab = ({ toolColor }: { toolColor: string }) => {
    const [text, setText] = useState('https://imgenix.net');
    const [size, setSize] = useState(256);
    const [darkColor, setDarkColor] = useState('#000000');
    const [lightColor, setLightColor] = useState('#ffffff');
    const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('M');
    const [logo, setLogo] = useState<string | null>(null);
    const [logoSize, setLogoSize] = useState(0.3);
    const [removeLogoBg, setRemoveLogoBg] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const generateQrCode = useCallback(() => {
        if (!text) {
            const canvas = canvasRef.current;
            if(canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        };

        const qrOptions = {
            errorCorrectionLevel,
            width: size,
            margin: 2,
            color: {
                dark: darkColor,
                light: lightColor,
            },
        };

        QRCode.toCanvas(canvasRef.current, text, qrOptions, (error) => {
            if (error) {
                toast({ title: "Error", description: "Could not generate QR code.", variant: 'destructive' });
                return;
            }

            if (logo) {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const logoImg = new Image();
                logoImg.src = logo;
                logoImg.onload = () => {
                    const finalLogoSize = canvas.width * logoSize;
                    const logoX = (canvas.width - finalLogoSize) / 2;
                    const logoY = (canvas.height - finalLogoSize) / 2;
                    
                    if (removeLogoBg) {
                        ctx.fillStyle = lightColor;
                        ctx.fillRect(logoX, logoY, finalLogoSize, finalLogoSize);
                    }
                    
                    ctx.drawImage(logoImg, logoX, logoY, finalLogoSize, finalLogoSize);
                };
            }
        });
    }, [text, size, darkColor, lightColor, errorCorrectionLevel, logo, logoSize, removeLogoBg, toast]);

    useEffect(() => {
        generateQrCode();
    }, [generateQrCode]);

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast({ title: "Invalid File", description: "Please upload an image for the logo.", variant: 'destructive' });
                return;
            }
            setLogo(URL.createObjectURL(file));
        }
    };
    
    const removeLogo = () => setLogo(null);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `qrcode.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1 space-y-6">
                 <h3 className="text-lg font-semibold" style={{color: toolColor}}>Settings</h3>
                 <div className="space-y-2">
                    <Label htmlFor="qr-text">Text or URL</Label>
                    <Input id="qr-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter content for QR code" className="text-base"/>
                 </div>
                 
                 <Tabs defaultValue="style" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="style"><Palette className="mr-2"/>Style</TabsTrigger>
                        <TabsTrigger value="logo"><Settings className="mr-2"/>Logo</TabsTrigger>
                    </TabsList>
                    <TabsContent value="style" className="space-y-4 rounded-lg border p-4 mt-2">
                         <div className="space-y-2">
                            <Label>QR Code Color</Label>
                            <ColorPicker color={darkColor} onChange={c => setDarkColor(c.hex)} />
                         </div>
                         <div className="space-y-2">
                            <Label>Background Color</Label>
                            <ColorPicker color={lightColor} onChange={c => setLightColor(c.hex)} />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="error-correction">Error Correction</Label>
                            <Select value={errorCorrectionLevel} onValueChange={(v: ErrorCorrectionLevel) => setErrorCorrectionLevel(v)}>
                                <SelectTrigger id="error-correction"><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">Low (recovers ~7% loss)</SelectItem>
                                    <SelectItem value="M">Medium (recovers ~15% loss)</SelectItem>
                                    <SelectItem value="Q">Quartile (recovers ~25% loss)</SelectItem>
                                    <SelectItem value="H">High (recovers ~30% loss)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>
                    <TabsContent value="logo" className="space-y-4 rounded-lg border p-4 mt-2">
                        {!logo ? (
                            <Button variant="outline" className="w-full" onClick={() => logoInputRef.current?.click()}>
                                <Upload className="mr-2"/> Upload Logo
                            </Button>
                        ) : (
                            <div className="space-y-2 text-center">
                                <img src={logo} alt="Logo preview" className="w-24 h-24 mx-auto object-contain border rounded-md"/>
                                <Button variant="destructive" size="sm" onClick={removeLogo}><Trash2 className="mr-2"/> Remove Logo</Button>
                            </div>
                        )}
                        <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                        
                        {logo && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label>Logo Size ({Math.round(logoSize*100)}%)</Label>
                                    <Slider value={[logoSize]} onValueChange={([v]) => setLogoSize(v)} min={0.1} max={0.4} step={0.05} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="logo-bg">Clear area behind logo</Label>
                                    <Switch id="logo-bg" checked={removeLogoBg} onCheckedChange={setRemoveLogoBg} />
                                </div>
                            </div>
                        )}
                    </TabsContent>
                 </Tabs>

            </div>
            <div className="md:col-span-2 space-y-4">
                 <h3 className="font-semibold" style={{color: toolColor}}>Preview</h3>
                 <div className="w-full aspect-square bg-muted/20 rounded-lg flex items-center justify-center border overflow-hidden p-4">
                    <canvas ref={canvasRef} />
                 </div>
                 <div className="space-y-4 rounded-lg border p-4">
                    <div className="space-y-2">
                        <Label>Image Size ({size}px)</Label>
                        <Slider value={[size]} onValueChange={([v]) => setSize(v)} min={64} max={1024} step={32} />
                    </div>
                    <Button onClick={handleDownload} className="w-full" style={{backgroundColor: toolColor}} disabled={!text}>
                        <Download className="mr-2"/> Download PNG
                    </Button>
                </div>
            </div>
        </div>
    );
}

const ScannerTab = ({ toolColor }: { toolColor: string }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast({ title: 'Invalid File', description: 'Please select an image file.', variant: 'destructive' });
            return;
        }
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setScannedResult(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation(), setIsDragging(true));
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation(), setIsDragging(false));
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation());
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
    };

    useEffect(() => {
        if (!imageUrl) return;
        
        const image = new window.Image();
        image.src = imageUrl;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                toast({ title: 'Error', description: 'Could not process image.', variant: 'destructive' });
                return;
            }
            ctx.drawImage(image, 0, 0, image.width, image.height);
            const imageData = ctx.getImageData(0, 0, image.width, image.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                setScannedResult(code.data);
                toast({ title: 'Success!', description: 'QR Code scanned from image.' });
            } else {
                setScannedResult(null);
                toast({ title: 'No QR Code Found', description: 'Could not detect a QR code in the selected image.', variant: 'destructive' });
            }
        };
    }, [imageUrl, toast]);

    const handleReset = () => {
        setImageFile(null);
        setImageUrl(null);
        setScannedResult(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCopy = () => {
        if (!scannedResult) return;
        navigator.clipboard.writeText(scannedResult);
        setIsCopied(true);
        toast({ title: 'Copied to clipboard!' });
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            {!imageUrl ? (
                <div
                    onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "flex flex-col items-center justify-center h-80 w-full max-w-lg rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                        isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="h-10 w-10" />
                        <span className="font-medium">Drop an image here or click to upload</span>
                        <span className="text-sm">Image containing a QR Code</span>
                    </div>
                    <Input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
            ) : (
                <div className="w-full max-w-lg space-y-4">
                    <div className="relative aspect-square rounded-lg border overflow-hidden">
                        <Image src={imageUrl} alt="Uploaded for QR scan" layout="fill" objectFit="contain" />
                    </div>
                    <Button onClick={handleReset} variant="outline" className="w-full">
                        <X className="mr-2" />
                        Clear Image
                    </Button>
                </div>
            )}
            
            {scannedResult && (
                <div className="w-full max-w-lg space-y-4 rounded-lg border p-4">
                    <h3 className="font-semibold" style={{color: toolColor}}>Scan Result</h3>
                    <p className="p-2 bg-muted rounded-md break-all">{scannedResult}</p>
                    <Button onClick={handleCopy} variant="secondary" className="w-full">
                        {isCopied ? <CopyCheck className="mr-2"/> : <Copy className="mr-2"/>}
                        {isCopied ? 'Copied!' : 'Copy Result'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export function QrCodeGenerator({ color: toolColor = 'hsl(var(--primary))' }: QrCodeGeneratorProps) {
    const [activeTab, setActiveTab] = useState("generator");

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="generator"><QrCodeIcon className="mr-2"/>Generator</TabsTrigger>
                <TabsTrigger value="scanner"><ScanLine className="mr-2"/>Scanner</TabsTrigger>
            </TabsList>
            <TabsContent value="generator" className="mt-6">
                <GeneratorTab toolColor={toolColor} />
            </TabsContent>
            <TabsContent value="scanner" className="mt-6">
                 <ScannerTab toolColor={toolColor} />
            </TabsContent>
        </Tabs>
    );
}
