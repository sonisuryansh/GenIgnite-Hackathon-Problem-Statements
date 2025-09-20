
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useNftStore } from '@/hooks/use-nft-store';
import NftCard from '@/components/nft-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsClient } from '@/hooks/use-is-client';

export default function Home() {
  const { nfts, isLoaded } = useNftStore();
  const isClient = useIsClient();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
          EpicMint
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Write, Own, and Earn: The Web3 Marketplace for Stories, Comics, and
          Poems
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/create">Start Creating</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/create-ai">Create with AI</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-headline text-3xl font-bold mb-8">
          Explore Creations
        </h2>
        {!isClient || !isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[225px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
              <NftCard key={nft.hash} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-muted rounded-lg">
            <h3 className="font-headline text-2xl">No Creations Yet</h3>
            <p className="text-muted-foreground mt-2">
              Get started by creating your first masterpiece!
            </p>
            <Button asChild className="mt-6">
              <Link href="/create">Create Now</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
