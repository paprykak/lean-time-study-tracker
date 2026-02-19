'use server';
/**
 * @fileOverview A Genkit flow for suggesting consistent and relevant task descriptions.
 *
 * - suggestTaskDescription - A function that handles the task description suggestion process.
 * - SuggestTaskDescriptionInput - The input type for the suggestTaskDescription function.
 * - SuggestTaskDescriptionOutput - The return type for the suggestTaskDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskDescriptionInputSchema = z.object({
  partialDescription: z
    .string()
    .describe('The incomplete task description entered by the user.'),
});
export type SuggestTaskDescriptionInput = z.infer<typeof SuggestTaskDescriptionInputSchema>;

const SuggestTaskDescriptionOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested consistent and relevant task descriptions.'),
});
export type SuggestTaskDescriptionOutput = z.infer<typeof SuggestTaskDescriptionOutputSchema>;

export async function suggestTaskDescription(
  input: SuggestTaskDescriptionInput
): Promise<SuggestTaskDescriptionOutput> {
  return suggestTaskDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskDescriptionPrompt',
  input: {schema: SuggestTaskDescriptionInputSchema},
  output: {schema: SuggestTaskDescriptionOutputSchema},
  prompt: `You are an expert manufacturing process engineer. Based on the partial task description provided, suggest 3-5 consistent and relevant full task descriptions that align with common manufacturing terms and practices. Focus on clarity, conciseness, and standardization.

If no good suggestions can be made, return an empty array.

Partial Description: {{{partialDescription}}}`, 
});

const suggestTaskDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestTaskDescriptionFlow',
    inputSchema: SuggestTaskDescriptionInputSchema,
    outputSchema: SuggestTaskDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
