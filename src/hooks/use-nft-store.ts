
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Nft } from '@/lib/types';
import placeholderData from '@/lib/placeholder-images.json';

const NFT_STORAGE_KEY = 'storyverse_nfts';

// This function is safe because it's only called within `addNft`, which is a client-side interaction.
const generateRandomHash = () => `0x${Array.from({ length: 10 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;

export function useNftStore() {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, so localStorage is safe to use.
    try {
      const storedNfts = localStorage.getItem(NFT_STORAGE_KEY);
      if (storedNfts) {
        setNfts(JSON.parse(storedNfts));
      } else {
        localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify([]));
        setNfts([]);
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
      setNfts([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateLocalStorage = (updatedNfts: Nft[]) => {
    try {
      localStorage.setItem(NFT_STORAGE_KEY, JSON.stringify(updatedNfts));
      setNfts(updatedNfts);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const addNft = useCallback((newNftData: Omit<Nft, 'hash' | 'imageUrl' | 'imageHint' | 'owners'> & { owner: string }): Nft => {
    const randomImage = placeholderData.placeholderImages[Math.floor(Math.random() * placeholderData.placeholderImages.length)];
    
    const newNft: Nft = {
      title: newNftData.title,
      description: newNftData.description,
      content: newNftData.content,
      hash: generateRandomHash(),
      imageUrl: randomImage.imageUrl,
      imageHint: randomImage.imageHint,
      owners: [{ address: newNftData.owner, timestamp: Date.now() }],
    };
    
    // Read from localStorage at the time of action to ensure we have the latest data.
    const currentNfts = JSON.parse(localStorage.getItem(NFT_STORAGE_KEY) || '[]');
    const updatedNfts = [newNft, ...currentNfts];
    updateLocalStorage(updatedNfts);
    return newNft;
  }, []);

  const transferNft = useCallback((hash: string, newOwnerAddress: string): boolean => {
    const currentNfts = JSON.parse(localStorage.getItem(NFT_STORAGE_KEY) || '[]');
    const nftIndex = currentNfts.findIndex((nft: Nft) => nft.hash === hash);
    if (nftIndex === -1) return false;

    const updatedNft = {
      ...currentNfts[nftIndex],
      owners: [...currentNfts[nftIndex].owners, { address: newOwnerAddress, timestamp: Date.now() }]
    };

    const updatedNfts = [...currentNfts];
    updatedNfts[nftIndex] = updatedNft;
    
    updateLocalStorage(updatedNfts);
    return true;
  }, []);
  
  const getNftByHash = useCallback((hash: string): Nft | undefined => {
    // This function can be called on server and client. 
    // It relies on the `nfts` state, which is safely initialized in useEffect.
    return nfts.find(nft => nft.hash === hash);
  }, [nfts]);


  return { nfts, isLoaded, addNft, transferNft, getNftByHash };
}
