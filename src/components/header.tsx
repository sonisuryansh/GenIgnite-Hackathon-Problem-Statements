import Link from 'next/link';
import ConnectWallet from './connect-wallet';
import { SearchForm } from './search-form';
import { Button } from './ui/button';
import { BookOpen, Sparkles, FileCode } from 'lucide-react';
import DeploymentHistory from './deployment-history';

export default function Header() {
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
            <ConnectWallet />
          </nav>
        </div>
      </div>
    </header>
  );
}
