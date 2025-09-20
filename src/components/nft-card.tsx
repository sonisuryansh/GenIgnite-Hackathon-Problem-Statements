import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Nft } from '@/lib/types';

interface NftCardProps {
  nft: Nft;
}

export default function NftCard({ nft }: NftCardProps) {
  return (
    <Link href={`/nft/${nft.hash}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary">
        <CardHeader className="p-0">
          <div className="aspect-[3/2] relative">
            <Image
              src={nft.imageUrl}
              alt={nft.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={nft.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="font-headline text-lg line-clamp-2">
            {nft.title}
          </CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
