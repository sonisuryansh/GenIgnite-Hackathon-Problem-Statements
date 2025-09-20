
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWallet } from '@/contexts/wallet-context';
import { useNftStore } from '@/hooks/use-nft-store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wallet } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  content: z.string().min(20, { message: 'Content must be at least 20 characters long.' }),
});

export default function CreatePage() {
  const router = useRouter();
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const { addNft } = useNftStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isConnected || !walletAddress) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to mint an NFT.',
        variant: 'destructive',
      });
      return;
    }

    const newNft = addNft({
      ...values,
      owner: walletAddress,
    });

    toast({
      title: 'NFT Deployed Successfully!',
      description: `Your masterpiece "${newNft.title}" is now on the NFT marketplace.`,
    });

    router.push(`/nft/${newNft.hash}`);
  }
  
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create a New Masterpiece</CardTitle>
          <CardDescription>Mint your story, poem, or comic as a unique NFT on the blockchain.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertTitle>Connect your wallet</AlertTitle>
              <AlertDescription>
                You need to connect your wallet before you can mint a new creation.
                <Button onClick={connectWallet} className="mt-4 w-full">Connect Wallet</Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="The Name of the Wind" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A brief summary of your creation..." className="resize-y" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Once upon a time..." className="resize-y min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="w-full">Mint Your Creation</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
