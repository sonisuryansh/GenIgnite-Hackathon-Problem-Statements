import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/auth-context';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import Header from '@/components/header';
import { cn } from '@/lib/utils';
import DeploymentHistory from '@/components/deployment-history';

export const metadata: Metadata = {
  title: 'EpicMint',
  description:
    'Write, Own, and Earn: The Web3 Marketplace for Stories, Comics, and Poems',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <AuthProvider>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <DeploymentHistory />
          <Toaster />
        </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
