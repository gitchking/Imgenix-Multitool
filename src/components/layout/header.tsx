
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Menu, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { tools } from '@/lib/tools';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/');
    } catch (error) {
      toast({
        title: 'Logout Failed',
        description: 'An error occurred while logging out.',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="w-full border-b bg-background">
      <div className="container grid h-20 grid-cols-3 items-center">
        {/* Left Section: Logo & Mobile Menu */}
        <div className="flex items-center justify-start">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo size={72} />
             <span className="hidden font-brand text-4xl font-bold uppercase tracking-tight text-foreground sm:inline-block">
              I<span className="text-brand-blue">m</span>geni<span className="text-foreground">x</span>
            </span>
          </Link>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-4">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold"
                  >
                    <Logo />
                    <span className="font-brand uppercase tracking-tight text-foreground">I<span className="text-brand-blue">m</span>geni<span className="text-foreground">x</span></span>
                  </Link>
                  <nav className="mt-4 flex flex-col gap-2">
                    <SheetClose asChild>
                      <Link href="/" className="text-base font-body font-semibold text-foreground">HOME</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/faq" className="text-base font-body font-semibold text-foreground">FAQ</Link>
                    </SheetClose>
                     <SheetClose asChild>
                      <Link href="/changelog" className="text-base font-body font-semibold text-foreground">CHANGELOG</Link>
                    </SheetClose>
                    <p className="mt-2 text-base font-body font-semibold">TOOLS</p>
                    {tools.map((tool) => (
                       <SheetClose asChild key={tool.slug}>
                        <Link href={`/tools/${tool.slug}`} className="flex items-center gap-2 pl-2 text-foreground">
                          <tool.icon className="h-4 w-4" />
                          <span>{tool.title}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Center Section: Desktop Navigation */}
        <nav className="hidden items-center justify-center md:flex">
          <div className="flex items-center space-x-8 text-base font-semibold">
            <Link
              href="/"
              className="font-body text-foreground transition-colors hover:text-primary"
            >
              HOME
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="font-body flex items-center gap-1 text-foreground transition-colors hover:text-primary focus:outline-none">
                TOOLS <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[450px]">
                 <div className="grid grid-cols-2 gap-1">
                    {tools.map((tool) => (
                    <DropdownMenuItem key={tool.slug} asChild>
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="flex items-center gap-2"
                          style={{ color: tool.color }}
                        >
                          <tool.icon className="h-4 w-4" />
                          <span>{tool.title}</span>
                        </Link>
                    </DropdownMenuItem>
                    ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/faq"
              className="font-body text-foreground transition-colors hover:text-primary"
            >
              FAQ
            </Link>
            <Link
              href="/changelog"
              className="font-body text-foreground transition-colors hover:text-primary"
            >
              CHANGELOG
            </Link>
          </div>
        </nav>

        {/* Right Section: Auth & Theme Toggle */}
        <div className="flex items-center justify-end space-x-4">
           <ThemeToggle />
          <div className="hidden items-center space-x-2 md:flex">
          {isLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
          ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user.displayName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/settings/account')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
