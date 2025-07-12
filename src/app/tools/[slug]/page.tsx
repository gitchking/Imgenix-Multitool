
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnlineNotepad } from '@/components/tools/online-notepad';
import { ImageCompressor } from '@/components/tools/image-compressor';
import { ImageCropper } from '@/components/tools/image-cropper';
import { ImageUpscaler } from '@/components/tools/image-upscaler';
import { ImageFormatConverter } from '@/components/tools/image-format-converter';
import { ImageRotator } from '@/components/tools/image-rotator';
import { ImageEffects } from '@/components/tools/image-effects';
import { WatermarkImage } from '@/components/tools/watermark-image';
import { PdfToolkit } from '@/components/tools/pdf-toolkit';
import { Translator } from '@/components/tools/translator';
import { ColorBackgroundGenerator } from '@/components/tools/color-background-generator';
import { ColorPaletteExplorer } from '@/components/tools/color-palette-explorer';
import { RandomCatGenerator } from '@/components/tools/random-cat-generator';
import { RandomDogViewer } from '@/components/tools/random-dog-viewer';
import { RandomMealGenerator } from '@/components/tools/random-meal-generator';
import { ChuckNorrisJokeGenerator } from '@/components/tools/chuck-norris-joke-generator';
import { WaifuMoodGenerator } from '@/components/tools/waifu-mood-generator';
import { FindAnimeFromScreenshot } from '@/components/tools/find-anime-from-screenshot';
import { RandomAnimeRecommender } from '@/components/tools/random-anime-recommender';
import { QrCodeGenerator } from '@/components/tools/qr-code-generator';
import { CalculatorKit } from '@/components/tools/calculator-kit';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { tools } from '@/lib/tools';
import type { Tool } from '@/lib/tools';

const getToolDetails = (slug: string): Tool => {
  const tool = tools.find((t) => t.slug === slug);
  if (tool) {
    return tool;
  }
  return {
    slug,
    title: slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    description: '',
    icon: HelpCircle,
  };
};

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolDetails(params.slug);

  const renderTool = () => {
    switch (params.slug) {
      case 'image-compressor':
        return <ImageCompressor color={tool.color} />;
      case 'image-cropper':
        return <ImageCropper color={tool.color} />;
      case 'image-upscaler':
        return <ImageUpscaler color={tool.color} />;
      case 'image-format-converter':
        return <ImageFormatConverter color={tool.color} />;
      case 'image-rotator':
        return <ImageRotator color={tool.color} />;
      case 'image-effects':
        return <ImageEffects color={tool.color} />;
      case 'watermark-image':
        return <WatermarkImage color={tool.color} />;
      case 'pdf-toolkit':
        return <PdfToolkit color={tool.color} />;
      case 'translator':
        return <Translator color={tool.color} />;
      case 'online-notepad':
        return <OnlineNotepad />;
      case 'color-background-generator':
        return <ColorBackgroundGenerator color={tool.color} />;
      case 'color-palette-explorer':
        return <ColorPaletteExplorer color={tool.color} />;
      case 'random-cat-generator':
        return <RandomCatGenerator color={tool.color} />;
      case 'random-dog-viewer':
        return <RandomDogViewer color={tool.color} />;
      case 'random-meal-generator':
        return <RandomMealGenerator color={tool.color} />;
      case 'chuck-norris-joke-generator':
        return <ChuckNorrisJokeGenerator color={tool.color} />;
      case 'waifu-mood-generator':
        return <WaifuMoodGenerator color={tool.color} />;
      case 'find-anime-from-screenshot':
        return <FindAnimeFromScreenshot color={tool.color} />;
      case 'random-anime-recommender':
        return <RandomAnimeRecommender color={tool.color} />;
      case 'qr-code-generator':
        return <QrCodeGenerator color={tool.color} />;
      case 'calculator-kit':
        return <CalculatorKit color={tool.color}/>;
      default:
        return (
          <div className="flex h-96 w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
            <p className="text-muted-foreground">
              Tool workspace for {tool.title}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-4 h-full">
      <div className="relative h-full flex flex-col">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>
        
        <Card
          className="overflow-hidden border-2 shadow-lg flex-1 flex flex-col"
          style={
            {
              '--tool-color': tool.color || 'hsl(var(--primary))',
              borderColor: 'var(--tool-color)',
            } as React.CSSProperties
          }
        >
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div 
                className="flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: 'var(--tool-color)' }}
              >
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle
                  className="font-body text-2xl font-bold"
                  style={{ color: 'var(--tool-color)' }}
                >
                  {tool.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {tool.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex-1 flex flex-col">
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
              {renderTool()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}
