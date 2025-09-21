// components/Header.tsx (or your Header file)
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Firebase and Auth Context imports
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

// Your existing components
import { SearchForm } from './search-form';
import DeploymentHistory from './deployment-history';

// Shadcn UI and Lucide Icons
import { Button } from './ui/button';
import { BookOpen, Sparkles, FileCode } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, isLoading } = useAuth(); // Auth state ko get karein
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/signin'); // Logout ke baad signin page par bhej dein
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 font-headline text-lg font-semibold"
          >
            EpicMint
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchForm />
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/create">
                <BookOpen className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Create</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/create-ai">
                <Sparkles className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">AI</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/contract">
                <FileCode className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Contract</span>
              </Link>
            </Button>
            <DeploymentHistory />
            
            {/* ====== START: DYNAMIC AUTH SECTION ====== */}
            <div className="ml-2">
                {isLoading ? (
                    // Loading state mein placeholder dikhayein
                    <div className="h-9 w-20 bg-muted rounded-md animate-pulse"></div>
                ) : user ? (
                    // --- AGAR USER LOGGED IN HAI ---
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL || ''} alt="User Avatar" />
                            <AvatarFallback>
                                {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
                            </AvatarFallback>
                        </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">My Account</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                            Profile & Wallet
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    // --- AGAR USER LOGGED OUT HAI ---
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                )}
            </div>
            
          </nav>
        </div>
      </div>
    </header>
  );
}
