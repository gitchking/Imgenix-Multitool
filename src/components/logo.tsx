import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, size = 60 }: { className?: string, size?: number }) {
  return (
    <Image
      src="https://files.catbox.moe/rufk21.gif"
      alt="Imgenix Logo"
      width={size}
      height={size}
      className={cn(className)}
      unoptimized
    />
  );
}
