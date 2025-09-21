// src/contexts/wallet-context.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';

// Define the window.ethereum type to avoid TypeScript errors
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletState {
  isConnected: boolean;
  walletAddress: string | null;
  signer: JsonRpcSigner | null;
  provider: BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress(null);
    setSigner(null);
    setProvider(null);
    localStorage.removeItem('walletAddress');
    console.log("Wallet disconnected.");
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask is not installed.');
      // Yahan par aap alert ki jagah toast notification use karein toh behtar hoga
      alert('MetaMask is not installed. Please install it to continue.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();

      setWalletAddress(address);
      setSigner(ethersSigner);
      setProvider(ethersProvider);
      setIsConnected(true);
      localStorage.setItem('walletAddress', address);
      console.log("Wallet connected:", address);

    } catch (error: any) {
      if (error.code === 4001) {
        console.log('User rejected the connection request.');
        alert('You rejected the connection request. Please connect to continue.');
      } else {
        console.error('Error connecting to MetaMask:', error);
        alert('Failed to connect wallet. Please check the console for details.');
      }
    }
  }, []);

  // Effect to handle listeners and auto-connect
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log('User disconnected from MetaMask.');
        disconnectWallet();
      } else if (walletAddress !== accounts[0]) {
        // Automatically reconnect with the new account
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      // As per MetaMask docs, reload the page on chain change
      window.location.reload();
    };

    // Auto-connect if wallet address is in localStorage
    if (localStorage.getItem('walletAddress')) {
      connectWallet();
    }

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    
    // Cleanup function to remove listeners
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [connectWallet, disconnectWallet, walletAddress]); // Dependencies add ki gayi hain

  return (
    <WalletContext.Provider
      value={{ isConnected, walletAddress, signer, provider, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
