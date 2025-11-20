
'use server';
/**
 * @fileOverview A document summarization AI agent.
 *
 * - summarizeDocumentContent - A function that handles the document summarization process.
 * - SummarizeDocumentContentInput - The input type for the summarizeDocumentContent function.
 * - SummarizeDocumentContentOutput - The return type for the summarizeDocumentContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentContentInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to summarize.'),
});
export type SummarizeDocumentContentInput = z.infer<typeof SummarizeDocumentContentInputSchema>;

const SummarizeDocumentContentOutputSchema = z.object({
  summary: z.string().describe('A short summary of the document content.'),
  progress: z.string().describe('Progress of summarization.'),
});
export type SummarizeDocumentContentOutput = z.infer<typeof SummarizeDocumentContentOutputSchema>;

export async function summarizeDocumentContent(input: SummarizeDocumentContentInput): Promise<SummarizeDocumentContentOutput> {
  return summarizeDocumentContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentContentPrompt',
  input: {schema: SummarizeDocumentContentInputSchema},
  output: {schema: SummarizeDocumentContentOutputSchema},
  prompt: `You are an expert summarizer.  Please provide a short summary of the following document content:\n\n{{{documentContent}}}`,
});

const summarizeDocumentContentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentContentFlow',
    inputSchema: SummarizeDocumentContentInputSchema,
    outputSchema: SummarizeDocumentContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (output) {
      output.progress = 'Generated a short summary of the document content.';
      return output;
    }
    // If output is null, return a default or error state.
    return {
      summary: 'Could not generate a summary.',
      progress: 'Failed to generate summary.',
    };
  }
);
