// src/ai/flows/generate-starter-prompt.ts
'use server';

/**
 * @fileOverview Generates starter values for sepal length, sepal width, petal length, and petal width.
 *
 * - generateStarterPrompt - A function that generates starter values for the Iris flower measurements.
 * - GenerateStarterPromptInput - The input type for the generateStarterPrompt function.
 * - GenerateStarterPromptOutput - The return type for the generateStarterPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStarterPromptInputSchema = z.object({});
export type GenerateStarterPromptInput = z.infer<typeof GenerateStarterPromptInputSchema>;

const GenerateStarterPromptOutputSchema = z.object({
  sepalLength: z.number().describe('Example sepal length in cm.'),
  sepalWidth: z.number().describe('Example sepal width in cm.'),
  petalLength: z.number().describe('Example petal length in cm.'),
  petalWidth: z.number().describe('Example petal width in cm.'),
});
export type GenerateStarterPromptOutput = z.infer<typeof GenerateStarterPromptOutputSchema>;

export async function generateStarterPrompt(
  input: GenerateStarterPromptInput
): Promise<GenerateStarterPromptOutput> {
  return generateStarterPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStarterPromptPrompt',
  input: {schema: GenerateStarterPromptInputSchema},
  output: {schema: GenerateStarterPromptOutputSchema},
  prompt: `You are a botanist providing example measurements for an Iris flower.

  Generate example values for sepal length, sepal width, petal length, and petal width in cm.
  Provide realistic values for a typical Iris flower.
  Return the values as a JSON object.`,
});

const generateStarterPromptFlow = ai.defineFlow(
  {
    name: 'generateStarterPromptFlow',
    inputSchema: GenerateStarterPromptInputSchema,
    outputSchema: GenerateStarterPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
