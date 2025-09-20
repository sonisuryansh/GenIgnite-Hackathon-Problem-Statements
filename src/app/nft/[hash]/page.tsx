'use client';

import { useNftStore } from '@/hooks/use-nft-store';
import { useWallet } from '@/contexts/wallet-context';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Nft } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ethers } from 'ethers'; // 1. IMPORT ethers library

export default function NftPage() {
  const params = useParams<{ hash: string }>();
  const hash = params.hash;

  const { getNftByHash, transferNft, isLoaded } = useNftStore();
  const { walletAddress, isConnected } = useWallet();
  const [nft, setNft] = useState<Nft | null | undefined>(undefined);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const { toast } = useToast();
  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const [receipt, setReceipt] = useState<{
    prevOwner: string;
    newOwner: string;
    hash: string;
    title: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    if (isLoaded && hash) {
      const foundNft = getNftByHash(hash);
      setNft(foundNft);
    }
  }, [hash, isLoaded, getNftByHash]);

  useEffect(() => {
    if (nft) {
      const reversedOwners = [...nft.owners].reverse();
      const dates = reversedOwners.slice(1).map((owner, index) => {
        const previousOwnerTimestamp = reversedOwners[index].timestamp;
        return format(new Date(previousOwnerTimestamp), "PPp");
      });
      setFormattedDates(dates);
    }
  }, [nft]);

  const handleTransfer = () => {
    if (!newOwnerAddress.trim() || !nft) {
      toast({
        title: 'Error',
        description: 'Please enter a wallet address.',
        variant: 'destructive',
      });
      return;
    }

    // 2. ADD address validation check
    if (!ethers.isAddress(newOwnerAddress)) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a correct wallet address (e.g., 0x...).',
        variant: 'destructive',
      });
      return; // Stop the function if the address is not valid
    }

    const previousOwner = nft.owners[nft.owners.length - 1].address;
    const success = transferNft(hash, newOwnerAddress);

    if (success) {
      const updatedNft = getNftByHash(hash);
      setNft(updatedNft);
      setNewOwnerAddress('');
      setReceipt({
        prevOwner: previousOwner,
        newOwner: newOwnerAddress,
        hash: nft.hash,
        title: nft.title,
        date: new Date().toLocaleString(),
      });
      toast({
        title: 'Transfer Successful!',
        description: 'Ownership has been transferred locally.',
      });
    } else {
      toast({
        title: 'Transfer Failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (nft === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-8 w-3/4 mt-4" />
        <Skeleton className="h-24 w-full mt-4" />
      </div>
    );
  }

  if (nft === null) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[50vh]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>NFT Not Found</AlertTitle>
          <AlertDescription>
            The NFT with hash "{hash}" could not be found. Please check the hash and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentOwner = nft.owners[nft.owners.length - 1];
  const isOwner = isConnected && walletAddress === currentOwner.address;
  const ownershipHistory = [...nft.owners].reverse();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {receipt && (
        <Dialog open={!!receipt} onOpenChange={() => setReceipt(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>NFT Transfer Receipt</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 my-4">
              <div className="flex justify-between items-center text-sm">
                <strong className="text-muted-foreground">NFT Title:</strong>
                <span className="font-mono">{receipt.title}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <strong className="text-muted-foreground">NFT Hash:</strong>
                <span className="font-mono truncate max-w-[200px]">{receipt.hash}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <strong className="text-muted-foreground">From:</strong>
                <span className="font-mono">{receipt.prevOwner}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <strong className="text-muted-foreground">To:</strong>
                <span className="font-mono">{receipt.newOwner}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <strong className="text-muted-foreground">Date/Time:</strong>
                <span className="font-mono">{receipt.date}</span>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setReceipt(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Card>
        <CardHeader>
          <div className="relative aspect-[16/9] w-full mb-6">
            <Image
              src={nft.imageUrl}
              alt={nft.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <CardTitle className="font-headline text-4xl">{nft.title}</CardTitle>
          <CardDescription>{nft.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none text-foreground/90 whitespace-pre-wrap font-body text-base">
            {nft.content}
          </div>
          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              <strong>Hash:</strong> {nft.hash}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-6">
          <Separator />
          <div>
            <h3 className="font-headline text-xl mb-4">Ownership History</h3>
            <div className="space-y-4">
              {ownershipHistory.map((owner, index) => (
                <div key={index} className="flex items-center gap-4 text-sm">
                  <div className="font-mono bg-secondary text-secondary-foreground p-2 rounded-md truncate">
                    {owner.address}
                  </div>
                  {index === 0 && (
                    <span className="text-xs font-semibold text-primary py-1 px-2 rounded-full bg-primary/10">CURRENT OWNER</span>
                  )}
                  {index > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {formattedDates[index - 1]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isOwner && (
            <Card className="mt-8 bg-secondary w-full">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Transfer Ownership</CardTitle>
                <CardDescription>
                  Enter the wallet address of the new owner to transfer this NFT. This action is irreversible.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input
                  placeholder="Recipient's wallet address (e.g., 0x...)"
                  value={newOwnerAddress}
                  onChange={(e) => setNewOwnerAddress(e.target.value)}
                />
                <Button onClick={handleTransfer}>Transfer</Button>
              </CardContent>
            </Card>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}