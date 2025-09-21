
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { useState } from 'react';
import { generateContentWithAI } from '@/ai/flows/generate-content-with-ai';
import { Loader2, Sparkles, Wallet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import withAuth from '@/components/auth/withAuth';

const generationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters.'),
});

const mintingSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  description: z.string().min(10, 'Description is required.'),
});

 function CreateWithAiPage() {
  const router = useRouter();
  const { isConnected, walletAddress, connectWallet } = useWallet();
  const { addNft } = useNftStore();
  const { toast } = useToast();
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generationForm = useForm<z.infer<typeof generationSchema>>({
    resolver: zodResolver(generationSchema),
    defaultValues: { prompt: '' },
  });

  const mintingForm = useForm<z.infer<typeof mintingSchema>>({
    resolver: zodResolver(mintingSchema),
    defaultValues: { title: '', description: '' },
  });

  async function onGenerate(values: z.infer<typeof generationSchema>) {
    setIsGenerating(true);
    setGeneratedContent('');
    try {
      const result = await generateContentWithAI({ prompt: values.prompt });
      setGeneratedContent(result.content);
      mintingForm.setValue('title', 'AI-Generated Story');
      mintingForm.setValue('description', `A story generated from the prompt: "${values.prompt.substring(0, 50)}..."`);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function onMint(values: z.infer<typeof mintingSchema>) {
    if (!isConnected || !walletAddress) {
      toast({ title: 'Wallet not connected', variant: 'destructive' });
      return;
    }
    if (!generatedContent) {
      toast({ title: 'No content to mint', variant: 'destructive' });
      return;
    }
    const newNft = addNft({
      ...values,
      content: generatedContent,
      owner: walletAddress,
    });
    toast({
      title: 'NFT Deployed Successfully!',
      description: `Your AI creation "${newNft.title}" is now on the NFT marketplace.`,
    });
    router.push(`/nft/${newNft.hash}`);
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Sparkles className="text-primary" /> Create with AI
          </CardTitle>
          <CardDescription>Use AI to generate a unique story or poem, then mint it as an NFT.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Form {...generationForm}>
            <form onSubmit={generationForm.handleSubmit(onGenerate)} className="space-y-4">
              <FormField
                control={generationForm.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Prompt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., A space pirate who discovers a map to a legendary treasure..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Content
              </Button>
            </form>
          </Form>

          {(isGenerating || generatedContent) && (
            <>
              <Separator />
              <div>
                <h3 className="font-headline text-2xl mb-4">Generated Content</h3>
                {isGenerating && <Skeleton className="h-40 w-full" />}
                {generatedContent && (
                  <Card className="bg-secondary p-4 whitespace-pre-wrap font-body text-sm">
                    {generatedContent}
                  </Card>
                )}
              </div>
            </>
          )}

          {generatedContent && (
            <>
              <Separator />
              <div>
                <h3 className="font-headline text-2xl mb-4">Mint Your AI Creation</h3>
                {!isConnected ? (
                  <Alert>
                    <Wallet className="h-4 w-4" />
                    <AlertTitle>Connect Your Wallet to Mint</AlertTitle>
                    <Button onClick={connectWallet} className="mt-4 w-full">Connect Wallet</Button>
                  </Alert>
                ) : (
                  <Form {...mintingForm}>
                    <form onSubmit={mintingForm.handleSubmit(onMint)} className="space-y-4">
                      <FormField
                        control={mintingForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={mintingForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" size="lg">Mint This Creation</Button>
                    </form>
                  </Form>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CreateWithAiPage);
