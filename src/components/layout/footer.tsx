
import Link from 'next/link';
import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container grid h-20 grid-cols-3 items-center">
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size={80} />
            <span className="font-brand text-4xl font-bold uppercase tracking-tight">
              I<span className="text-brand-blue">m</span>geni<span className="text-foreground">x</span>
            </span>
          </Link>
        </div>
        
        <p className="text-center text-base font-headline font-semibold text-foreground">
          © 2025 IMGENIX 💜 | ALL RIGHTS RESERVED
        </p>
        
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/changelog"
            className="text-base font-body font-semibold text-foreground hover:text-primary whitespace-nowrap"
          >
            CHANGELOG
          </Link>
          <Link
            href="/tos"
            className="text-base font-body font-semibold text-foreground hover:text-primary whitespace-nowrap"
          >
            TERMS OF SERVICE
          </Link>
          <Link
            href="/privacy"
            className="text-base font-body font-semibold text-foreground hover:text-primary whitespace-nowrap"
          >
            PRIVACY POLICY
          </Link>
        </div>
      </div>
    </footer>
  );
}
