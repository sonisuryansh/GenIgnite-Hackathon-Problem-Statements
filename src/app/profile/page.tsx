// app/profile/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useWallet } from '@/contexts/wallet-context'; // Apne wallet context ko import karein
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const { connectWallet, walletAddress, isConnected } = useWallet(); // Apne wallet context se functions lein
  const router = useRouter();

  useEffect(() => {
    // Agar loading khatam ho gayi aur user nahi hai, toh signin page par bhej do
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/'); // Home page par redirect
  };

  // Jab tak user state load ho rahi hai, skeleton dikhayein
  if (isLoading) {
    return (
        <div className="container mx-auto py-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-1/4 mt-4" />
        </div>
    );
  }

  // Agar user logged in hai, toh profile dikhayein
  return (
    <div className="container mx-auto py-8">
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>UID:</strong> {user.uid}</p>
            
            <hr/>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Wallet Details</h3>
              {isConnected ? (
                <p><strong>Connected Wallet:</strong> {walletAddress}</p>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-2">
                    Please connect your wallet to create or view your NFTs.
                  </p>
                  <Button onClick={connectWallet}>Connect Wallet</Button>
                </div>
              )}
            </div>
            
            <Button variant="destructive" onClick={handleLogout} className="mt-6">Logout</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}