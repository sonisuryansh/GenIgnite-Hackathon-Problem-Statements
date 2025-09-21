// components/auth/withAuth.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Loading state ke liye

// Yeh ek Higher-Order Component (HOC) hai
export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const AuthComponent = (props: P) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Jab loading khatam ho jaye aur user login na ho
      if (!isLoading && !user) {
        router.push('/signin'); // signin page par bhej do
      }
    }, [user, isLoading, router]);

    // Jab tak check ho raha hai, loading state dikhayein
    if (isLoading || !user) {
      return (
        <div className="container mx-auto py-8 space-y-4">
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }

    // Agar user logged in hai, toh actual page dikhayein
    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
}