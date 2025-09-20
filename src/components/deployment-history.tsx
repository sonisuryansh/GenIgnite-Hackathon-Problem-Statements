'use client';

import { useWallet } from '@/contexts/wallet-context';
import { useNftStore } from '@/hooks/use-nft-store';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { History, Wallet } from 'lucide-react';
import { useIsClient } from '@/hooks/use-is-client';
import { useMemo } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ScrollArea } from './ui/scroll-area';

export default function DeploymentHistory() {
  const { walletAddress, isConnected, connectWallet } = useWallet();
  const { nfts, isLoaded } = useNftStore();
  const isClient = useIsClient();

  const userCreations = useMemo(() => {
    if (!isClient || !isLoaded || !walletAddress) {
      return [];
    }
    return nfts
      .filter((nft) => nft.owners.some((owner) => owner.address === walletAddress))
      .sort((a, b) => {
        const aTimestamp = a.owners.find(o => o.address === walletAddress)?.timestamp || 0;
        const bTimestamp = b.owners.find(o => o.address === walletAddress)?.timestamp || 0;
        return bTimestamp - aTimestamp;
      });
  }, [nfts, walletAddress, isLoaded, isClient]);

  if (!isClient || !isConnected) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <History className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">History</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Deployment History</SheetTitle>
          <SheetDescription>
            A list of all the creations you have minted or received with the connected wallet.
          </SheetDescription>
          <div className="text-xs text-muted-foreground pt-2">
            <p>
              Connected: <span className="font-mono">{walletAddress}</span>
            </p>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-8rem)] pr-4">
          <div className="py-4 space-y-4">
            {isLoaded && userCreations.length > 0 ? (
              userCreations.map((nft) => (
                <Link href={`/nft/${nft.hash}`} key={nft.hash}>
                  <div className="p-4 rounded-md border hover:bg-secondary transition-colors cursor-pointer">
                    <h4 className="font-semibold">{nft.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Acquired on:{' '}
                      {format(new Date(nft.owners.find(o => o.address === walletAddress)!.timestamp), 'PPpp')}
                    </p>
                    <p className="text-xs text-muted-foreground/50 mt-1 font-mono">
                      Hash: {nft.hash}
                    </p>
                  </div>
                </Link>
              ))
            ) : isLoaded ? (
              <div className="text-center text-muted-foreground p-8">
                <p>You haven't minted or received any creations with this wallet yet.</p>
                <Button variant="link" asChild>
                  <Link href="/create">Create one now</Link>
                </Button>
              </div>
            ) : (
              <p>Loading history...</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
