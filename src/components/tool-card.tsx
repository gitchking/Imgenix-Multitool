
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

export function ToolCard({
  slug,
  title,
  description,
  icon: Icon,
  color,
}: ToolCardProps) {
  return (
    <Link href={`/tools/${slug}`} className="group block">
      <Card
        className="h-full transform-gpu border-border/80 bg-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/50"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
             <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: color ? `${color}20` : 'hsl(var(--accent))' }}
            >
              <Icon className="h-5 w-5" style={{ color: color || 'hsl(var(--primary))' }} />
            </div>
            <CardTitle
              className="font-body text-base font-semibold"
            >
              {title}
            </CardTitle>
          </div>
          <CardDescription className="mt-3 text-xs text-muted-foreground line-clamp-2">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
