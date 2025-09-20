// src/ai/flows/generate-content-with-ai.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating story content using AI.
 *
 * It includes:
 * - generateContentWithAI - A function to generate story content based on a text prompt.
 * - GenerateContentWithAIInput - The input type for the generateContentWithAI function.
 * - GenerateContentWithAIOutput - The output type for the generateContentWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentWithAIInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired story content.'),
});

export type GenerateContentWithAIInput = z.infer<typeof GenerateContentWithAIInputSchema>;

const GenerateContentWithAIOutputSchema = z.object({
  content: z.string().describe('The AI-generated story content.'),
});

export type GenerateContentWithAIOutput = z.infer<typeof GenerateContentWithAIOutputSchema>;

export async function generateContentWithAI(input: GenerateContentWithAIInput): Promise<GenerateContentWithAIOutput> {
  return generateContentWithAIFlow(input);
}

const generateContentPrompt = ai.definePrompt({
  name: 'generateContentPrompt',
  input: {schema: GenerateContentWithAIInputSchema},
  output: {schema: GenerateContentWithAIOutputSchema},
  prompt: `Generate a story based on the following prompt:\n\n{{{prompt}}}`, 
});

const generateContentWithAIFlow = ai.defineFlow(
  {
    name: 'generateContentWithAIFlow',
    inputSchema: GenerateContentWithAIInputSchema,
    outputSchema: GenerateContentWithAIOutputSchema,
  },
  async input => {
    const {output} = await generateContentPrompt(input);
    return output!;
  }
);
