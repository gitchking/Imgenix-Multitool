
import {
  Crop,
  FileImage,
  FileText,
  Merge,
  Shrink,
  NotebookText,
  Replace,
  ScanText,
  Split,
  type LucideIcon,
  Scaling,
  RotateCw,
  Palette,
  FileSignature,
  Edit,
  FileUp,
  Rows,
  Languages,
  FlipHorizontal,
  Layers,
  SwatchBook,
  Smartphone,
  Wand2,
  FileArchive,
  Cat,
  Dog,
  Globe,
  Utensils,
  MessageSquareQuote,
  Quote,
  Heart,
  Search,
  Film,
  QrCode,
  KeyRound,
  Map,
  Scan,
  Braces,
  FileCode,
  Music,
  Lightbulb,
  Calculator,
  Scale,
} from 'lucide-react';

export interface Tool {
  title: string;
  description: string;
  slug: string;
  icon: LucideIcon;
  color?: string;
}

export const tools: Tool[] = [
  {
    title: 'Translator',
    description: 'Translate text between multiple languages.',
    slug: 'translator',
    icon: Languages,
    color: '#D946EF', // Fuchsia
  },
  {
    title: 'PDF Toolkit',
    description:
      'A comprehensive suite for PDF tasks: merge, split, compress, convert, and more.',
    slug: 'pdf-toolkit',
    icon: FileArchive,
    color: '#EF4444', // Strong Red
  },
  {
    title: 'Image Cropper',
    description: 'Crop images with free ratio, 1:1, 16:9, and more.',
    slug: 'image-cropper',
    icon: Crop,
    color: '#10B981', // Emerald Green
  },
  {
    title: 'Image Rotator',
    description: 'Rotate and flip images with ease and precision.',
    slug: 'image-rotator',
    icon: RotateCw,
    color: '#6366F1', // Indigo
  },
  {
    title: 'Image Effects',
    description: 'Apply effects like grayscale, invert, saturation, blur & glow.',
    slug: 'image-effects',
    icon: Palette,
    color: '#EC4899', // Pink
  },
  {
    title: 'Image Upscaler',
    description: 'Upscale images and enhance clarity with sharpening filters.',
    slug: 'image-upscaler',
    icon: Scaling,
    color: '#F97316', // Bright Orange
  },
  {
    title: 'Online Notepad',
    description: 'A simple notepad that saves to your browser. Quick, easy, and secure.',
    slug: 'online-notepad',
    icon: NotebookText,
    color: '#F59E0B', // Amber
  },
  {
    title: 'Watermark Image',
    description: 'Add a text or logo watermark with advanced effects.',
    slug: 'watermark-image',
    icon: FileSignature,
    color: '#0EA5E9', // Sky Blue
  },
  {
    title: 'Random Dog Viewer',
    description: 'Get a new random dog picture with the click of a button.',
    slug: 'random-dog-viewer',
    icon: Dog,
    color: '#F59E0B', // Amber
  },
  {
    title: 'Image Compressor',
    description: 'Reduce image file size with an advanced quality slider.',
    slug: 'image-compressor',
    icon: Shrink,
    color: '#3B82F6', // Vibrant Blue
  },
  {
    title: 'Chuck Norris Jokes',
    description: "Generate facts about the world's toughest man.",
    slug: 'chuck-norris-joke-generator',
    icon: MessageSquareQuote,
    color: '#4B5563', // Gray
  },
  {
    title: 'Waifu Mood Generator',
    description: 'Generate SFW anime images for different moods and reactions.',
    slug: 'waifu-mood-generator',
icon: Heart,
    color: '#EC4899', // Pink
  },
  {
    title: 'Random Cat Generator',
    description: 'Generate random cat images, with optional text overlays.',
    slug: 'random-cat-generator',
    icon: Cat,
    color: '#6D28D9', // Deep Purple
  },
  {
    title: 'Random Meal Generator',
    description: 'Discover new recipes with ingredients and instructions.',
    slug: 'random-meal-generator',
    icon: Utensils,
    color: '#DC2626', // Red
  },
  {
    title: 'Color Palette Explorer',
    description: 'Discover curated color palettes or generate random new ones.',
    slug: 'color-palette-explorer',
    icon: SwatchBook,
    color: '#14B8A6', // Teal
  },
  {
    title: 'Image Format Converter',
    description: 'Convert between JPG, PNG, and WebP formats.',
    slug: 'image-format-converter',
    icon: Replace,
    color: '#A855F7', // Rich Purple
  },
  {
    title: 'Random Anime Recommender',
    description: 'Get a random anime recommendation with details and a trailer.',
    slug: 'random-anime-recommender',
    icon: Film,
    color: '#F43F5E', // Rose
  },
  {
    title: 'Color Background Generator',
    description: 'Create solid, gradient, and mesh backgrounds. Export to CSS or PNG.',
    slug: 'color-background-generator',
    icon: Layers,
    color: '#8B5CF6', // Deep Violet
  },
  {
    title: 'Find Anime From Screenshot',
    description: 'Upload a screenshot to find out which anime it is from.',
    slug: 'find-anime-from-screenshot',
    icon: Search,
    color: '#8B5CF6', // Violet
  },
  {
    title: 'QR Code Generator',
    description: 'Create custom QR codes or scan one from an image.',
    slug: 'qr-code-generator',
    icon: QrCode,
    color: '#10B981', // Emerald
  },
  {
    title: 'Calculator Kit',
    description: 'A collection of 10+ useful calculators for various needs.',
    slug: 'calculator-kit',
    icon: Calculator,
    color: '#84cc16', // Lime Green
  },
];
