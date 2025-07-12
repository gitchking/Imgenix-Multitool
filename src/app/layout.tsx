
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Imgenix- Free Multitool WebApp 💙',
  description: 'Your free, modern, high-quality multitool web app.',
  icons: {
    icon: `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cdefs%3e%3clinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3e%3cstop offset='0%25' style='stop-color:hsl(270, 90%25, 80%25)'/%3e%3cstop offset='100%25' style='stop-color:hsl(270, 90%25, 65%25)'/%3e%3c/linearGradient%3e%3c/defs%3e%3crect width='100' height='100' rx='20' fill='url(%23g)'/%3e%3cpath d='M40 30 V 70 M60 30 V 70 M30 50 H 70' stroke='white' stroke-width='12' stroke-linecap='round' stroke-linejoin='round' fill='none' /%3e%3cpath d='M50 25 L 55 45 L 75 50 L 55 55 L 50 75 L 45 55 L 25 50 L 45 45 Z' fill='white'/%3e%3c/svg%3e`,
  },
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: '700',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased',
          inter.variable,
          poppins.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
