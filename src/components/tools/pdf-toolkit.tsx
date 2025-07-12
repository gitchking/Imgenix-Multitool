
"use client";

import { useState, useRef, useEffect, ChangeEvent, DragEvent, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Upload, FileText, Image as ImageIcon, Scissors, Combine, Download, FileDown, ArrowLeft, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

// Dynamically construct worker URL to avoid version mismatch
const pdfjsWorkerSrc = `//unpkg.com/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs`;

interface PdfToolkitProps {
  color?: string;
}

const tools: {
  slug: string;
  title: string;
  icon: LucideIcon;
  component: React.FC<any>;
}[] = [
  { slug: 'pdf-to-image', title: 'PDF to Image', icon: ImageIcon, component: PdfToImage },
  { slug: 'image-to-pdf', title: 'Image to PDF', icon: FileDown, component: ImageToPdf },
  { slug: 'pdf-splitter', title: 'PDF Splitter', icon: Scissors, component: PdfSplitter },
];

const FileUploadArea = ({ onFileSelect, accept, helpText }: { onFileSelect: (files: File[]) => void, accept: string, helpText: string }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onFileSelect(Array.from(e.target.files));
        }
    };
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation(), setIsDragging(true));
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation(), setIsDragging(false));
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => (e.preventDefault(), e.stopPropagation());
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            onFileSelect(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
                "flex flex-col items-center justify-center h-60 w-full rounded-lg border-2 border-dashed cursor-pointer transition-colors",
                isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            )}
        >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-10 w-10" />
                <span className="font-medium">Drag & drop files here or click to browse</span>
                <span className="text-sm">{helpText}</span>
            </div>
            <Input
                ref={fileInputRef}
                type="file"
                multiple={accept.includes('image/*')}
                onChange={handleFileChange}
                className="hidden"
                accept={accept}
            />
        </div>
    );
};

