'use server';

/**
 * @fileOverview Analyzes a prediction of the Iris flower species based on the provided measurements.
 *
 * - analyzePrediction - A function that handles the analysis of the prediction.
 * - AnalyzePredictionInput - The input type for the analyzePrediction function.
 * - AnalyzePredictionOutput - The return type for the analyzePrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePredictionInputSchema = z.object({
  sepalLength: z.number().describe('Sepal length in cm'),
  sepalWidth: z.number().describe('Sepal width in cm'),
  petalLength: z.number().describe('Petal length in cm'),
  petalWidth: z.number().describe('Petal width in cm'),
  prediction: z.string().describe('The predicted Iris flower species'),
});
export type AnalyzePredictionInput = z.infer<typeof AnalyzePredictionInputSchema>;

const AnalyzePredictionOutputSchema = z.object({
  explanation: z.string().describe('Explanation of what key aspects of the data might have led to the predicted result.'),
});
export type AnalyzePredictionOutput = z.infer<typeof AnalyzePredictionOutputSchema>;

export async function analyzePrediction(input: AnalyzePredictionInput): Promise<AnalyzePredictionOutput> {
  return analyzePredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePredictionPrompt',
  input: {schema: AnalyzePredictionInputSchema},
  output: {schema: AnalyzePredictionOutputSchema},
  prompt: `You are an expert botanist specializing in Iris flower species prediction.

You have predicted the Iris flower species to be "{{{prediction}}}" based on the following measurements:

Sepal Length: {{{sepalLength}}} cm
Sepal Width: {{{sepalWidth}}} cm
Petal Length: {{{petalLength}}} cm
Petal Width: {{{petalWidth}}} cm

Explain in a short sentence what key aspects of the data might have led to this result.
`,
});

const analyzePredictionFlow = ai.defineFlow(
  {
    name: 'analyzePredictionFlow',
    inputSchema: AnalyzePredictionInputSchema,
    outputSchema: AnalyzePredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
