'use server';

/**
 * @fileOverview This file contains a Genkit flow for providing personalized MyRepublic plan recommendations.
 *
 * The flow takes into account the user's address and internet usage habits to suggest the most suitable plan.
 *
 * @exports personalizedOfferRecommendations - A function to trigger the flow.
 * @exports PersonalizedOfferRecommendationsInput - The input type for the personalizedOfferRecommendations function.
 * @exports PersonalizedOfferRecommendationsOutput - The return type for the personalizedOfferRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedOfferRecommendationsInputSchema = z.object({
  address: z.string().describe('The user\u0027s address in Malang.'),
  internetUsageHabits: z
    .string()
    .describe(
      'A description of the user\u0027s typical internet usage habits (e.g., streaming, gaming, browsing).' // Corrected typo here
    ),
});
export type PersonalizedOfferRecommendationsInput = z.infer<typeof PersonalizedOfferRecommendationsInputSchema>;

const PersonalizedOfferRecommendationsOutputSchema = z.object({
  recommendedPlanName: z.string().describe('The name of the recommended MyRepublic plan.'),
  recommendedPlanDescription: z.string().describe('A description of the recommended plan and why it is suitable for the user.'),
});
export type PersonalizedOfferRecommendationsOutput = z.infer<typeof PersonalizedOfferRecommendationsOutputSchema>;

export async function personalizedOfferRecommendations(input: PersonalizedOfferRecommendationsInput): Promise<PersonalizedOfferRecommendationsOutput> {
  return personalizedOfferRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedOfferRecommendationsPrompt',
  input: {schema: PersonalizedOfferRecommendationsInputSchema},
  output: {schema: PersonalizedOfferRecommendationsOutputSchema},
  prompt: `You are an AI assistant specialized in recommending MyRepublic internet plans to users in Malang.

  Based on the user's address and internet usage habits, recommend the most suitable MyRepublic plan.

  Address: {{{address}}}
  Internet Usage Habits: {{{internetUsageHabits}}}

  Consider the following factors when making your recommendation:
  - MyRepublic plans available in Malang
  - The user's internet usage habits (e.g., streaming, gaming, browsing)
  - The user's budget

  Provide the recommended plan name and a brief description of why it is suitable for the user.

  Ensure that the output is in the correct JSON format.`, // Added instructions to ensure JSON format
});

const personalizedOfferRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedOfferRecommendationsFlow',
    inputSchema: PersonalizedOfferRecommendationsInputSchema,
    outputSchema: PersonalizedOfferRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