function PdfToImage({ color }: { color?: string }) {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const { toast } = useToast();
    const [pdfjs, setPdfjs] = useState<any>(null);

    useEffect(() => {
        const loadPdfjs = async () => {
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;
            setPdfjs(pdfjsLib);
        };
        loadPdfjs();
    }, []);

    const handleFileSelect = (files: File[]) => {
        if (!files[0].type.includes('pdf')) {
            toast({ title: 'Invalid File', description: 'Please select a PDF file.', variant: 'destructive' });
            return;
        }
        setPdfFile(files[0]);
    };

    useEffect(() => {
        if (!pdfFile || !pdfjs) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
            try {
                const doc = await pdfjs.getDocument(typedArray).promise;
                setPdfDoc(doc);
            } catch (error) {
                toast({ title: 'Error loading PDF', description: 'Could not load the PDF file.', variant: 'destructive' });
            }
        };
        reader.readAsArrayBuffer(pdfFile);
    }, [pdfFile, toast, pdfjs]);

    const convertToImages = async () => {
        if (!pdfDoc) return;
        setIsProcessing(true);
        setProgress(0);
        const zip = new JSZip();

        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                if (blob) {
                    zip.file(`page-${i}.png`, blob);
                }
            }
            setProgress(((i / pdfDoc.numPages) * 100));
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = `${pdfFile?.name.replace('.pdf', '')}-images.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsProcessing(false);
        toast({ title: 'Success!', description: 'All pages have been converted and downloaded as a ZIP file.' });
    };

    return (
        <div className="space-y-6">
            {!pdfFile ? (
                <FileUploadArea onFileSelect={handleFileSelect} accept=".pdf" helpText="Select a PDF file" />
            ) : (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>File Ready for Conversion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>File:</strong> {pdfFile.name} ({prettyBytes(pdfFile.size)})</p>
                            <p><strong>Pages:</strong> {pdfDoc?.numPages || 'Loading...'}</p>
                            {isProcessing ? (
                                <div className="mt-4 space-y-2">
                                    <Label>Converting... {Math.round(progress)}%</Label>
                                    <Progress value={progress} />
                                </div>
                            ) : (
                                <Button onClick={convertToImages} disabled={!pdfDoc} className="mt-4">
                                    <ImageIcon className="mr-2" /> Convert to Images
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

function ImageToPdf({ color }: { color?: string }) {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleFileSelect = (files: File[]) => {
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if(validFiles.length !== files.length){
            toast({ title: 'Some files were not images', description: 'Only image files have been added.', variant: 'destructive' });
        }
        setImageFiles(prev => [...prev, ...validFiles]);
    };

    const convertToPdf = async () => {
        if (imageFiles.length === 0) return;
        setIsProcessing(true);
        
        // A4 dimensions in points (1 point = 1/72 inch)
        const a4Width = 595.28;
        const a4Height = 841.89;

        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
        });

        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const reader = new FileReader();

            await new Promise<void>(resolve => {
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target?.result as string;
                    img.onload = () => {
                        const imgWidth = img.width;
                        const imgHeight = img.height;
                        
                        const ratio = Math.min(a4Width / imgWidth, a4Height / imgHeight);
                        const newWidth = imgWidth * ratio;
                        const newHeight = imgHeight * ratio;

                        const x = (a4Width - newWidth) / 2;
                        const y = (a4Height - newHeight) / 2;

                        if (i > 0) doc.addPage();
                        doc.addImage(img, 'JPEG', x, y, newWidth, newHeight);
                        resolve();
                    };
                };
                reader.readAsDataURL(file);
            });
        }
        
        doc.save('converted-images.pdf');
        setIsProcessing(false);
        toast({ title: 'Success!', description: 'Images have been converted to a PDF.' });
    };

    return (
        <div className="space-y-6">
            {!imageFiles.length ? (
                <FileUploadArea onFileSelect={handleFileSelect} accept="image/*" helpText="Select one or more images" />
            ) : (
                <div className="space-y-4">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imageFiles.map((file, index) => (
                             <div key={index} className="relative aspect-square">
                                <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover rounded-md" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">{file.name}</div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={convertToPdf} disabled={isProcessing} className="mt-4">
                        <FileDown className="mr-2" />
                        {isProcessing ? 'Converting...' : `Convert ${imageFiles.length} Image(s) to PDF`}
                    </Button>
                </div>
            )}
        </div>
    );
}

function PdfSplitter({ color }: { color?: string }) {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState(0);
    const [range, setRange] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();
    const [pdfLib, setPdfLib] = useState<any>(null);

    useEffect(() => {
        const loadPdfLib = async () => {
            const lib = await import('pdf-lib');
            setPdfLib(lib);
        };
        loadPdfLib();
    }, []);

    const handleFileSelect = async (files: File[]) => {
        const file = files[0];
        if (!file.type.includes('pdf')) {
            toast({ title: 'Invalid File', description: 'Please select a PDF file.', variant: 'destructive' });
            return;
        }
        setPdfFile(file);
        
        if (pdfLib) {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await pdfLib.PDFDocument.load(arrayBuffer);
            setNumPages(pdfDoc.getPageCount());
        }
    };

    const handleSplit = async () => {
        if (!pdfFile || !range || !pdfLib) return;

        const pagesToExtract: number[] = [];
        try {
            range.split(',').forEach(part => {
                if (part.includes('-')) {
                    const [start, end] = part.split('-').map(Number);
                    for (let i = start; i <= end; i++) {
                        pagesToExtract.push(i - 1);
                    }
                } else {
                    pagesToExtract.push(Number(part) - 1);
                }
            });
        } catch (error) {
            toast({ title: 'Invalid Range', description: 'Please check your page range syntax.', variant: 'destructive' });
            return;
        }

        setIsProcessing(true);

        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdfDoc = await pdfLib.PDFDocument.load(arrayBuffer);
        const newDoc = await pdfLib.PDFDocument.create();

        const copiedPages = await newDoc.copyPages(pdfDoc, pagesToExtract);
        copiedPages.forEach(page => newDoc.addPage(page));

        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `split-${pdfFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setIsProcessing(false);
        toast({ title: 'Success!', description: 'The selected pages have been extracted.' });
    };

    return (
        <div className="space-y-6">
            {!pdfFile ? (
                 <FileUploadArea onFileSelect={handleFileSelect} accept=".pdf" helpText="Select a PDF file to split" />
            ) : (
                 <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Split PDF</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p><strong>File:</strong> {pdfFile.name} ({prettyBytes(pdfFile.size)})</p>
                            <p><strong>Total Pages:</strong> {numPages}</p>
                            <div>
                                <Label htmlFor="range">Pages to Extract</Label>
                                <Input 
                                    id="range"
                                    value={range}
                                    onChange={(e) => setRange(e.target.value)}
                                    placeholder="e.g., 1, 3-5, 8"
                                    className="text-base"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Enter page numbers or ranges, separated by commas.
                                </p>
                            </div>
                             <Button onClick={handleSplit} disabled={isProcessing || !range}>
                                <Scissors className="mr-2" />
                                {isProcessing ? 'Splitting...' : 'Split PDF'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export function PdfToolkit({ color = 'hsl(var(--primary))' }: PdfToolkitProps) {
  const [activeTool, setActiveTool] = useState(tools[0].slug);
  const ActiveComponent = tools.find(t => t.slug === activeTool)?.component;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3">
            <nav className="flex flex-col space-y-1">
            {tools.map(tool => (
                <Button
                    key={tool.slug}
                    variant={activeTool === tool.slug ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTool(tool.slug)}
                >
                    <tool.icon className="mr-2 h-5 w-5" />
                    {tool.title}
                </Button>
            ))}
            </nav>
        </aside>
        <main className="col-span-12 md:col-span-9">
            {ActiveComponent && <ActiveComponent color={color} />}
        </main>
    </div>
  );
}
